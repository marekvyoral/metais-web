import React, { useEffect, useRef, useState } from 'react'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { EnumType, EnumTypePreview, EnumTypePreviewList } from '@isdd/metais-common/api'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { ActionsOverTable, CreateEntityButton } from '@isdd/metais-common/index'

import { getCodelistsColumns } from './codelistsTableColumns'
import { validateRowData } from './codelistTableActions'

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

    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const [editableCodes, setEditableCodes] = useState([''])
    const [errorsState, setErrorsState] = useState<IErrorsState[]>([])

    const startOfList = currentPage * pageSize - pageSize
    const endOfList = currentPage * pageSize

    const [currentData, setCurrentData] = useState<CodelistsTableColumnsDefinition[]>([])

    useEffect(() => {
        const dataWithEditable: CodelistsTableColumnsDefinition[] =
            filteredData?.results?.map((item) => ({
                ...item,
                editableCodes,
                new: false,
                errors: errorsState,
            })) ?? []
        setCurrentData(dataWithEditable)
    }, [editableCodes, errorsState, filteredData?.results])

    const codeRefInput = useRef<HTMLInputElement[]>([])
    const nameRefInput = useRef<HTMLInputElement[]>([])
    const descriptionRefInput = useRef<HTMLTextAreaElement[]>([])
    const categoryRefInput = useRef<HTMLSelectElement[]>([])

    const refs: CodelistsRefs = {
        codeRefInput,
        nameRefInput,
        descriptionRefInput,
        categoryRefInput,
    }

    const handleDelete = (enumCode: string) => {
        deleteEnum.mutate({ code: enumCode })
    }

    const handleValidate = (enumCode: string) => {
        validateEnum.mutate({ code: enumCode })
    }

    const handleEditClick = (enumCode: string) => {
        setEditableCodes((prev) => [...prev, enumCode])
    }

    const handleSubmitForRow = async (rowId: number, valid: boolean, version = '', isUpdate: boolean) => {
        setErrorsState([])
        if (codeRefInput.current != null && nameRefInput.current[rowId] && descriptionRefInput.current[rowId] && categoryRefInput.current[rowId]) {
            const createData: EnumType = {
                code: codeRefInput.current[rowId].value,
                name: nameRefInput.current[rowId].value,
                description: descriptionRefInput.current[rowId].value,
                category: categoryRefInput.current[rowId].value,
                valid: valid,
            }
            const updateData: EnumTypePreview = {
                ...createData,
                id: rowId,
                version: version,
            }

            const errors = await validateRowData(
                {
                    code: createData.code,
                    name: createData.name,
                    description: createData.description,
                },
                rowId,
            )

            if (errors) {
                setErrorsState((prev) => {
                    if (!prev.find((item) => item.id === errors.id)) {
                        return [...prev, errors]
                    }
                    return prev
                })
            } else {
                if (isUpdate) {
                    updateEnum.mutate({ data: updateData })
                    setEditableCodes((prev) => prev.filter((item) => item !== updateData.code))
                } else {
                    createEnum.mutate({ data: createData })
                }
            }
        }
    }

    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
    }

    const createNewCodelist = () => {
        setCurrentData((prev) => [
            ...prev.slice(0, pageSize * currentPage - pageSize),
            {
                id: prev.length + 1,
                code: '',
                name: '',
                description: '',
                valid: false,
                category: '',
                editableCodes,
                new: true,
                errors: errorsState,
            },
            ...prev.slice(pageSize * currentPage - pageSize),
        ])
    }

    return (
        <>
            <ActionsOverTable
                createButton={<CreateEntityButton onClick={createNewCodelist} />}
                handlePagingSelect={handlePagingSelect}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
            />
            <Table
                data={currentData.slice(startOfList, endOfList)}
                columns={getCodelistsColumns({
                    t,
                    refs,
                    handleDelete,
                    handleValidate,
                    handleSubmitForRow,
                    setCurrentData,
                    setEditableCodes,
                    handleEditClick,
                })}
                isLoading={isLoading}
                error={isError}
            />
            <PaginatorWrapper
                pageSize={pageSize}
                pageNumber={currentPage}
                dataLength={currentData.length}
                handlePageChange={(page) => setCurrentPage(page.pageNumber ?? -1)}
            />
        </>
    )
}
