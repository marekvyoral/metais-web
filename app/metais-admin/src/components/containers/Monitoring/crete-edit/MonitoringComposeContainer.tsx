import { ApiActiveMonitoringCfg, useCreate, useGet, useUpdate } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useNavigate } from 'react-router-dom'
import { ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { BreadCrumbs, BreadCrumbsItemProps, HomeIcon } from '@isdd/idsk-ui-kit/index'

import { IMonitoringComposeView } from '@/components/views/monitoring/compose'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface IMonitoringCreateEditContainer {
    View: React.FC<IMonitoringComposeView>
    id: number
}

export const MonitoringComposeContainer: React.FC<IMonitoringCreateEditContainer> = ({ View, id }) => {
    const { t } = useTranslation()
    const { setIsActionSuccess } = useActionSuccess()
    const navigate = useNavigate()
    const isEditing = !!id
    const { data: monitoringCfgData, isLoading: monitoringCfgLoading, isError: monitoringCfgError } = useGet(id, { query: { enabled: isEditing } })
    const readCiList = useReadCiList1Hook()
    const [isErrorCiList, setIsErrorCiList] = useState<boolean>(false)
    const [isLoadingCiList, setIsLoadingCiList] = useState<boolean>(false)
    const [defaultValue, setDefaultValue] = useState<ConfigurationItemUi | undefined>(undefined)
    const {
        isLoading: createMonitoringRecordLoading,
        isError: createMonitoringRecordError,
        status: createMonitoringRecordStatus,
        mutateAsync: createMonitoringRecordAsyncMutation,
    } = useCreate()

    const createMonitoringRecord = async (data: ApiActiveMonitoringCfg) => {
        await createMonitoringRecordAsyncMutation({ data })
    }

    const {
        isLoading: updateMonitoringRecordLoading,
        isError: updateMonitoringRecordError,
        status: updateMonitoringRecordStatus,
        mutateAsync: updateMonitoringRecordAsyncMutation,
    } = useUpdate()

    const updateMonitoringRecord = async (data: ApiActiveMonitoringCfg) => {
        await updateMonitoringRecordAsyncMutation({ data })
    }

    useEffect(() => {
        if (createMonitoringRecordStatus == 'success') {
            setIsActionSuccess({
                value: true,
                path: AdminRouteNames.MONITORING_LIST,
                additionalInfo: { type: 'create' },
            })
            navigate(`${AdminRouteNames.MONITORING_LIST}`)
        }
    }, [createMonitoringRecordStatus, navigate, setIsActionSuccess])

    useEffect(() => {
        if (updateMonitoringRecordStatus == 'success') {
            setIsActionSuccess({
                value: true,
                path: AdminRouteNames.MONITORING_LIST,
                additionalInfo: { type: 'update' },
            })
            navigate(`${AdminRouteNames.MONITORING_LIST}`)
        }
    }, [navigate, setIsActionSuccess, updateMonitoringRecordStatus])

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        try {
            setIsErrorCiList(false)
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const options = await readCiList({
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                filter: {
                    metaAttributes: {
                        state: ['DRAFT'],
                    },
                    type: ['ISVS', 'KS', 'AS'],
                    ...(!!searchQuery && { searchFields: ['Gen_Profil_nazov', 'Gen_Profil_kod_metais'] }),
                    fullTextSearch: searchQuery,
                },
                page: page,
                perpage: 50,
            })
            return {
                options: options.configurationItemSet || [],
                hasMore: options.configurationItemSet?.length == 50 ? true : false,
                additional: {
                    page: page,
                },
            }
        } catch {
            setIsErrorCiList(true)
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: 1,
                },
            }
        }
    }

    useEffect(() => {
        const getData = (uuid: string) => {
            setIsLoadingCiList(true)
            setIsErrorCiList(false)
            readCiList({
                sortBy: ATTRIBUTE_NAME.Gen_Profil_nazov,
                sortType: SortType.ASC,
                filter: {
                    metaAttributes: {
                        state: ['DRAFT'],
                    },
                    type: ['ISVS', 'KS', 'AS'],
                    uuid: [uuid],
                },
                page: 1,
                perpage: 1,
            })
                .then((data) => {
                    setIsLoadingCiList(false)
                    setDefaultValue(data.configurationItemSet?.[0])
                })
                .catch(() => {
                    setIsLoadingCiList(false)
                    setIsErrorCiList(true)
                })
        }

        if (!defaultValue && monitoringCfgData?.isvsUuid) {
            getData(monitoringCfgData?.isvsUuid)
        }

        if (defaultValue && !monitoringCfgData?.isvsUuid) {
            setDefaultValue(undefined)
        }
    }, [defaultValue, monitoringCfgData?.isvsUuid, readCiList])

    const getBreadCrumbLinks = (creatingNew: boolean) => {
        const links: BreadCrumbsItemProps[] = [
            { label: t('monitoring.breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
            { label: t('monitoring.breadcrumbs.monitoring'), href: AdminRouteNames.MONITORING },
            { label: t('monitoring.breadcrumbs.list'), href: AdminRouteNames.MONITORING_LIST },
        ]

        if (creatingNew) {
            links.push({ label: t('monitoring.breadcrumbs.create'), href: AdminRouteNames.MONITORING_CREATE })
        } else {
            links.push({
                label: monitoringCfgData?.isvsName ?? `${t('monitoring.breadcrumbs.detail')}`,
                href: `${AdminRouteNames.MONITORING_DETAIL}/${id}`,
            })
            links.push({ label: t('monitoring.breadcrumbs.edit'), href: `${AdminRouteNames.MONITORING_EDIT}/${id}` })
        }
        return links
    }

    return (
        <>
            <BreadCrumbs withWidthContainer links={getBreadCrumbLinks(!isEditing)} />
            <MainContentWrapper>
                <QueryFeedback
                    loading={(monitoringCfgLoading && isEditing) || createMonitoringRecordLoading || updateMonitoringRecordLoading || isLoadingCiList}
                    error={monitoringCfgError || isErrorCiList || createMonitoringRecordError || updateMonitoringRecordError}
                    indicatorProps={{ layer: 'parent', transparentMask: false }}
                    withChildren
                >
                    <View
                        monitoringCfgData={monitoringCfgData}
                        ciDefaultValue={defaultValue}
                        isCreateLoading={false}
                        loadOptions={loadOptions}
                        createMonitoringRecord={createMonitoringRecord}
                        updateMonitoringRecord={updateMonitoringRecord}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
