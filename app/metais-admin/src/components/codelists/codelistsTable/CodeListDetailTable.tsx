import { BaseModal, Button, ButtonLink, ButtonPopup, CheckBox, InfoIcon, Input, PaginatorWrapper, Table, TextArea } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { ActionsOverTable, CreateEntityButton, isRowSelected, QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { ColumnDef } from '@tanstack/react-table'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { EnumItem, EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'

import styles from './codelistsTable.module.scss'
import { validateRowDetailData } from './codelistTableDetailActions'

import { CodelistDetailCreateForm } from '@/components/codelists/codelistDetailCreateForm/CodelistDetailCreateForm'
import { CodeListDetailMutations } from '@/components/containers/Codelist/CodelistDetailContainer'

export interface CodelistsDetailRefs {
    codeRefInput: React.MutableRefObject<HTMLInputElement[]>
    descriptionRefInput: React.MutableRefObject<HTMLTextAreaElement[]>
    engDescriptionRefInput: React.MutableRefObject<HTMLTextAreaElement[]>
    valueRefInput: React.MutableRefObject<HTMLTextAreaElement[]>
    engValueRefInput: React.MutableRefObject<HTMLTextAreaElement[]>
}

const defaultPagination: Pagination = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

interface ICodeListDetailTable {
    filteredData: EnumType | undefined
    mutations: CodeListDetailMutations
    isLoading: boolean
    isError: boolean
    enumCode: string
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<EnumType, unknown>>
}

export interface IErrorsDetailState {
    id: number
    code?: string
    description?: string
    engDescription?: string
    name?: string
    value?: string
    engValue?: string
    orderList?: number
}

export interface CodeListDetailTableColumnsDefinition extends EnumItem {
    editableCodes: string[]
    errors: IErrorsDetailState[]
    new: boolean
}

export interface IResultCreateEnum {
    isSuccess: boolean
    isError: boolean
    message?: string
}

export const CodeListDetailTable: React.FC<ICodeListDetailTable> = ({ filteredData, mutations, isLoading, isError, enumCode, refetch }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { createEnumItem, validateEnumItem, updateEnumItem, deleteEnumItem } = mutations

    const [errorsState, setErrorsState] = useState<IErrorsDetailState[]>([])
    const [pagination, setPagination] = useState(defaultPagination)

    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const indexModificator = pagination.pageNumber * pagination.pageSize - pagination.pageSize

    const [dataRows, setDataRows] = useState(filteredData?.enumItems?.sort((a, b) => (a.orderList || 0) - (b.orderList || 0)) || [])

    const sortedData = useMemo(
        () => filteredData?.enumItems?.sort((a, b) => (a.orderList || 0) - (b.orderList || 0)) || [],
        [filteredData?.enumItems],
    )
    const filteredTableData = useMemo(() => {
        const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
        const endOfList = pagination.pageNumber * pagination.pageSize
        return sortedData.slice(startOfList, endOfList) || []
    }, [pagination.pageNumber, pagination.pageSize, sortedData])

    const myHandleFilterChange = (myFilter: IFilter) => {
        setPagination({
            ...pagination,
            pageSize: myFilter.pageSize ?? BASE_PAGE_SIZE,
            pageNumber: myFilter.pageNumber ?? defaultPagination.pageNumber,
        })
    }
    const { register, getValues, setValue, reset } = useForm({
        defaultValues: {
            filteredData,
        },
    })
    const handleDelete = (codeEnum: string) => {
        deleteEnumItem.mutateAsync({ code: codeEnum })
    }

    const handleValidate = (codeEnum: string) => {
        validateEnumItem.mutateAsync({ code: codeEnum })
    }

    const editRow = useCallback(
        (rowIndex: number) => {
            setSelectedRows([...selectedRows, rowIndex])
        },
        [selectedRows],
    )

    const cancelEditing = useCallback(
        (rowIndex: number) => {
            setSelectedRows([...(selectedRows?.filter((index) => index !== rowIndex) ?? [])])
            setErrorsState([])
            reset({ filteredData: filteredData })
        },
        [filteredData, reset, selectedRows],
    )
    const [resultCreateEnum, setResultCreateEnum] = useState<IResultCreateEnum>({
        isError: false,
        isSuccess: false,
        message: '',
    })

    const handleCreateNewCodelistDetail = async (createData: FieldValues) => {
        if (!filteredData?.enumItems?.some((item) => item.code === createData.code)) {
            createEnumItem
                .mutateAsync({ codeEnumType: enumCode, data: createData })
                .then(() => {
                    setResultCreateEnum({ isError: false, isSuccess: true, message: '' })
                    setValue(`filteredData.enumItems.${dataRows.length + indexModificator}`, createData)
                })
                .catch((mutationError) => {
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultCreateEnum({
                        isError: true,
                        isSuccess: false,
                        message: errorResponse?.type === ReponseErrorCodeEnum.GNR412 ? t(`errors.${ReponseErrorCodeEnum.GNR412}`) : undefined,
                    })
                })
        }
    }

    useEffect(() => {
        if (createEnumItem.isSuccess) {
            setIsCreateModalOpen(false)
        }
    }, [createEnumItem.isSuccess])

    const handleSaveCodelist = useCallback(
        async (id: number, index: number) => {
            setErrorsState([])
            const editedData = { ...getValues(`filteredData.enumItems.${index}`), id }
            const errors = await validateRowDetailData(
                {
                    code: editedData.code,
                    description: editedData.description,
                    engDescription: editedData.engDescription,
                    value: editedData.value,
                    engValue: editedData.engValue,
                },
                id,
                t,
            )

            if (errors) {
                setErrorsState((prev) => {
                    if (!prev.find((item) => item.id === errors.id)) {
                        return [...prev, errors]
                    }
                    return prev
                })
            } else {
                updateEnumItem.mutateAsync({ data: editedData })
                cancelEditing(id)
            }
        },
        [cancelEditing, getValues, t, updateEnumItem],
    )

    useEffect(() => {
        reset({ filteredData: filteredData })
        setDataRows(filteredData?.enumItems?.sort((a, b) => (a.orderList || 0) - (b.orderList || 0)) || [])
    }, [filteredData, reset])

    const [isTableDataLoading, setIsTableDataLoading] = useState(false)

    const reorderRow = async (draggedRowIndex: number, targetRowIndex: number) => {
        dataRows?.splice(targetRowIndex, 0, dataRows?.splice(draggedRowIndex, 1)[0] as EnumItem)
        const newDataRows = [...dataRows.map((item, index) => ({ ...item, orderList: index + 1 }))]
        setDataRows(newDataRows)
        newDataRows.forEach((itemData) => {
            updateEnumItem.mutateAsync({ data: itemData }).finally(async () => {
                setIsTableDataLoading(true)
                await refetch()
                setIsTableDataLoading(false)
            })
        })
    }

    const columns: Array<ColumnDef<EnumItem>> = [
        {
            header: () => {
                return (
                    <>
                        <span className={styles.tooltipIcon}>{t('codelists.order')}</span>
                        {isUserLogged && (
                            <Tooltip
                                tooltipContent={(open, close) => <img onMouseOver={open} onMouseOut={close} src={InfoIcon} />}
                                descriptionElement={t('codelists.tooltipOrder')}
                                position={'right bottom'}
                                arrow={false}
                            />
                        )}
                    </>
                )
            },

            accessorFn: (row) => row?.orderList,
            enableSorting: false,
            id: 'order',
            cell: (ctx) => <span>{ctx?.row?.original.orderList}</span>,
        },
        {
            header: t('codelists.code'),
            accessorFn: (row) => row?.code,
            enableSorting: false,
            id: 'code',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) =>
                ctx?.row?.original.id && isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        disabled
                        error={errorsState.find((item) => item.id === ctx?.row?.original.id)?.code}
                        {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.code`)}
                    />
                ) : (
                    (ctx?.getValue?.() as string)
                ),
        },
        {
            header: t('codelists.value'),
            accessorFn: (row) => row?.value,
            enableSorting: false,
            id: 'value',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) =>
                ctx?.row?.original.id && isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        error={errorsState.find((item) => item.id === ctx?.row?.original.id)?.value}
                        {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.value`)}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.engValue'),
            accessorFn: (row) => row?.engValue,
            enableSorting: false,
            id: 'engValue',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) =>
                ctx?.row?.original.id && isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        error={errorsState.find((item) => item.id === ctx?.row?.original.id)?.engValue}
                        {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.engValue`)}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.description'),
            accessorFn: (row) => row?.description,
            enableSorting: false,
            id: 'description',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) =>
                ctx?.row?.original.id && isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <TextArea
                        error={errorsState.find((item) => item.id === ctx?.row?.original.id)?.description}
                        rows={3}
                        {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.description`)}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.engDescription'),
            accessorFn: (row) => row?.engDescription,
            enableSorting: false,
            id: 'engDescription',
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) =>
                ctx?.row?.original.id && isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <TextArea
                        error={errorsState.find((item) => item.id === ctx?.row?.original.id)?.engDescription}
                        rows={3}
                        {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.engDescription`)}
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
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumItem
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            disabled
                            checked={rowObject.valid}
                            id={`${ctx.row.index + indexModificator}-valid`}
                            {...register(`filteredData.enumItems.${ctx.row.index + indexModificator}.valid`)}
                        />
                    </div>
                )
            },
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: false,
            accessorFn: (row) => row,
            id: 'actions',
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumItem
                if (!rowObject.valid) {
                    return <Button label={t('codelists.validate')} onClick={() => handleValidate(rowObject.code ?? '')} />
                } else if (isRowSelected(ctx.row.original.id, selectedRows)) {
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
                                            ctx.row.original.id && handleSaveCodelist(ctx.row.original.id, ctx.row.index + indexModificator)
                                            closePopup()
                                        }}
                                        label={t('codelists.save')}
                                        disabled={errorsState?.length !== 0}
                                    />
                                    <ButtonLink
                                        type="button"
                                        onClick={() => {
                                            ctx.row.original.id && cancelEditing(ctx.row.original.id)
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
                                            ctx.row.original.id && editRow(ctx.row.original.id)
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

    return (
        <>
            <BaseModal
                isOpen={isCreateModalOpen}
                close={() => {
                    setIsCreateModalOpen(false)
                    setResultCreateEnum({ isError: false, isSuccess: false, message: '' })
                }}
            >
                <CodelistDetailCreateForm
                    onSubmit={handleCreateNewCodelistDetail}
                    closeModal={() => setIsCreateModalOpen(false)}
                    data={filteredData}
                    resultCreateEnum={resultCreateEnum}
                    isLoading={createEnumItem.isLoading}
                    setResultCreateEnum={setResultCreateEnum}
                />
            </BaseModal>
            <ActionsOverTable
                pagination={{ ...pagination, dataLength: filteredData?.enumItems?.length ?? 0 }}
                createButton={<CreateEntityButton label={t('codelists.addNewCodelistDetail')} onClick={() => setIsCreateModalOpen(true)} />}
                handleFilterChange={myHandleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
            />
            <QueryFeedback loading={isLoading || updateEnumItem.isLoading || isTableDataLoading} error={isError} withChildren>
                <Table<EnumItem> data={filteredTableData} columns={columns} canDragRow={isUserLogged} reorderRow={reorderRow} />
            </QueryFeedback>
            <PaginatorWrapper
                pageSize={pagination.pageSize}
                pageNumber={pagination.pageNumber}
                dataLength={filteredData?.enumItems?.length ?? 0}
                handlePageChange={(page) => setPagination({ ...pagination, pageNumber: page.pageNumber ?? defaultPagination.pageNumber })}
            />
        </>
    )
}
