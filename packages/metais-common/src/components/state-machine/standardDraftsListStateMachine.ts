import { createMachine } from 'xstate'

import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'

export enum StateMachineStatesExtension {
    FETCHING = 'FETCHING',
}

export const standardDraftsListStateMachine = createMachine({
    id: 'standardDraftsListStateMachine',
    initial: StateMachineStatesExtension.FETCHING,
    states: {
        FETCHING: {
            on: {
                REQUESTED: StandardDraftsDraftStates.REQUESTED,
                ASSIGNED: StandardDraftsDraftStates.ASSIGNED,
                REJECTED: StandardDraftsDraftStates.REJECTED,
                ACCEPTED: StandardDraftsDraftStates.ACCEPTED,
            },
        },
        REQUESTED: {
            on: {
                ACCEPTED: StandardDraftsDraftStates.ACCEPTED,
                ASSIGNED: StandardDraftsDraftStates.ASSIGNED,
                REJECTED: StandardDraftsDraftStates.REJECTED,
            },
        },
        ASSIGNED: {
            on: {
                ACCEPTED: StandardDraftsDraftStates.ACCEPTED,
                REJECTED: StandardDraftsDraftStates.REJECTED,
            },
        },
        REJECTED: {
            on: {
                ACCEPTED: StandardDraftsDraftStates.ACCEPTED,
            },
        },
        ACCEPTED: {
            on: {
                REJECTED: StandardDraftsDraftStates.REJECTED,
            },
        },
    },
})
