import { GetContentParams, Metadata, useGetContentHook, useGetMeta } from '@isdd/metais-common/api/generated/dms-swagger'
import { ApiError, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import {
    ApiOlaContractData,
    ListOlaContractListParams,
    RequestIdUi,
    useGetOlaContract,
    useOlaContractTransition,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { OLA_Kontrakt, ROLES, STAV_OLA_KONTRAKT } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { EnumItem, useGetEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { canEditOlaContract } from '@/components/views/ola-contract-list/helper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface IAdditionalFilterField extends ListOlaContractListParams {
    liableEntities?: string[]
}
export interface IOlaContractDetailView {
    isLoading: boolean
    isError?: boolean
    olaContract?: ApiOlaContractData
    document?: Metadata
    downloadVersionFile: (uuid: string, params?: GetContentParams, signal?: AbortSignal) => Promise<Blob>
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<ApiOlaContractData, ApiError>>
    showHistory: boolean
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>
    isOwnerOfContract?: boolean
    canChange?: boolean
    canMoveState: boolean
    statesEnum?: EnumItem[]
    moveState: UseMutateAsyncFunction<
        RequestIdUi,
        ApiError,
        {
            olaContractUuid: string
            transition: string
        },
        unknown
    >
}

interface IOlaContractAddContainer {
    View: React.FC<IOlaContractDetailView>
}

export const OlaContractDetailContainer: React.FC<IOlaContractAddContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { t } = useTranslation()
    const { data: olaContract, isLoading: isOlaContractLoading, isError: isOlaContractError, refetch } = useGetOlaContract(entityId ?? '')
    const {
        data: olaContractDocument,
        isLoading: isOlaContractDocumentLoading,
        isError: isOlaContractDocumentError,
    } = useGetMeta(entityId ?? '', {}, { query: { retry: 1 } })
    const downloadVersionFile = useGetContentHook()
    const [showHistory, setShowHistory] = useState(false)
    const { data: ciType, isLoading: isCiTypeLoading, isError: isCiTypeError } = useGetCiTypeWrapper(OLA_Kontrakt)
    const { getRequestStatus, isError: isGetStatusError, isTooManyFetchesError, isLoading: isGettingStatus } = useGetStatus()
    const { setIsActionSuccess } = useActionSuccess()
    const {
        data: statesEnum,
        isLoading: isStatesLoading,
        isError: isStatesError,
    } = useGetEnum(STAV_OLA_KONTRAKT, { query: { select: (data) => data.enumItems } })

    const {
        mutateAsync: moveState,
        isLoading: isStateMoving,
        isError: isStateMovingError,
    } = useOlaContractTransition({
        mutation: {
            onSuccess: async (resp) => {
                await getRequestStatus(resp.requestId ?? '', () => {
                    refetch()
                    setIsActionSuccess({
                        value: true,
                        path: olaContract ? RouterRoutes.OLA_CONTRACT_LIST + '/' + olaContract.uuid : RouterRoutes.OLA_CONTRACT_LIST,
                        additionalInfo: { type: 'stateChanged' },
                    })
                })
            },
        },
    })

    const {
        state: { user, token },
    } = useAuth()
    const isLoggedIn = !!user?.uuid
    const {
        data: isOwnerByGid,
        isFetching: isOwnerByGidLoading,
        isError: isOwnerByGidError,
    } = useIsOwnerByGid(
        {
            gids: [olaContract?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !isOlaContractLoading && token !== null && isLoggedIn } },
    )

    const isOwnerOfContract = isOwnerByGid?.isOwner?.[0]?.owner

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                    { label: t('olaContracts.detail.title', { name: olaContract?.name }), href: '#' },
                ]}
            />
            <MainContentWrapper>
                <View
                    canChange={canEditOlaContract(user, ciType)}
                    isOwnerOfContract={isOwnerOfContract}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                    isLoading={
                        isStatesLoading ||
                        isGettingStatus ||
                        isStateMoving ||
                        isOlaContractLoading ||
                        isOwnerByGidLoading ||
                        isCiTypeLoading ||
                        (!isOlaContractDocumentError && isOlaContractDocumentLoading)
                    }
                    isError={
                        isStateMovingError ||
                        isOlaContractError ||
                        isOwnerByGidError ||
                        isCiTypeError ||
                        isGetStatusError ||
                        isTooManyFetchesError ||
                        isStatesError
                    }
                    olaContract={olaContract}
                    document={olaContractDocument}
                    downloadVersionFile={downloadVersionFile}
                    refetch={refetch}
                    moveState={moveState}
                    canMoveState={user?.roles.includes(ROLES.R_EGOV) ?? false}
                    statesEnum={statesEnum}
                />
            </MainContentWrapper>
        </>
    )
}
