import {
    CiHistoryVersionsIncidentRelationshipsUi,
    ConfigurationItemUiAttributes,
    HistoryVersionUiConfigurationItemUi,
    useReadCiHistoryVersion,
    useReadCiHistoryVersionsIncidentRels,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType, CiTypePreviewList, useGetCiType, useListCiTypes1Hook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { IRelationItem } from '@/components/containers/HistorySingleItemCompareContainer'

export interface IView {
    ciTypeData: CiType | undefined
    dataFirst: HistoryVersionUiConfigurationItemUi | undefined
    dataSec: HistoryVersionUiConfigurationItemUi | undefined
    dataRelationFirst: IRelationItem[] | undefined
    dataRelationSecond: IRelationItem[] | undefined
}

interface IHistoryItemsCompareContainerProps {
    View: React.FC<IView>
    entityName: string
    entityId: string
    firstId: string
    secondId: string
}

export const HistoryItemsCompareContainer: React.FC<IHistoryItemsCompareContainerProps> = ({ View, entityId, entityName, firstId, secondId }) => {
    const {
        state: { user },
    } = useAuth()
    const listCiTypes = useListCiTypes1Hook()
    const [isLoadingCiTypes, setLoadingCiTypes] = useState<boolean>(false)
    const [ciTypes, setCiTypes] = useState<CiTypePreviewList>()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })
    const { data: dataSecond, isError: isErrorSec, isLoading: isLoadingSec } = useReadCiHistoryVersion(entityId ?? '', { versionId: secondId })
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

    const {
        data: dataRelationSecond,
        isLoading: isLoadingRelSecond,
        isError: isErrorRelSecond,
        refetch: refetchSec,
        isFetching: isFetchingSec,
    } = useReadCiHistoryVersionsIncidentRels(entityId ?? '', {
        versionId: secondId,
        page: defaultPaging.pageNumber,
        perPage: defaultPaging.pageSize,
        includeCis: true,
    })

    const mapRelationsData = (data?: CiHistoryVersionsIncidentRelationshipsUi): IRelationItem[] => {
        const result = data?.incidentCis?.map((history) => ({
            type: ciTypes?.results?.find((type) => type.technicalName === history?.item?.type)?.name,
            uuid: history?.item?.uuid,
            name: history?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === 'Gen_Profil_nazov')?.value,
        })) as IRelationItem[]

        return result
    }

    useEffect(() => {
        setLoadingCiTypes(true)
        listCiTypes({ roles: user?.roles ?? [] })
            .then((res) => setCiTypes(res))
            .finally(() => {
                setLoadingCiTypes(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        refetch()
        setDefaultPaging({
            pageNumber: defaultPaging.pageNumber,
            pageSize: dataRelFirst?.pagination?.totaltems ?? defaultPaging.pageSize,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataRelFirst])

    useEffect(() => {
        refetchSec()
        setDefaultPaging({
            pageNumber: defaultPaging.pageNumber,
            pageSize: dataRelFirst?.pagination?.totaltems ?? defaultPaging.pageSize,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataRelationSecond])

    const isLoading =
        isLoadingSec ||
        isLoadingFirst ||
        isCiTypeDataLoading ||
        isLoadingRelFirst ||
        isLoadingRelSecond ||
        isLoadingCiTypes ||
        isFetching ||
        isFetchingSec
    const isError = isErrorFirst || isErrorSec || isCiTypeDataError || isErrorRelFirst || isErrorRelSecond

    const isNewerVersion = (first: HistoryVersionUiConfigurationItemUi, sec: HistoryVersionUiConfigurationItemUi) => {
        if (first.actionTime && sec.actionTime) {
            if (new Date(first.actionTime) > new Date(sec.actionTime)) {
                return true
            }
            return false
        }
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                ciTypeData={ciTypeData}
                dataFirst={!isNewerVersion(dataFirst ?? {}, dataSecond ?? {}) ? dataFirst : dataSecond}
                dataSec={isNewerVersion(dataFirst ?? {}, dataSecond ?? {}) ? dataFirst : dataSecond}
                dataRelationFirst={mapRelationsData(dataRelFirst)}
                dataRelationSecond={mapRelationsData(dataRelationSecond)}
            />
        </QueryFeedback>
    )
}
