import {
    BaseModal,
    Button,
    ButtonLink,
    ButtonPopup,
    CheckBox,
    Input,
    PaginatorWrapper,
    SimpleSelect,
    Table,
    TextArea,
    TransparentButtonWrapper,
} from '@isdd/idsk-ui-kit/index'
import { EnumTypePreview, EnumTypePreviewList } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiError } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ListIcon } from '@isdd/metais-common/assets/images'
import { BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BASE_PAGE_NUMBER, CreateEntityButton, isRowSelected } from '@isdd/metais-common/index'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string, lazy, ObjectSchema } from 'yup'
import { TFunction } from 'i18next'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import styles from './codelistsTable.module.scss'

import { CodelistsCreateForm } from '@/components/codelists/codelistsCreateForm/CodelistsCreateForm'
import { CodeListsMutations, CodelistFilter } from '@/components/containers/Codelist/CodelistContainer'

export interface CodelistsRefs {
    codeRefInput: React.MutableRefObject<HTMLInputElement[]>
    nameRefInput: React.MutableRefObject<HTMLInputElement[]>
    descriptionRefInput: React.MutableRefObject<HTMLTextAreaElement[]>
    categoryRefInput: React.MutableRefObject<HTMLSelectElement[]>
}

interface ICodelistsTable {
    filteredData: EnumTypePreviewList | undefined
    mutations: CodeListsMutations
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
    handleFilterChange: (changedFilter: IFilter) => void
    filter: CodelistFilter
}
const defaultPagination: Pagination = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}
export interface IErrorsState {
    id: number
    code?: string
    description?: string
    name?: string
}

export interface CodelistsTableColumnsDefinition extends EnumTypePreview {
    editableCodes: string[]
    errors: IErrorsState[]
    new: boolean
}

interface EnumSchemaObject {
    code: string
    name: string
    description: string
    category?: string | null
}

const getCodelistSchema = (t: TFunction) => {
    return object({
        defaultData: lazy((obj) => {
            const shape: {
                [key: string]: ObjectSchema<EnumSchemaObject>
            } = {}

            Object.keys(obj).forEach((key) => {
                shape[key] = object({
                    code: string().required(t('validation.required')),
                    name: string().required(t('validation.required')),
                    description: string().required(t('validation.required')),
                    category: string().transform((value) => (value === null ? '' : value)),
                })
            })

            return object().shape(shape)
        }),
    })
}

