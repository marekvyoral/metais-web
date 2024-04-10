import React, { FC, createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { useParams } from 'react-router-dom'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { standardDraftsListStateMachine } from '@isdd/metais-common/components/state-machine/standardDraftsListStateMachine'
import { InterpreterFrom } from 'xstate'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ApiStandardRequest, Group } from '@isdd/metais-common/api/generated/standards-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { DraftListDetailView } from '@/components/entities/draftslist/detail/DraftListDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListIdHeader } from '@/components/entities/draftslist/DraftsListIdHeader'
import { StandardDraftsListPermissionsWrapper } from '@/components/permissions/StandardDraftsListPermissionsWrapper'
import { DraftsListStateMachineWrapper } from '@/components/entities/draftslist/DraftsListStateMachineWrapper'
import { DraftsListFormContainer } from '@/components/containers/draftslist/DraftsListFormContainer'

export const StandardDraftsStateMachine = createContext({
    stateMachineService: {} as InterpreterFrom<typeof standardDraftsListStateMachine>,
})

type DraftDetailViewProps = {
    entityId: string
    isLoading: boolean
    isError: boolean
    data: {
        requestData?: ApiStandardRequest | undefined
        guiAttributes?: Attribute[] | undefined
        workGroup?: Group | undefined
    }
}

const DraftDetailView: FC<DraftDetailViewProps> = ({ entityId, isLoading, isError, data }) => {
    const { t } = useTranslation()
    const { requestData } = data
    const { isLoading: isAbilityLoading, isError: isAbilityError } = useAbilityContextWithFeedback()
    document.title = formatTitleString(t('draftsList.detail', { name: requestData?.name ?? '' }))

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                    {
                        label: requestData?.name ?? t('breadcrumbs.noName'),
                        href: `${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading || !!isAbilityLoading} error={isError || isAbilityError} withChildren>
                    <DraftsListStateMachineWrapper data={requestData}>
                        <>
                            {!isLoading && (
                                <DraftsListIdHeader
                                    entityId={entityId ?? ''}
                                    entityItemName={requestData?.name ?? ''}
                                    requestChannel={requestData?.requestChannel ?? ''}
                                />
                            )}
                            <DraftListDetailView data={data} />
                        </>
                    </DraftsListStateMachineWrapper>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

const DraftDetail: React.FC = () => {
    const { entityId } = useParams()
    return (
        <DraftsListFormContainer
            entityId={entityId}
            View={({ data, isLoading, isError }) => {
                const { requestData } = data
                return (
                    <StandardDraftsListPermissionsWrapper
                        groupId={requestData?.workGroupId ?? ''}
                        state={requestData?.standardRequestState as StandardDraftsDraftStates}
                        links={requestData?.links ?? []}
                        requestChannel={requestData?.requestChannel}
                    >
                        <DraftDetailView entityId={entityId ?? ''} isError={isError} isLoading={isLoading} data={data} />
                    </StandardDraftsListPermissionsWrapper>
                )
            }}
        />
    )
}
export default DraftDetail
