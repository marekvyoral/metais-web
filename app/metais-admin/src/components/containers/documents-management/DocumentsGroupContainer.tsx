import { ISelectColumnType } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ApiError,
    Document,
    DocumentGroup,
    useDeleteDocumentGroupHook,
    useDeleteDocumentHook,
    useGetDocumentGroupById,
    useGetDocuments,
    useSaveDocumentGroupHook,
} from '@isdd/metais-common/api/generated/kris-swagger'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    STAV_PROJEKTU,
    documentsManagementGroupDocumentsDefaultSelectedColumns,
} from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export interface DocumentFilter extends IFilterParams, IFilter {}

export const defaultFilter: DocumentFilter = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

export interface IView {
    infoData: DocumentGroup
    documentsData: Document[]
    projectStatus: EnumType
    saveDocumentGroup: (documentGroup: DocumentGroup) => Promise<DocumentGroup>
    deleteDocumentGroup: (id: number) => Promise<boolean>
    deleteDocument: (id: number) => Promise<boolean>
    refetchDocuments: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<Document[], ApiError>>
    refetchInfoData: <TPageData>(
        options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
    ) => Promise<QueryObserverResult<DocumentGroup, ApiError>>
    isLoading: boolean
    filter: DocumentFilter
    handleFilterChange: (changedFilter: IFilter) => void
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: Dispatch<SetStateAction<ISelectColumnType[]>>
    resetSelectedColumns: () => void
}

export interface IDocumentsGroupContainerProps {
    View: React.FC<IView>
}

export interface DocumentFilterData extends IFilterParams {
    phase: string
    status: string
}

export const DocumentsGroupContainer: React.FC<IDocumentsGroupContainerProps> = ({ View }) => {
    const { entityId } = useParams()
    const id = Number(entityId)
    const { data: infoData, isLoading: isInfoLoading, refetch: refetchInfoData } = useGetDocumentGroupById(id)
    const { data: documentsData, isLoading: isDocumentsLoading, refetch: refetchDocuments } = useGetDocuments(id)
    const { data: projectStatus, isLoading: isStatusesLoading } = useGetValidEnum(STAV_PROJEKTU)
    const saveDocumentGroup = useSaveDocumentGroupHook()
    const deleteDocumentGroup = useDeleteDocumentGroupHook()
    const deleteDocument = useDeleteDocumentHook()

    const { filter, handleFilterChange } = useFilterParams<DocumentFilter>(defaultFilter)

    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([...documentsManagementGroupDocumentsDefaultSelectedColumns])
    const [dataRows, setDataRows] = useState<Document[]>()
    useEffect(() => {
        if (documentsData != undefined) {
            setDataRows(documentsData)
        }
    }, [documentsData])

    useEffect(() => {
        setDataRows(documentsData?.slice(0, filter.pageSize))
    }, [documentsData, filter.pageSize])
    return (
        <View
            isLoading={isDocumentsLoading || isInfoLoading || isStatusesLoading}
            infoData={infoData ?? {}}
            documentsData={dataRows ?? []}
            projectStatus={projectStatus ?? {}}
            saveDocumentGroup={saveDocumentGroup}
            deleteDocumentGroup={deleteDocumentGroup}
            deleteDocument={deleteDocument}
            refetchDocuments={refetchDocuments}
            filter={filter}
            handleFilterChange={handleFilterChange}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            resetSelectedColumns={() => setSelectedColumns([...documentsManagementGroupDocumentsDefaultSelectedColumns])}
            refetchInfoData={refetchInfoData}
        />
    )
}
