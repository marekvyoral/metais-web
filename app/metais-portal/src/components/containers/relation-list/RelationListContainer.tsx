import React, { useEffect, useState } from 'react'
import { RelFilterUi, RelListFilterContainerUi, RelationshipUi, useReadRelationshipList } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useListCiTypes, useListRelationshipTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, CI_TYPES_QUERY_KEY, RELATIONSHIP_TYPES_QUERY_KEY } from '@isdd/metais-common/constants'
import { IOption } from '@isdd/idsk-ui-kit/index'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useGetCiTypeHookWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { useTranslation } from 'react-i18next'

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
    const { i18n } = useTranslation()

    const [relationships, setRelationships] = useState<RelationshipUi[]>([])
    const [totaltems, setTotalItems] = useState<number>(0)

    const [relTypeOptions, setRelTypeOptions] = useState<IOption<string>[]>()
    const [sourceOptions, setSourceOptions] = useState<IOption<string>[]>()
    const [targetOptions, setTargetOptions] = useState<IOption<string>[]>()
    const [ciTypesOptions, setCiTypesOptions] = useState<IOption<string>[]>()

    // const [relAttributes, setRelAttributes] = useState<Attribute[] | undefined>()
    // const [relAttributeProfiles, setRelAttributeProfiles] = useState<AttributeProfile[] | undefined>()

    const [seed, setSeed] = useState(1)

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

    const { data: relTypes } = useListRelationshipTypes({ filter: {} }, { query: { queryKey: [RELATIONSHIP_TYPES_QUERY_KEY, i18n.language] } })
    const { data: ciTypes } = useListCiTypes({ filter: {} }, { query: { queryKey: [CI_TYPES_QUERY_KEY, i18n.language] } })
    const ciTypeHook = useGetCiTypeHookWrapper()
    //const relTypeHook = useGetRelationshipTypeHookWrapper()

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
        onSourceTypeChange(filter.sourceType)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.sourceType])

    useEffect(() => {
        onTargetTypeChange(filter.targetType)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.targetType])

    useEffect(() => {
        setSeed(Math.random())
    }, [ciTypesOptions])

    const compareOptions = (a: IOption<string>, b: IOption<string>) => {
        const labelA = a.label as string
        const labelB = b.label as string
        if (labelA.toUpperCase() < labelB.toUpperCase()) {
            return -1
        }
        if (labelA.toUpperCase() > labelB.toUpperCase()) {
            return 1
        }
        return 0
    }

    useEffect(() => {
        if (ciTypes?.results) {
            setCiTypesOptions(
                ciTypes?.results
                    ?.map((type) => ({
                        value: type.technicalName ?? '',
                        label: type.name ?? '',
                    }))
                    .sort(compareOptions),
            )
        }
    }, [ciTypes?.results])

    useEffect(() => {
        const isSourceAndTarget = !!(sourceOptions && targetOptions)
        const isOnlySource = !!(sourceOptions && !targetOptions)
        const isOnlyTarget = !!(!sourceOptions && targetOptions)
        switch (true) {
            case isSourceAndTarget:
                setRelTypeOptions(sourceOptions?.filter((rel1) => targetOptions?.some((rel2) => rel2.value === rel1.value))?.sort(compareOptions))
                break
            case isOnlySource:
                setRelTypeOptions(sourceOptions?.sort(compareOptions))
                break
            case isOnlyTarget:
                setRelTypeOptions(targetOptions?.sort(compareOptions))
                break
            default:
                setRelTypeOptions(relTypes?.results?.map((rel) => ({ value: rel.technicalName ?? '', label: rel.name ?? '' }))?.sort(compareOptions))
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
            ciTypeOptions={ciTypesOptions ?? []}
            filter={filter}
            totalItems={totaltems}
            isLoadingRelations={isLoading}
            handleFilterChange={handleFilterChange}
            onSourceTypeChange={onSourceTypeChange}
            onTargetTypeChange={onTargetTypeChange}
            seed={seed}
            //onRelTypeChange={onRelTypeChange}
            // relAttributes={relAttributes}
            // relAttributeProfiles={relAttributeProfiles}
        />
    )
}