export const CodelistsTable: React.FC<ICodelistsTable> = ({
    filteredData,
    mutations,
    isLoading,
    isError,
    sort,
    setSort,
    handleFilterChange,
    filter,
}) => {
    const { t } = useTranslation()
    const { createEnum, validateEnum, updateEnum, deleteEnum } = mutations
    const location = useLocation()
    const navigate = useNavigate()
    const tableRef = useRef<HTMLTableElement>(null)

    const createDefaultData = (): {
        [x: string]: EnumTypePreview
    } => {
        const result = filteredData?.results?.reduce((acc, enumItem) => {
            return { ...acc, [enumItem.id ?? 0]: enumItem }
        }, {})
        return result as { [x: string]: EnumTypePreview }
    }
    const defaultData = createDefaultData()

    const {
        register,
        getValues,
        setValue,
        clearErrors,
        trigger,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(getCodelistSchema(t)),
        defaultValues: { defaultData },
    })

    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const [updatingEnum, setUpdatingEnum] = useState(false)

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)

    const handleDelete = (enumCode: string) => {
        deleteEnum.mutate({ code: enumCode })
    }

    const handleValidate = (enumCode: string) => {
        validateEnum.mutate({ code: enumCode })
    }

    const myHandleFilterChange = (myFilter: IFilter) => {
        const newFilter = {
            ...myFilter,
            pageNumber:
                (myFilter.pageNumber ?? defaultPagination.pageNumber) * (myFilter.pageSize ?? defaultPagination.pageSize) + 1 >
                (filteredData?.results?.length ?? 0)
                    ? defaultPagination.pageNumber
                    : myFilter.pageNumber,
        }
        handleFilterChange(newFilter)
    }

    const filteredTableData = useMemo(() => {
        const pageNumber = filter.pageNumber ?? 0
        const pageSize = filter.pageSize ?? 0
        const startOfList = pageNumber * pageSize - pageSize
        const endOfList = pageNumber * pageSize
        return filteredData?.results?.slice(startOfList, endOfList) || []
    }, [filteredData?.results, filter.pageNumber, filter.pageSize])

    const editRow = useCallback(
        (enumId: number) => {
            setSelectedRows([...selectedRows, enumId])
        },
        [selectedRows],
    )

    const cancelEditing = useCallback(
        (enumId: number) => {
            setSelectedRows([...(selectedRows?.filter((id) => id !== enumId) ?? [])])
        },
        [selectedRows],
    )

    const handleSaveCodelist = useCallback(
        async (enumId: number) => {
            setUpdatingEnum(true)
            const editedData: EnumSchemaObject = getValues(`defaultData.${enumId}`)

            const isValid = await trigger(`defaultData.${enumId}`)

            if (isValid) {
                await updateEnum.mutateAsync({
                    data: { ...defaultData[enumId], ...editedData, category: editedData.category ? editedData.category : undefined },
                })
                cancelEditing(enumId)
                setUpdatingEnum(false)
            }
        },
        [cancelEditing, defaultData, getValues, trigger, updateEnum],
    )

    const handleCreateNewCodelist = async (formData: FieldValues) => {
        await createEnum.mutateAsync({ data: formData })
    }

    useEffect(() => {
        if (createEnum.isSuccess) {
            setIsCreateModalOpen(false)
        }
    }, [createEnum.isSuccess])

    useEffect(() => {
        reset({
            defaultData,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredData?.results])

    const columns: Array<ColumnDef<EnumTypePreview>> = [
        {
            header: t('codelists.code'),
            accessorFn: (row) => row?.code,
            size: 150,
            enableSorting: true,
            id: 'code',
            meta: {
                getCellContext: (ctx: CellContext<EnumTypePreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original?.id, selectedRows) ? (
                    <Input
                        disabled
                        error={errors.defaultData?.[ctx?.row?.original?.id ?? 0]?.code?.message}
                        {...register(`defaultData.${ctx.row.original.id ?? 0}.code`)}
                        name={`defaultData.${ctx.row.original.id}.code`}
                        defaultValue={ctx.getValue()?.toString()}
                    />
                ) : (
                    <Link to={`${ctx?.getValue?.()}`} state={{ from: location }}>
                        {ctx?.getValue?.() as string}
                    </Link>
                ),
        },
        {
            header: t('codelists.name'),
            accessorFn: (row) => row?.name,
            size: 150,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx: CellContext<EnumTypePreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original?.id, selectedRows) ? (
                    <Input
                        error={errors.defaultData?.[ctx?.row?.original?.id ?? 0]?.name?.message}
                        {...register(`defaultData.${ctx.row.original.id ?? 0}.name`)}
                        name={`defaultData.${ctx.row.original.id}.name`}
                        defaultValue={ctx.getValue()?.toString()}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.description'),
            accessorFn: (row) => row?.description,
            size: 150,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx: CellContext<EnumTypePreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original?.id, selectedRows) ? (
                    <TextArea
                        error={errors.defaultData?.[ctx?.row?.original?.id ?? 0]?.description?.message}
                        rows={3}
                        {...register(`defaultData.${ctx.row.original.id ?? 0}.description`)}
                        name={`defaultData.${ctx.row.original.id}.description`}
                        defaultValue={ctx.getValue()?.toString()}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.valid'),
            accessorFn: (row) => row,
            enableSorting: false,
            id: 'valid',
            size: 50,
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumTypePreview
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            disabled
                            checked={rowObject.valid}
                            id={`${ctx.row.original.id}-valid`}
                            {...register(`defaultData.${ctx.row.original.id ?? 0}.valid`)}
                            name={`defaultData.${ctx.row.original.id}.valid`}
                        />
                    </div>
                )
            },
        },
        {
            header: t('codelists.category'),
            accessorFn: (row) => row?.category,
            size: 150,
            enableSorting: false,
            id: 'category',
            cell: (ctx) => (
                <SimpleSelect
                    label=""
                    options={[{ label: 'LICENSE', value: 'LICENSE' }]}
                    disabled={!isRowSelected(ctx?.row?.original.id, selectedRows)}
                    name={`defaultData.${ctx.row.original.id}.category`}
                    defaultValue={ctx?.getValue?.() as string}
                    value={watch(`defaultData.${ctx.row.original.id}.category`)}
                    onChange={(newValue) => {
                        setValue(`defaultData.${ctx.row.original.id}.category`, newValue ?? null)
                    }}
                    clearErrors={clearErrors}
                    isClearable
                />
            ),
        },
        {
            accessorFn: (row) => row,
            header: t('codelists.items'),
            id: 'items',
            size: 50,
            cell: (ctx) => {
                const rowObject = ctx.getValue() as CodelistsTableColumnsDefinition
                return (
                    <TransparentButtonWrapper
                        onClick={() => navigate('./' + rowObject.code)}
                        aria-label={t('codelists.link', { itemName: rowObject.name })}
                    >
                        <img src={ListIcon} className={styles.iconList} alt="" />
                    </TransparentButtonWrapper>
                )
            },
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: false,
            accessorFn: (row) => row,
            id: 'actions',
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumTypePreview
                if (!rowObject.valid) {
                    return <Button label={t('codelists.validate')} onClick={() => handleValidate(rowObject.code ?? '')} />
                } else if (isRowSelected(ctx?.row?.original?.id, selectedRows)) {
                    return (
                        <ButtonPopup
                            key={ctx?.row?.index}
                            buttonLabel={t('codelists.actions')}
                            popupPosition="right"
                            popupContent={(closePopup) => (
                                <div className={styles.actions}>
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            handleSaveCodelist(ctx?.row?.original?.id ?? 0)
                                            closePopup()
                                        }}
                                        label={t('codelists.save')}
                                    />
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            cancelEditing(ctx?.row?.original.id ?? 0)
                                            reset({ defaultData: defaultData })
                                            closePopup()
                                        }}
                                        label={t('codelists.cancel')}
                                    />
                                </div>
                            )}
                        />
                    )
                } else
                    return (
                        <ButtonPopup
                            key={ctx?.row?.index}
                            buttonLabel={t('codelists.actions')}
                            popupPosition="right"
                            popupContent={(closePopup) => (
                                <div className={styles.actions}>
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            editRow(ctx?.row?.original.id ?? 0)
                                            closePopup()
                                        }}
                                        label={t('codelists.edit')}
                                    />
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            handleDelete(rowObject.code ?? '')
                                            closePopup()
                                        }}
                                        label={t('codelists.delete')}
                                    />
                                </div>
                            )}
                        />
                    )
            },
        },
    ]

    const closeCreateModal = () => {
        createEnum.reset()
        setIsCreateModalOpen(false)
    }

    return (
        <>
            <BaseModal isOpen={isCreateModalOpen} close={closeCreateModal}>
                <CodelistsCreateForm
                    errorType={createEnum.error ? JSON.parse((createEnum.error as ApiError).message ?? '').type : undefined}
                    onSubmit={handleCreateNewCodelist}
                    isLoading={createEnum.isLoading}
                    closeModal={closeCreateModal}
                />
            </BaseModal>
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? defaultPagination.pageNumber,
                    pageSize: filter.pageSize ?? defaultPagination.pageSize,
                    dataLength: filteredData?.results?.length ?? 0,
                }}
                createButton={<CreateEntityButton label={t('codelists.createNew')} onClick={() => setIsCreateModalOpen(true)} />}
                handleFilterChange={myHandleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
            />
            <Table
                tableRef={tableRef}
                data={filteredTableData}
                columns={columns}
                isLoading={isLoading || updatingEnum}
                error={isError}
                manualPagination
                manualSorting={false}
                sort={sort}
                onSortingChange={setSort}
            />
            <PaginatorWrapper
                pageSize={filter.pageSize ?? defaultPagination.pageSize}
                pageNumber={filter.pageNumber ?? defaultPagination.pageNumber}
                dataLength={filteredData?.results?.length ?? 0}
                handlePageChange={(page) => {
                    handleFilterChange({ ...filter, pageNumber: page.pageNumber ?? defaultPagination.pageNumber })
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
            />
        </>
    )
}
