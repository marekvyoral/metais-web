import {
    CiHistoryVersionsIncidentRelationshipsUi,
    ConfigurationItemUiAttributes,
    HistoryVersionUiConfigurationItemUi,
    useReadCiHistoryVersion,
    useReadCiHistoryVersionsIncidentRels,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CiType, CiTypePreviewList, useGetCiType, useListCiTypes1Hook } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useEffect, useState } from 'react'

export interface IRelationItem {
    type?: string
    name?: string
    uuid?: string
}

export interface IView {
    ciTypeData: CiType | undefined
    dataFirst: HistoryVersionUiConfigurationItemUi | undefined
    dataSec: HistoryVersionUiConfigurationItemUi | undefined
    dataRelationFirst?: IRelationItem[]
    dataRelationSecond?: IRelationItem[]
}

interface IHistorySingleItemCompareContainerProps {
    View: React.FC<IView>
    firstId: string
    entityId: string
    entityName: string
}

export const HistorySingleItemCompareContainer: React.FC<IHistorySingleItemCompareContainerProps> = ({ View, entityName, entityId, firstId }) => {
    const {
        state: { user },
    } = useAuth()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const [ciTypes, setCiTypes] = useState<CiTypePreviewList>()
    const [isLoadingCiTypes, setLoadingCiTypes] = useState<boolean>(false)
    const { data: dataFirst, isError: isErrorFirst, isLoading: isLoadingFirst } = useReadCiHistoryVersion(entityId ?? '', { versionId: firstId })
    const listCiTypes = useListCiTypes1Hook()
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

    const mapRelationsData = (data?: CiHistoryVersionsIncidentRelationshipsUi): IRelationItem[] => {
        const res = data?.incidentCis?.map((history) => ({
            type: ciTypes?.results?.find((type) => type.technicalName === history?.item?.type)?.name,
            uuid: history?.item?.uuid,
            name: history?.item?.attributes?.find((i: ConfigurationItemUiAttributes) => i.name === 'Gen_Profil_nazov')?.value,
        })) as IRelationItem[]

        return res
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

    const isLoading = isLoadingFirst || isCiTypeDataLoading || isLoadingRelFirst || isFetching || isLoadingCiTypes
    const isError = isErrorFirst || isCiTypeDataError || isErrorRelFirst

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                ciTypeData={ciTypeData}
                dataFirst={dataFirst}
                dataSec={undefined}
                dataRelationSecond={undefined}
                dataRelationFirst={mapRelationsData(dataRelFirst)}
            />
        </QueryFeedback>
    )
}
