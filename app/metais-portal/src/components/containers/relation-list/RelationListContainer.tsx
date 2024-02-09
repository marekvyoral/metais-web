import React, { useEffect, useState } from 'react'
import { RelFilterUi, RelListFilterContainerUi, RelationshipUi, useReadRelationshipList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCiTypeHook, useListCiTypes, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IOption } from '@isdd/idsk-ui-kit/index'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

import { IRelationListView } from '@/components/views/relation-list/RelationListView'

export interface RelationshipsFilterData extends IFilterParams, IFilter {
    relType?: string
    sourceType?: string
    targetType?: string
}

export const defaultFilterValues: RelationshipsFilterData = {
    relType: '',
    sourceType: '',
    targetType: '',
}

interface RelationListContainerProps {
    View: React.FC<IRelationListView>
}

export const RelationListContainer: React.FC<RelationListContainerProps> = ({ View }) => {
    const { currentPreferences } = useUserPreferences()

    const [relationships, setRelationships] = useState<RelationshipUi[]>([])
    const [totaltems, setTotalItems] = useState<number>(0)

    const [relTypeOptions, setRelTypeOptions] = useState<IOption<string>[]>()
    const [sourceOptions, setSourceOptions] = useState<IOption<string>[]>()
    const [targetOptions, setTargetOptions] = useState<IOption<string>[]>()

    // const [relAttributes, setRelAttributes] = useState<Attribute[] | undefined>()
    // const [relAttributeProfiles, setRelAttributeProfiles] = useState<AttributeProfile[] | undefined>()

    const { filter, handleFilterChange } = useFilterParams<RelationshipsFilterData>({
        sort: [
            {
                orderBy: 'startName',
                sortDirection: SortType.DESC,
            },
        ],
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        ...defaultFilterValues,
    })

    const [requestPayload, setRequestPayload] = useState<RelListFilterContainerUi | undefined>()

    const { mutateAsync, isLoading } = useReadRelationshipList()

    const { data: relTypes } = useListRelationshipTypes({ filter: {} })
    const { data: ciTypes } = useListCiTypes({ filter: {} })
    const ciTypeHook = useGetCiTypeHook()
    //const relTypeHook = useGetRelationshipTypeHook()

    // const onRelTypeChange = async (type: string | undefined) => {
    //     if (type) {
    //         await relTypeHook(type ?? '').then((res) => {
    //             setRelAttributes(res.attributes)
    //             setRelAttributeProfiles(res.attributeProfiles)
    //         })
    //     }
    // }

    const onSourceTypeChange = async (type: string | undefined) => {
        if (type)
            await ciTypeHook(type ?? '').then((res) => {
                setSourceOptions(res.relationshipTypes?.asSource?.map((rel) => ({ value: rel.technicalName ?? '', label: rel.name ?? '' })))
            })
        else setSourceOptions(undefined)
    }

    const onTargetTypeChange = async (type: string | undefined) => {
        if (type)
            await ciTypeHook(type ?? '').then((res) => {
                setTargetOptions(res.relationshipTypes?.asTarget?.map((rel) => ({ value: rel.technicalName ?? '', label: rel.name ?? '' })))
            })
        else setTargetOptions(undefined)
    }

    useEffect(() => {
        const isSourceAndTarget = !!(sourceOptions && targetOptions)
        const isOnlySource = !!(sourceOptions && !targetOptions)
        const isOnlyTarget = !!(!sourceOptions && targetOptions)
        switch (true) {
            case isSourceAndTarget:
                setRelTypeOptions(sourceOptions?.filter((rel1) => targetOptions?.some((rel2) => rel2.value === rel1.value)))
                break
            case isOnlySource:
                setRelTypeOptions(sourceOptions)
                break
            case isOnlyTarget:
                setRelTypeOptions(targetOptions)
                break
            default:
                setRelTypeOptions(relTypes?.results?.map((rel) => ({ value: rel.technicalName ?? '', label: rel.name ?? '' })))
                break
        }
    }, [relTypes?.results, sourceOptions, targetOptions])

    useEffect(() => {
        if (requestPayload) {
            mutateAsync(
                {
                    data: requestPayload,
                },
                {
                    onSuccess(res) {
                        setRelationships(res.relationshipList ?? [])
                        setTotalItems(res.pagination?.totaltems ?? 0)
                    },
                },
            )
        }
    }, [mutateAsync, requestPayload])

    useEffect(() => {
        if (!filter.relType && !filter.sourceType && !filter.targetType) {
            setRelTypeOptions(relTypes?.results?.map((rel) => ({ value: rel.technicalName ?? '', label: rel.name ?? '' })))
        }
        const relFilter: RelFilterUi = {
            metaAttributes: { state: currentPreferences.showInvalidatedItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT'] },
        }
        const attributes = mapFilterParamsToApi(filter, {})
            .filter((attr) => {
                return attr.name !== 'relType' && attr.name !== 'sourceType' && attr.name !== 'targetType'
            })
            .map((filtredAttr) => ({ name: filtredAttr.name?.split('--')[0], filterValue: filtredAttr.filterValue }))
        if (attributes && attributes.length > 0) relFilter.attributes = attributes
        if (filter.relType) relFilter.type = [filter.relType]
        if (filter.sourceType) relFilter.startCiTypeName = [filter.sourceType]
        if (filter.targetType) relFilter.endCiTypeName = [filter.targetType]
        setRequestPayload((prevRequest) => {
            return {
                ...prevRequest,
                relFilter: relFilter,
                perpage: filter.pageSize,
                page: filter.pageNumber,
                sortBy: filter.sort?.[0]?.orderBy,
                sortType: filter.sort?.[0]?.sortDirection,
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filter.pageSize,
        filter.pageNumber,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        filter.sort?.[0]?.orderBy,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        filter.sort?.[0]?.sortDirection,
        filter.relType,
        filter.sourceType,
        filter.targetType,
    ])

    return (
        <View
            relations={relationships}
            relTypeOptions={relTypeOptions ?? []}
            ciTypes={ciTypes?.results ?? []}
            filter={filter}
            totalItems={totaltems}
            isLoadingRelations={isLoading}
            handleFilterChange={handleFilterChange}
            onSourceTypeChange={onSourceTypeChange}
            onTargetTypeChange={onTargetTypeChange}
            //onRelTypeChange={onRelTypeChange}
            // relAttributes={relAttributes}
            // relAttributeProfiles={relAttributeProfiles}
        />
    )
}
