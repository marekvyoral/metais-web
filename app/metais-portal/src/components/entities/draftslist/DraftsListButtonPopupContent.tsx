import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'

import { StandardDraftsStateMachine } from '@/pages/standardization/draftslist/[entityId]/form'
import { getPopupContentWithPermissions } from '@/componentHelpers/draftsList'

interface IDraftsListButtonPopupContent {
    onClick: (incomingState: StandardDraftsDraftStates) => void
}

export const DraftsListButtonPopupContent = ({ onClick }: IDraftsListButtonPopupContent) => {
    const refRegisterStateContext = useContext(StandardDraftsStateMachine)
    const machine = useStateMachine({ stateContext: refRegisterStateContext })

    const allPosibleSteps = machine?.getAllPosibleTransitions<StandardDraftsDraftStates>()
    const { t } = useTranslation()

    return <>{getPopupContentWithPermissions(allPosibleSteps, t, onClick)}</>
}
