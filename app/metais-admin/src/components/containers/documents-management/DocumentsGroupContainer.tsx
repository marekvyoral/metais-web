import { IFilter } from '@isdd/idsk-ui-kit/types'
import { Metadata, useGetMeta1Hook } from '@isdd/metais-common/api/generated/dms-swagger'
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
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, STAV_PROJEKTU } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
    templatesMetadata?: Metadata[]
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
    const getMetaData = useGetMeta1Hook()
    const templatesUuids: string[] = documentsData?.filter((d) => !!d.templateUuid).map((d) => d.templateUuid ?? '') ?? []
    const [templatesMetadata, setTemplatesMetadata] = useState<Metadata[]>()
    const [customLoading, setCustomLoading] = useState(false)
    const getAllMeta = async () => {
        Promise.all(
            templatesUuids.map(async (template) => {
                return getMetaData(template)
            }),
        ).then((resp) => {
            setTemplatesMetadata(resp)
            setCustomLoading(false)
        })
    }

    useEffect(() => {
        if (templatesUuids && documentsData) {
            setCustomLoading(true)
            getAllMeta()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentsData])

    const { filter, handleFilterChange } = useFilterParams<DocumentFilter>(defaultFilter)

    const [dataRows, setDataRows] = useState<Document[]>()
    useEffect(() => {
        if (documentsData != undefined) {
            setDataRows(documentsData)
        }
    }, [documentsData])

    return (
        <View
            isLoading={isDocumentsLoading || isInfoLoading || isStatusesLoading || customLoading}
            infoData={infoData ?? {}}
            documentsData={dataRows ?? []}
            projectStatus={projectStatus ?? {}}
            saveDocumentGroup={saveDocumentGroup}
            deleteDocumentGroup={deleteDocumentGroup}
            deleteDocument={deleteDocument}
            refetchDocuments={refetchDocuments}
            filter={filter}
            handleFilterChange={handleFilterChange}
            refetchInfoData={refetchInfoData}
            templatesMetadata={templatesMetadata}
        />
    )
}
