import { Metadata, UpdateContentBody, useUpdateContent } from '@isdd/metais-common/api/generated/dms-swagger'
import { Role, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiOlaContractData, ListOlaContractListParams, useSaveOlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ApiError, CiCode, useGenerateCodeAndURL } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Group, useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface IAdditionalFilterField extends ListOlaContractListParams {
    liableEntities?: string[]
}
export interface IOlaContractAddView {
    ciCode?: CiCode
    isLoading: boolean
    isError?: boolean
    saveContract: UseMutateAsyncFunction<
        void,
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
}

interface IOlaContractAddContainer {
    View: React.FC<IOlaContractAddView>
}

export const OlaContractAddContainer: React.FC<IOlaContractAddContainer> = ({ View }) => {
    const { data: ciCode, isLoading: isCiCodeLoading, isError: isCiCodeError } = useGenerateCodeAndURL('OLA_Kontrakt')
    const { mutateAsync: saveContract, isError: isSaveError, isLoading: isSaveLoading } = useSaveOlaContract()
    const { mutateAsync: saveDoc, isError: isSaveDocError, isLoading: isSaveDocLoading } = useUpdateContent()
    const { data: roleData } = useFindAll11({ name: 'SLA_SPRAVA' })
    const [ownerGid, setOwnerGid] = useState<string>()
    const { state } = useAuth()

    const getGId = (groups: Group[], uuid: string) =>
        groups.find((g) => g.roles.find((r) => r.roleUuid === uuid))?.roles.find((r) => r.roleUuid === uuid)?.gid ?? ''

    useEffect(() => {
        if (roleData) {
            setOwnerGid(getGId(state.user?.groupData ?? [], (roleData as Role).uuid ?? ''))
        }
    }, [roleData, state.user?.groupData])

    return (
        <MainContentWrapper>
            <View
                ownerGid={ownerGid}
                saveContract={saveContract}
                saveDoc={saveDoc}
                ciCode={ciCode}
                isLoading={isCiCodeLoading || isSaveLoading || isSaveDocLoading}
                isError={isCiCodeError || isSaveError || isSaveDocError}
            />
        </MainContentWrapper>
    )
}
