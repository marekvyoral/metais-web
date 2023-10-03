import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { ButtonLink } from '@isdd/idsk-ui-kit/index'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { StandardDraftsStateMachine } from '@/pages/standardization/draftsList/[entityId]/form'
import { getPopupContentWithPermissions } from '@/componentHelpers/draftsList'

interface IDraftsListButtonPopupContent {
    onClick: (incomingState: StandardDraftsDraftStates) => void
}

export const DraftsListButtonPopupContent = ({ onClick }: IDraftsListButtonPopupContent) => {
    const refRegisterStateContext = useContext(StandardDraftsStateMachine)
    const machine = useStateMachine({ stateContext: refRegisterStateContext })

    const allPosibleSteps = machine?.getAllPosibleTransitions<StandardDraftsDraftStates>()
    const { t } = useTranslation()

    return (
        <>
            <Can I={Actions.CREATE} a={`DraftsList.confluenceDocs`}>
                <ButtonLink key={'confluenceDocs'} label={t(`DraftsList.header.confluenceDocs`)} />
            </Can>
            {getPopupContentWithPermissions(allPosibleSteps, t, onClick)}
        </>
    )
}
