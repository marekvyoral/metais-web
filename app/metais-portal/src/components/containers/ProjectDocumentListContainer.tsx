import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, ConfigurationItemUi, useReadCiNeighbours, useReadConfigurationItem } from '@isdd/metais-common/api'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { useRequiredDocs } from '@isdd/metais-common/api/generated/kris-swagger'
import { PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export interface IDocType extends ConfigurationItemUi {
    confluence?: boolean
    pdType?: string
    name?: string
}

export interface ISection {
    id: string
    name: string
    docs: IDocType[]
    uuid?: string
    confluence?: boolean
}

export interface IView {
    data?: ISection[]
    docs?: IDocType[]
    allDocuments?: ConfigurationItemUi[]
    additionalColumns?: Array<ColumnDef<ISection>>
    pagination?: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    refetch: () => void
    namesData?: { login: string; fullName: string }[]
    addButtonSectionName?: string
    projectData?: ConfigurationItemUi
    selectPageSize?: boolean
    pageSize?: number
    setPageSize?: React.Dispatch<React.SetStateAction<number>>
    page?: number
    setPage?: React.Dispatch<React.SetStateAction<number>>
    totalLength?: number
}

interface IProjectDocumentsListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const defaultFilter = {
    sort: [],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: 100,
    fullTextSearch: '',
}

export const ProjectDocumentsListContainer: React.FC<IProjectDocumentsListContainer> = ({ configurationItemId, View }) => {
    const { data: projectData, isLoading: isProjectLoading } = useReadConfigurationItem(configurationItemId ?? '')
    const { data: requiredDocuments, isLoading: isRequiredDocsLoading } = useRequiredDocs()
    const sectionsByState = requiredDocuments?.find((rd) => rd.stavId == projectData?.attributes?.EA_Profil_Projekt_status)

    const { currentPreferences } = useUserPreferences()
    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
    const defaultRequestApi = {
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes,
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
        },
    }

    const { filter, handleFilterChange } = useFilterParams(defaultFilter)

    const mapDocsBySectionName = (section: ISection, documents: ConfigurationItemUi[]): ConfigurationItemUi[] =>
        documents.filter((d) => d.attributes?.Profil_Dokument_Projekt_typ_dokumentu?.includes(PROJECT_DOCUMENTS_SECTIONS_EXPANDABLE[section.name])) ??
        []

    const {
        isLoading,
        isError,
        data: projectDocuments,
        refetch,
    } = useReadCiNeighbours(configurationItemId ?? '', mapFilterToNeighborsApi(filter, defaultRequestApi), {})

    const documents: ConfigurationItemUi[] = projectDocuments?.fromNodes?.neighbourPairs?.map((np) => np.configurationItem ?? {}) ?? []
    const data: ISection[] = sectionsByState?.sections?.map((section: ISection) => ({
        name: section.name,
        id: section.id,
        docs: [
            ...section.docs.map((doc) => ({ ...doc, ...(documents.find((d) => d.attributes?.Gen_Profil_nazov == doc.name) ?? {}) })),
            ...mapDocsBySectionName(section, documents),
        ],
    }))

    return (
        <View
            projectData={projectData}
            allDocuments={documents}
            data={data}
            refetch={refetch}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isProjectLoading || isRequiredDocsLoading}
            isError={isError}
        />
    )
}