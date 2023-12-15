import {
    CiHistoryVersionsIncidentRelationshipsUi,
    ConfigurationItemUiAttributes,
    HistoryVersionUiConfigurationItemUi,
    useReadCiHistoryVersion,
    useReadCiHistoryVersionsIncidentRels,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CiType, useGetCiType, useListCiTypes1Hook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

export interface IRelationItem {
    type?: string
    name?: string
    uuid?: string
}

export interface IHistorySingleItemCompareContainerView {
    ciTypeData: CiType | undefined
    dataFirst?: HistoryVersionUiConfigurationItemUi
    dataSec?: HistoryVersionUiConfigurationItemUi
    constraintsData: (EnumType | undefined)[]
    isSimple?: boolean
    dataRelationFirst?: IRelationItem[]
    dataRelationSecond?: IRelationItem[]
}

interface IHistorySingleItemCompareContainerProps {
    View: React.FC<IHistorySingleItemCompareContainerView>
    firstId: string
    entityId: string
    entityName: string
}

export const HistorySingleItemCompareContainer: React.FC<IHistorySingleItemCompareContainerProps> = ({ View, entityName, entityId, firstId }) => {
    const {
        state: { user },
    } = useAuth()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })
    const listCiTypes = useListCiTypes1Hook()

    const {
        data: ciTypes,
        isLoading: isLoadingCiTypes,
        isError: isErrorCiTypes,
    } = useQuery({
        queryFn: () => listCiTypes({ roles: user?.roles ?? [] }),
        queryKey: ['listCiTypes', user?.roles],
    })

    const [defaultPaging, setDefaultPaging] = useState({ pageNumber: 1, pageSize: 10 })
    const {
        data: dataRelFirst,
        isLoading: isLoadingRelFirst,
        isError: isErrorRelFirst,
        refetch,
        isFetching,
    } = useReadCiHistoryVersionsIncidentRels(entityId ?? '', {
        versionId: firstId,
        page: defaultPaging.pageNumber,
        perPage: defaultPaging.pageSize,
        includeCis: true,
    })

    const { constraintsData, isLoading: isAttributesLoading, isError: isAttributesError } = useAttributesHook(entityName ?? '')

    const mapRelationsData = (data?: CiHistoryVersionsIncidentRelationshipsUi): IRelationItem[] => {
        const res = data?.incidentCis?.map((history) => ({
            type: ciTypes?.results?.find((type) => type.technicalName === history?.item?.type)?.name,
            uuid: history?.item?.uuid,
            name: history?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === 'Gen_Profil_nazov')?.value,
        })) as IRelationItem[]

        return res
    }

    useEffect(() => {
        refetch()
        setDefaultPaging({
            pageNumber: defaultPaging.pageNumber,
            pageSize: dataRelFirst?.pagination?.totaltems ?? defaultPaging.pageSize,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataRelFirst])

    const isLoading = [isLoadingFirst, isCiTypeDataLoading, isAttributesLoading, isLoadingRelFirst, isFetching, isLoadingCiTypes].some((item) => item)
    const isError = [isErrorFirst, isCiTypeDataError, isAttributesError, isErrorRelFirst, isErrorCiTypes].some((item) => item)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                constraintsData={constraintsData}
                ciTypeData={ciTypeData}
                dataFirst={dataFirst}
                dataSec={undefined}
                dataRelationSecond={undefined}
                dataRelationFirst={mapRelationsData(dataRelFirst)}
            />
        </QueryFeedback>
    )
}
