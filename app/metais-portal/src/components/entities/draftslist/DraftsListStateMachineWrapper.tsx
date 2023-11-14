import React, { useEffect } from 'react'
import { useInterpret } from '@xstate/react'
import {
    StateMachineStatesExtension,
    standardDraftsListStateMachine,
} from '@isdd/metais-common/components/state-machine/standardDraftsListStateMachine'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'

import { StandardDraftsStateMachine } from '@/pages/standardization/draftslist/[entityId]/form'

interface IDraftsListStateMachineWrapper {
    children: JSX.Element
    data: ApiStandardRequest | undefined
}

export const DraftsListStateMachineWrapper = ({ children, data }: IDraftsListStateMachineWrapper) => {
    const stateMachineService = useInterpret(standardDraftsListStateMachine)
    const currentState = stateMachineService?.getSnapshot()?.value

    useEffect(() => {
        if (data && stateMachineService && currentState === StateMachineStatesExtension.FETCHING) {
            stateMachineService?.send?.({ type: data?.standardRequestState as StandardDraftsDraftStates })
        }
    }, [data, currentState, stateMachineService])

    return <StandardDraftsStateMachine.Provider value={{ stateMachineService }}>{children}</StandardDraftsStateMachine.Provider>
}
