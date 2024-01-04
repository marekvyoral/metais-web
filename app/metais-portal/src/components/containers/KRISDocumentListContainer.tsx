import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import {
    ConfigurationItemUi,
    NeighbourPairUi,
    useReadCiNeighbours,
    useReadConfigurationItem,
    useReadNeighboursConfigurationItems,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetIdentitiesByLoginsBulk } from '@isdd/metais-common/api/generated/iam-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import uniq from 'lodash/uniq'
import React, { useEffect, useState } from 'react'

import { mapNeighboursSetSourceToPagination } from '@/componentHelpers/pagination'

export interface TableCols extends NeighbourPairUi {
    selected?: boolean
}

export interface IView {
    ciData?: ConfigurationItemUi
    data?: NeighbourPairUi[]
    protocols?: ConfigurationItemUi[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    refetch: () => void
    namesData?: { login: string; fullName: string }[]
    selectedItems: { [key: number]: TableCols[] }
    setSelectedItems: React.Dispatch<
        React.SetStateAction<{
            [key: number]: TableCols[]
        }>
    >
}

interface IKRISDocumentListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const defaultFilter = {
    sort: [],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    fullTextSearch: '',
}

export const KRISDocumentListContainer: React.FC<IKRISDocumentListContainer> = ({ configurationItemId, View }) => {
    const { currentPreferences } = useUserPreferences()
    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
    const { data: ciData, isLoading: isCiLoading } = useReadConfigurationItem(configurationItemId ?? '')

    const [defaultRequestApi, setDefaultRequestApi] = useState({
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes,
            relType: ['CI_HAS_DOCUMENT', 'Dokument_sa_tyka_KRIS', 'CONTROL_HAS_DOCUMENT', 'PROJECT_HAS_DOCUMENT'],
            usageType: ['system', 'application'],
            fullTextSearch: '',
        },
    })

    const { filter, handleFilterChange } = useFilterParams(defaultFilter)

    const {
        isLoading,
        isError,
        data: documentCiData,
        refetch,
    } = useReadCiNeighbours(configurationItemId ?? '', mapFilterToNeighborsApi(filter, defaultRequestApi), {})

    const { data: protocols, isLoading: isProtocolsLoading } = useReadNeighboursConfigurationItems(configurationItemId ?? '', {
        nodeType: 'KRIS_Protokol',
        relationshipType: 'KRIS_protokol_sa_tyka_KRIS',
    })

    const {
        state: { user },
    } = useAuth()

    const { data: userIdentitiesData } = useGetIdentitiesByLoginsBulk(
        uniq([
            ...(documentCiData?.fromNodes?.neighbourPairs?.map((item) => item.configurationItem?.metaAttributes?.createdBy ?? '') ?? []),
            ...(documentCiData?.fromNodes?.neighbourPairs?.map((item) => item.configurationItem?.metaAttributes?.lastModifiedBy ?? '') ?? []),
        ]),
        {
            query: {
                enabled: documentCiData !== undefined && user !== null,
            },
        },
    )

    const namesData = userIdentitiesData?.map((item) => {
        return { login: item.input ?? '', fullName: (item.identity?.firstName ?? '') + ' ' + (item.identity?.lastName ?? '') }
    })

    useEffect(() => {
        if (defaultRequestApi.neighboursFilter.fullTextSearch !== filter.fullTextSearch) {
            setDefaultRequestApi({ neighboursFilter: { ...defaultRequestApi.neighboursFilter, fullTextSearch: filter.fullTextSearch } })
        }
    }, [defaultRequestApi.neighboursFilter, filter])

    const pagination = mapNeighboursSetSourceToPagination(filter, documentCiData)
    const [selectedItems, setSelectedItems] = useState<{ [key: number]: TableCols[] }>([])

    if (!configurationItemId)
        return (
            <View
                refetch={refetch}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                isLoading={false}
                isError
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />
        )
    return (
        <View
            ciData={ciData}
            namesData={namesData}
            protocols={protocols?.toCiSet}
            refetch={refetch}
            data={documentCiData?.fromNodes?.neighbourPairs}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isCiLoading || isProtocolsLoading}
            isError={isError}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
        />
    )
}
