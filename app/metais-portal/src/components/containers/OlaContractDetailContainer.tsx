import { GetContentParams, Metadata, useGetContentHook, useGetMeta } from '@isdd/metais-common/api/generated/dms-swagger'
import { ApiError, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiOlaContractData, ListOlaContractListParams, useGetOlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { OLA_Kontrakt } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { canEditOlaContract } from '@/components/views/ola-contract-list/helper'

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
}

interface IOlaContractAddContainer {
    View: React.FC<IOlaContractDetailView>
}

export const OlaContractDetailContainer: React.FC<IOlaContractAddContainer> = ({ View }) => {
    const { entityId } = useParams()

    const { data: olaContract, isLoading: isOlaContractLoading, isError: isOlaContractError, refetch } = useGetOlaContract(entityId ?? '')
    const {
        data: olaContractDocument,
        isLoading: isOlaContractDocumentLoading,
        isError: isOlaContractDocumentError,
    } = useGetMeta(entityId ?? '', {}, { query: { retry: 1 } })
    const downloadVersionFile = useGetContentHook()
    const [showHistory, setShowHistory] = useState(false)
    const { data: ciType, isLoading: isCiTypeLoading, isError: isCiTypeError } = useGetCiType(OLA_Kontrakt)
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
        <MainContentWrapper>
            <View
                canChange={canEditOlaContract(user, ciType)}
                isOwnerOfContract={isOwnerOfContract}
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                isLoading={
                    isOlaContractLoading || isOwnerByGidLoading || isCiTypeLoading || (!isOlaContractDocumentError && isOlaContractDocumentLoading)
                }
                isError={isOlaContractError || isOwnerByGidError || isCiTypeError}
                olaContract={olaContract}
                document={olaContractDocument}
                downloadVersionFile={downloadVersionFile}
                refetch={refetch}
            />
        </MainContentWrapper>
    )
}
