import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { useParams } from 'react-router-dom'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { standardDraftsListStateMachine } from '@isdd/metais-common/components/state-machine/standardDraftsListStateMachine'
import { InterpreterFrom } from 'xstate'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { DraftsListFormContainer } from '@/components/entities/draftsList/DraftsListFormContainer'
import { DraftListDetailView } from '@/components/entities/draftsList/DraftListDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListIdHeader } from '@/components/entities/draftsList/DraftsListIdHeader'
import { StandardDraftsListPermissionsWrapper } from '@/components/permissions/StandardDraftsListPermissionsWrapper'
import { DraftsListStateMachineWrapper } from '@/components/entities/draftsList/DraftsListStateMachineWrapper'

export const StandardDraftsStateMachine = createContext({
    stateMachineService: {} as InterpreterFrom<typeof standardDraftsListStateMachine>,
})

const DraftDetail: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    return (
        <DraftsListFormContainer
            View={({ data, isLoading, isError, guiAttributes, workGroup }) => {
                return (
                    <>
                        <StandardDraftsListPermissionsWrapper
                            groupId={data?.workGroupId ?? ''}
                            state={data?.standardRequestState as StandardDraftsDraftStates}
                            links={data?.links ?? []}
                            requestChannel={data?.requestChannel}
                        >
                            <>
                                <BreadCrumbs
                                    withWidthContainer
                                    links={[
                                        { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                                        { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                                        { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                                        {
                                            label: data?.srName ?? t('breadcrumbs.noName'),
                                            href: `${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${entityId}`,
                                        },
                                    ]}
                                />
                                <MainContentWrapper>
                                    <QueryFeedback loading={isLoading} error={isError} withChildren>
                                        <DraftsListStateMachineWrapper data={data}>
                                            <>
                                                {!isLoading && <DraftsListIdHeader entityId={entityId ?? ''} entityItemName={data?.srName ?? ''} />}
                                                <DraftListDetailView data={data} guiAttributes={guiAttributes} workGroup={workGroup} />
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
