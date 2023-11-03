import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { useParams } from 'react-router-dom'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { standardDraftsListStateMachine } from '@isdd/metais-common/components/state-machine/standardDraftsListStateMachine'
import { InterpreterFrom } from 'xstate'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { DraftListDetailView } from '@/components/entities/draftslist/detail/DraftListDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListIdHeader } from '@/components/entities/draftslist/DraftsListIdHeader'
import { StandardDraftsListPermissionsWrapper } from '@/components/permissions/StandardDraftsListPermissionsWrapper'
import { DraftsListStateMachineWrapper } from '@/components/entities/draftslist/DraftsListStateMachineWrapper'
import { DraftsListFormContainer } from '@/components/containers/draftslist/DraftsListFormContainer'

export const StandardDraftsStateMachine = createContext({
    stateMachineService: {} as InterpreterFrom<typeof standardDraftsListStateMachine>,
})

const DraftDetail: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    return (
        <DraftsListFormContainer
            entityId={entityId}
            View={({ data, isLoading, isError }) => {
                const { requestData } = data
                return (
                    <>
                        <StandardDraftsListPermissionsWrapper
                            groupId={requestData?.workGroupId ?? ''}
                            state={requestData?.standardRequestState as StandardDraftsDraftStates}
                            links={requestData?.links ?? []}
                            requestChannel={requestData?.requestChannel}
                        >
                            <>
                                <BreadCrumbs
                                    withWidthContainer
                                    links={[
                                        { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                                        { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                                        { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                                        {
                                            label: requestData?.srName ?? t('breadcrumbs.noName'),
                                            href: `${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}`,
                                        },
                                    ]}
                                />
                                <MainContentWrapper>
                                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                                        <DraftsListStateMachineWrapper data={requestData}>
                                            <>
                                                {!isLoading && (
                                                    <DraftsListIdHeader entityId={entityId ?? ''} entityItemName={requestData?.srName ?? ''} />
                                                )}
                                                <DraftListDetailView data={data} />
                                            </>
                                        </DraftsListStateMachineWrapper>
                                    </QueryFeedback>
                                </MainContentWrapper>
                            </>
                        </StandardDraftsListPermissionsWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftDetail
