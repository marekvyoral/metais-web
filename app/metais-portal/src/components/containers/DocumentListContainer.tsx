import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, NeighbourPairUi, useReadCiNeighbours } from '@isdd/metais-common/api'
import { mapFilterToNeighborsApi } from '@isdd/metais-common/api/filter/filterApi'
import { useGetIdentitiesByLoginsBulkHook } from '@isdd/metais-common/api/generated/iam-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import uniq from 'lodash/uniq'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { mapNeighboursSetSourceToPagination } from '@/componentHelpers/pagination'

export interface IView {
    data?: NeighbourPairUi[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
    refetch: () => void
    namesData?: { login: string; fullName: string }[]
}

interface IDocumentsListContainer {
    configurationItemId?: string
    View: React.FC<IView>
}

export const defaultFilter = {
    sort: [],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    fullTextSearch: '',
}

export const DocumentsListContainer: React.FC<IDocumentsListContainer> = ({ configurationItemId, View }) => {
    const [defaultRequestApi, setDefaultRequestApi] = useState({
        neighboursFilter: {
            ciType: ['Dokument'],
            metaAttributes: { state: ['DRAFT'] },
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

    const getNames = useGetIdentitiesByLoginsBulkHook()
    const auth = useAuth()
    const [namesData, setNamesData] = useState<{ login: string; fullName: string }[]>()

    const loadNames = async (names: string[]) => {
        const data = await getNames(names)
        setNamesData(
            data.map((item) => {
                return { login: item.input ?? '', fullName: (item.identity?.firstName ?? '') + ' ' + (item.identity?.lastName ?? '') }
            }),
        )
    }
    useEffect(() => {
        if (defaultRequestApi.neighboursFilter.fullTextSearch !== filter.fullTextSearch) {
            setDefaultRequestApi({ neighboursFilter: { ...defaultRequestApi.neighboursFilter, fullTextSearch: filter.fullTextSearch } })
        }
    }, [defaultRequestApi.neighboursFilter, filter])

    useEffect(() => {
        if (documentCiData !== undefined && auth.state.user !== null && namesData === undefined) {
            const createdBy = documentCiData.fromNodes?.neighbourPairs?.map((item) => item.configurationItem?.metaAttributes?.createdBy ?? '') ?? []
            const modifiedBy =
                documentCiData.fromNodes?.neighbourPairs?.map((item) => item.configurationItem?.metaAttributes?.lastModifiedBy ?? '') ?? []
            const names = uniq([...createdBy, ...modifiedBy])
            loadNames(names)
        }
    })

    const pagination = mapNeighboursSetSourceToPagination(filter, documentCiData)

    if (!configurationItemId)
        return <View refetch={refetch} pagination={pagination} handleFilterChange={handleFilterChange} isLoading={false} isError />
    return (
        <View
            namesData={namesData}
            refetch={refetch}
            data={documentCiData?.fromNodes?.neighbourPairs}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
