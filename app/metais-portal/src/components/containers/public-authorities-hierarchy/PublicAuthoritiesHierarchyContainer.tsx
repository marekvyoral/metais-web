import {
    ConfigurationItemUi,
    HierarchyPOFilterUi,
    HierarchyRightsResultUi,
    HierarchyRightsUi,
    useReadCiList,
    useReadListNeighboursConfigurationItems,
} from '@isdd/metais-common/api'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IFilter, SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { Row } from '@tanstack/react-table'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useSearchParams } from 'react-router-dom'

import {
    arrayToTree,
    findItemInHierarchy,
    mapCiSetToHierarchyItems,
    mapRightsToHierarchyItem,
    setAreChildrenExpandable,
} from './publicAuthoritiesHierarchy.helper'

import { PublicAuthoritiesHierarchyView } from '@/components/views/public-authorities-hierarchy/PublicAuthoritiesHierarchyView'
import { mapGenericTypeToPagination } from '@/componentHelpers'

export interface PublicAuthoritiesHierarchyItem {
    name: string
    uuid: string
    address: string
    children?: PublicAuthoritiesHierarchyItem[]
    canExpand?: boolean
}

export const PublicAuthoritiesHierarchyContainer: React.FC = () => {
    const [dataToShow, setDataToShow] = useState<PublicAuthoritiesHierarchyItem[] | undefined>()
    const [topRootNeighbours, setTopRootNeighbours] = useState<ConfigurationItemUi[] | undefined>()
    const [totalItems, setTotalItems] = useState<number>()
    const [selectedPublicAuthority, setSelectedPublicAuthority] = useState<HierarchyRightsUi | null>(null)
    const [implicitHierarchyData, setImplicitHierarchyData] = useState<HierarchyRightsResultUi | null>(null)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(BASE_PAGE_SIZE)
    const [expandableRowIdLoading, setExpandableRowIdLoading] = useState<string | null>(null)

    const { mutateAsync: mutateNeighbours, isLoading } = useReadListNeighboursConfigurationItems()
    const { mutateAsync: mutateImplicitHierarchy, isLoading: isImplicitHierarchyLoading } = useReadCiList()

    const { filter: filterParams, handleFilterChange } = useFilterParams<IFilter>({ pageNumber: BASE_PAGE_NUMBER, pageSize: BASE_PAGE_SIZE })
    const pagination = mapGenericTypeToPagination(filterParams, { totalCount: totalItems })

    const defaultNeighboursFilter = useMemo(
        () => ({
            nodeType: 'PO',
            relationshipType: 'PO_je_podriadenou_PO',
            includeInvalidated: false,
        }),
        [],
    )

    const defaultFilter: HierarchyPOFilterUi = useMemo(
        () => ({
            perpage: 20,
            sortBy: SortBy.HIERARCHY_FROM_ROOT,
            sortType: SortType.ASC,
            rights: [{ poUUID: selectedPublicAuthority?.poUUID ?? '', roles: ['TEMPORARY'] }],
        }),
        [selectedPublicAuthority],
    )

    const loadNeighbours = useCallback(
        async (uuids: string[]) => {
            return await mutateNeighbours({
                data: {
                    ...defaultNeighboursFilter,
                    ciUuids: uuids,
                },
            })
        },
        [defaultNeighboursFilter, mutateNeighbours],
    )
    const [searchParams, setSearchParams] = useSearchParams()
    const resetQueryParams = useCallback(() => {
        if (searchParams.has('pageNumber')) {
            searchParams.set('pageNumber', '1')
            setSearchParams(searchParams)
        }
    }, [searchParams, setSearchParams])

    const onChangeAuthority = (val: HierarchyRightsUi | null) => {
        setTopRootNeighbours(undefined)
        resetQueryParams()
        setSelectedPublicAuthority(val)
    }

    const handleExpandClick = async (row: Row<PublicAuthoritiesHierarchyItem>) => {
        if (!row.getIsExpanded() && row.original.children && row.original.children?.length < 1) {
            setExpandableRowIdLoading(row.original.uuid)
            const neighbours = await loadNeighbours([row.original.uuid])

            const foundHierarchyItem: PublicAuthoritiesHierarchyItem = findItemInHierarchy(dataToShow ?? [], 'uuid', row.original.uuid)
            if (foundHierarchyItem) {
                foundHierarchyItem.children = mapCiSetToHierarchyItems(neighbours[row.original.uuid].toCiSet ?? [])
                const more = await loadNeighbours(neighbours[row.original.uuid].toCiSet?.map((ci) => ci.uuid ?? '') ?? [])
                setAreChildrenExpandable(more, foundHierarchyItem.children)
            }
            setDataToShow(dataToShow ? [...dataToShow] : [])
        }
        row.toggleExpanded()
        setExpandableRowIdLoading(null)
    }

    useEffect(() => {
        setStart((pagination?.pageNumber ?? 0) * pagination.pageSize - pagination.pageSize)
        setEnd((pagination?.pageNumber ?? 0) * pagination.pageSize)
    }, [pagination])

    useEffect(() => {
        const loadImplicitHierarchyData = async () => {
            setImplicitHierarchyData(
                await mutateImplicitHierarchy({
                    data: { ...defaultFilter },
                }),
            )
        }
        if (selectedPublicAuthority) {
            loadImplicitHierarchyData()
        }
    }, [defaultFilter, mutateImplicitHierarchy, selectedPublicAuthority])

    useEffect(() => {
        const loadImplicitHierarchies = async (poUuids: string[]) => {
            const topPOuuid = poUuids?.shift()
            const lastPOuuid = poUuids[poUuids.length - 1] ?? ''
            const res = await Promise.all(
                poUuids.map((poUuid) => {
                    return mutateImplicitHierarchy({
                        data: {
                            page: 1,
                            perpage: 1,
                            sortBy: SortBy.HIERARCHY_FROM_ROOT,
                            sortType: SortType.ASC,
                            rights: [{ poUUID: poUuid ?? '', roles: ['TEMPORARY'] }],
                        },
                    })
                }),
            )

            if (res && res.length > 0) {
                const parentalItemsOfSelectedPO: PublicAuthoritiesHierarchyItem[] = res.map((val) => mapRightsToHierarchyItem(val.rights))
                //LEVEL 1 - selected PO
                const neighboursOfSelectedPO = await loadNeighbours([lastPOuuid])

                if (neighboursOfSelectedPO[lastPOuuid]?.toCiSet && (neighboursOfSelectedPO[lastPOuuid]?.toCiSet?.length ?? 0) > 0) {
                    parentalItemsOfSelectedPO[parentalItemsOfSelectedPO.length - 1].children = mapCiSetToHierarchyItems(
                        neighboursOfSelectedPO[lastPOuuid]?.toCiSet ?? [],
                    )
                    //LEVEL 2 - neighbours of selected PO
                    const lowerLevel = await loadNeighbours(neighboursOfSelectedPO[lastPOuuid]?.toCiSet?.map((ci) => ci.uuid ?? '') ?? [])
                    setAreChildrenExpandable(lowerLevel, parentalItemsOfSelectedPO[parentalItemsOfSelectedPO.length - 1].children ?? [])
                }
                const hierarchy = arrayToTree(parentalItemsOfSelectedPO)
                setTotalItems(hierarchy.length)
                setDataToShow(hierarchy)
            } else {
                const neighboursOfSelectedPO = await loadNeighbours([topPOuuid ?? ''])
                setTopRootNeighbours(neighboursOfSelectedPO[topPOuuid ?? '']?.toCiSet)
            }
        }
        if (implicitHierarchyData?.rights && implicitHierarchyData.rights.length > 0) {
            const poUuids = implicitHierarchyData?.rights?.[0].path?.split('/')
            loadImplicitHierarchies(poUuids ?? [])
        }
    }, [implicitHierarchyData, loadNeighbours, mutateImplicitHierarchy])

    useEffect(() => {
        const loadNeighboursForTopRoot = async () => {
            setTotalItems(topRootNeighbours?.length)
            const mappedNeighbours = mapCiSetToHierarchyItems(topRootNeighbours ?? []).slice(start, end)
            const lowerLevel = await loadNeighbours(mappedNeighbours?.map((item) => item.uuid ?? ''))
            setAreChildrenExpandable(lowerLevel, mappedNeighbours)
            setDataToShow([...mappedNeighbours])
        }
        topRootNeighbours && loadNeighboursForTopRoot()
    }, [end, loadNeighbours, start, topRootNeighbours])

    return (
        <PublicAuthoritiesHierarchyView
            hierarchy={dataToShow ?? []}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            onChangeAuthority={onChangeAuthority}
            selectedOrg={selectedPublicAuthority}
            handleExpandClick={handleExpandClick}
            isLoading={[isLoading, isImplicitHierarchyLoading].some((item) => item)}
            expandableRowIdLoading={expandableRowIdLoading}
        />
    )
}
