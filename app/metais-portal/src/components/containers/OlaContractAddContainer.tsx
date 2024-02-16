import { Metadata, UpdateContentBody, useUpdateContent } from '@isdd/metais-common/api/generated/dms-swagger'
import { Role, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiOlaContractData, ListOlaContractListParams, RequestIdUi, useSaveOlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ApiError, CiCode, useGenerateCodeAndURL, useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { OLA_Kontrakt, SLA_SPRAVA } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { canEditOlaContract, getGId } from '@/components/views/ola-contract-list/helper'

export interface IAdditionalFilterField extends ListOlaContractListParams {
    liableEntities?: string[]
}
export interface IOlaContractSaveView {
    ciCode?: CiCode
    isLoading: boolean
    isError?: boolean
    saveContract: UseMutateAsyncFunction<
        RequestIdUi | void,
        ApiError,
        {
            data: ApiOlaContractData
        },
        unknown
    >
    saveDoc: UseMutateAsyncFunction<
        Metadata,
        ApiError,
        {
            uuid: string
            data: UpdateContentBody
        },
        unknown
    >
    ownerGid?: string
    olaContract?: ApiOlaContractData
    olaContractDocument?: Metadata
    isOwnerOfContract?: boolean
    canChange?: boolean
    isEdit?: boolean
}

interface IOlaContractAddContainer {
    View: React.FC<IOlaContractSaveView>
}

export const OlaContractAddContainer: React.FC<IOlaContractAddContainer> = ({ View }) => {
    const { data: ciCode, isLoading: isCiCodeLoading, isError: isCiCodeError } = useGenerateCodeAndURL(OLA_Kontrakt)
    const { mutateAsync: saveContract, isError: isSaveError, isLoading: isSaveLoading } = useSaveOlaContract()
    const { mutateAsync: saveDoc, isError: isSaveDocError, isLoading: isSaveDocLoading } = useUpdateContent()
    const { data: roleData } = useFindAll11({ name: SLA_SPRAVA })
    const [ownerGid, setOwnerGid] = useState<string>()
    const { data: ciType, isLoading: isCiTypeLoading, isError: isCiTypeError } = useGetCiType(OLA_Kontrakt)

    const {
        state: { user },
    } = useAuth()

    useEffect(() => {
        if (roleData) {
            setOwnerGid(getGId(user?.groupData ?? [], (roleData as Role).uuid ?? ''))
        }
    }, [roleData, user?.groupData])

    return (
        <MainContentWrapper>
            <View
                canChange={canEditOlaContract(user, ciType)}
                isOwnerOfContract
                ownerGid={ownerGid}
                saveContract={saveContract}
                saveDoc={saveDoc}
                ciCode={ciCode}
                isLoading={isCiCodeLoading || isSaveLoading || isSaveDocLoading || isCiTypeLoading}
                isError={isCiCodeError || isSaveError || isSaveDocError || isCiTypeError}
            />
        </MainContentWrapper>
    )
}
