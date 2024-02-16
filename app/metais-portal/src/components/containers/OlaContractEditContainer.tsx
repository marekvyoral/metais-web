import { useGetMeta, useUpdateContent } from '@isdd/metais-common/api/generated/dms-swagger'
import { Role, useFindAll11, useIsOwnerByGid } from '@isdd/metais-common/api/generated/iam-swagger'
import { ListOlaContractListParams, useGetOlaContract, useUpdateOlaContract } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { OLA_Kontrakt, SLA_SPRAVA } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { IOlaContractSaveView } from './OlaContractAddContainer'

import { canEditOlaContract, getGId } from '@/components/views/ola-contract-list/helper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface IAdditionalFilterField extends ListOlaContractListParams {
    liableEntities?: string[]
}

interface IOlaContractEditContainer {
    View: React.FC<IOlaContractSaveView>
}

export const OlaContractEditContainer: React.FC<IOlaContractEditContainer> = ({ View }) => {
    const { entityId } = useParams()
    const { t } = useTranslation()

    const { data: olaContract, isLoading: isOlaContractLoading, isError: isOlaContractError } = useGetOlaContract(entityId ?? '')

    const { mutateAsync: saveContract, isError: isSaveError, isLoading: isSaveLoading } = useUpdateOlaContract()
    const { mutateAsync: saveDoc, isError: isSaveDocError, isLoading: isSaveDocLoading } = useUpdateContent()
    const { data: roleData } = useFindAll11({ name: SLA_SPRAVA })
    const [ownerGid, setOwnerGid] = useState<string>()
    const { data: olaContractDocument, isLoading: isOlaContractDocumentLoading, isError: isOlaContractdocumentError } = useGetMeta(entityId ?? '')
    const { data: ciType, isLoading: isCiTypeLoading, isError: isCiTypeError } = useGetCiType(OLA_Kontrakt)

    const {
        state: { user, token },
    } = useAuth()

    const isLoggedIn = !!user?.uuid
    const {
        data: isOwnerByGid,
        isLoading: isOwnerByGidLoading,
        isError: isOwnerByGidError,
    } = useIsOwnerByGid(
        {
            gids: [olaContract?.owner ?? ''],
            login: user?.login,
        },
        { query: { enabled: !isOlaContractLoading && token !== null && isLoggedIn } },
    )

    const isOwnerOfContract = isOwnerByGid?.isOwner?.[0]?.owner

    useEffect(() => {
        if (roleData) {
            setOwnerGid(getGId(user?.groupData ?? [], (roleData as Role).uuid ?? ''))
        }
    }, [roleData, user?.groupData])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('olaContracts.heading'), href: RouterRoutes.OLA_CONTRACT_LIST },
                    { label: t('olaContracts.headingEdit', { itemName: olaContract?.name }), href: RouterRoutes.OLA_CONTRACT_ADD },
                ]}
            />
            <MainContentWrapper>
                <View
                    canChange={canEditOlaContract(user, ciType)}
                    isOwnerOfContract={isOwnerOfContract}
                    olaContractDocument={olaContractDocument}
                    olaContract={olaContract}
                    ownerGid={ownerGid}
                    saveContract={saveContract}
                    saveDoc={saveDoc}
                    isLoading={
                        isCiTypeLoading ||
                        isSaveLoading ||
                        isOwnerByGidLoading ||
                        isSaveDocLoading ||
                        isOlaContractLoading ||
                        (!isOlaContractdocumentError && isOlaContractDocumentLoading)
                    }
                    isError={isSaveError || isSaveDocError || isOlaContractError || isOwnerByGidError || isCiTypeError}
                />
            </MainContentWrapper>
        </>
    )
}
