import { BaseModal, Button, ButtonPopup, CheckBox, Input, PaginatorWrapper, SimpleSelect, Table, TextArea } from '@isdd/idsk-ui-kit/index'
import { EnumTypePreview, EnumTypePreviewList } from '@isdd/metais-common/api'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useLocation, Link } from 'react-router-dom'
import { ActionsOverTable, CreateEntityButton, isRowSelected } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './codelistsTable.module.scss'
import { validateRowData } from './codelistTableActions'

import { CodelistsCreateForm } from '@/components/codelists/codelistsCreateForm/CodelistsCreateForm'
import { CodeListsMutations } from '@/components/containers/Codelist/CodelistContainer'

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

export const CodelistsTable: React.FC<ICodelistsTable> = ({ filteredData, mutations, isLoading, isError }) => {
    const { t } = useTranslation()
    const { createEnum, validateEnum, updateEnum, deleteEnum } = mutations
    const location = useLocation()

    const { register, getValues, setValue, clearErrors } = useForm({
        defaultValues: {
            filteredData,
        },
    })

    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const indexModificator = currentPage * pageSize - pageSize

    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const [errorsState, setErrorsState] = useState<IErrorsState[]>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const startOfList = currentPage * pageSize - pageSize
    const endOfList = currentPage * pageSize

    const handleDelete = (enumCode: string) => {
        deleteEnum.mutate({ code: enumCode })
    }

    const handleValidate = (enumCode: string) => {
        validateEnum.mutate({ code: enumCode })
    }

    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
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
        },
        [selectedRows],
    )

    const handleSaveCodelist = useCallback(
        async (rowIndex: number) => {
            setErrorsState([])
            const editedData = getValues(`filteredData.results.${rowIndex}`)
            const errors = await validateRowData(
                {
                    code: editedData.code,
                    name: editedData.name,
                    description: editedData.description,
                },
                rowIndex,
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
                updateEnum.mutateAsync({ data: editedData })
                cancelEditing(rowIndex)
            }
        },
        [cancelEditing, getValues, t, updateEnum],
    )

    const handleCreateNewCodelist = (formData: FieldValues) => {
        createEnum.mutateAsync({ data: formData })
    }

    useEffect(() => {
        if (createEnum.isSuccess) {
            setIsCreateModalOpen(false)
        }
    }, [createEnum.isSuccess])

    const columns: Array<ColumnDef<EnumTypePreview>> = [
        {
            header: t('codelists.code'),
            accessorFn: (row) => row?.code,
            enableSorting: true,
            id: 'code',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index + indexModificator, selectedRows) ? (
                    <Input
                        disabled
                        error={errorsState.find((item) => item.code === ctx?.getValue?.())?.code}
                        {...register(`filteredData.results.${ctx.row.index + indexModificator}.code`)}
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
            enableSorting: true,
            id: 'name',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index + indexModificator, selectedRows) ? (
                    <Input
                        error={errorsState.find((item) => item.id === ctx?.row?.index + indexModificator)?.name}
                        {...register(`filteredData.results.${ctx.row.index + indexModificator}.name`)}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index + indexModificator, selectedRows) ? (
                    <TextArea
                        error={errorsState.find((item) => item.id === ctx?.row?.index + indexModificator)?.description}
                        rows={3}
                        {...register(`filteredData.results.${ctx.row.index + indexModificator}.description`)}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('codelists.valid'),
            accessorFn: (row) => row,
            enableSorting: true,
            id: 'valid',
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumTypePreview
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            disabled
                            checked={rowObject.valid}
                            id={`${ctx.row.index + indexModificator}-valid`}
                            {...register(`filteredData.results.${ctx.row.index + indexModificator}.valid`)}
                        />
                    </div>
                )
            },
        },
        {
            header: t('codelists.category'),
            accessorFn: (row) => row?.category,
            enableSorting: true,
            id: 'category',
            cell: (ctx) => (
                <SimpleSelect
                    label=""
                    options={[
                        { label: '-', value: '' },
                        { label: 'LICENSE', value: 'LICENSE' },
                    ]}
                    disabled={!isRowSelected(ctx?.row?.index + indexModificator, selectedRows)}
                    name={`filteredData.results.${ctx.row.index + indexModificator}.category`}
                    defaultValue={ctx?.getValue?.() as string}
                    setValue={setValue}
                    clearErrors={clearErrors}
                />
            ),
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: true,
            accessorFn: (row) => row,
            id: 'actions',
            cell: (ctx) => {
                const rowObject = ctx?.getValue?.() as EnumTypePreview
                if (!rowObject.valid) {
                    return <Button label={t('codelists.validate')} onClick={() => handleValidate(rowObject.code ?? '')} />
                } else if (isRowSelected(ctx?.row?.index + indexModificator, selectedRows)) {
                    return (
                        <ButtonPopup
                            buttonLabel={t('codelists.actions')}
                            popupContent={() => (
                                <div className={styles.actions}>
                                    <Button onClick={() => handleSaveCodelist(ctx?.row?.index + indexModificator)} label={t('codelists.save')} />
                                    <Button
                                        variant="secondary"
                                        onClick={() => cancelEditing(ctx?.row?.index + indexModificator)}
                                        label={t('codelists.cancel')}
                                    />
                                </div>
                            )}
                        />
                    )
                } else
                    return (
                        <ButtonPopup
                            buttonLabel={t('codelists.actions')}
                            popupContent={() => (
                                <div className={styles.actions}>
                                    <Button onClick={() => editRow(ctx?.row?.index + indexModificator)} label={t('codelists.edit')} />
                                    <Button variant="warning" onClick={() => handleDelete(rowObject.code ?? '')} label={t('codelists.delete')} />
                                </div>
                            )}
                        />
                    )
            },
        },
    ]

    return (
        <>
            <BaseModal isOpen={isCreateModalOpen} close={() => setIsCreateModalOpen(false)}>
                <CodelistsCreateForm
                    onSubmit={handleCreateNewCodelist}
                    isLoading={createEnum.isLoading}
                    closeModal={() => setIsCreateModalOpen(false)}
                />
            </BaseModal>
            <ActionsOverTable
                createButton={<CreateEntityButton label={t('codelists.createNew')} onClick={() => setIsCreateModalOpen(true)} />}
                handlePagingSelect={handlePagingSelect}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
            />
            <Table data={filteredData?.results?.slice(startOfList, endOfList)} columns={columns} isLoading={isLoading} error={isError} />
            <PaginatorWrapper
                pageSize={pageSize}
                pageNumber={currentPage}
                dataLength={filteredData?.results?.length ?? 0}
                handlePageChange={(page) => setCurrentPage(page.pageNumber ?? -1)}
            />
        </>
    )
}
