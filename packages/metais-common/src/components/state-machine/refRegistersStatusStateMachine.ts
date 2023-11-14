import { createMachine } from 'xstate'

import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'

export enum StateMachineStatesExtension {
    FETCHING = 'FETCHING',
}

export enum StateMachineEvents {
    IN_CONSTRUCTION = 'IN_CONSTRUCTION',
    READY_TO_APPROVAL = 'READY_TO_APPROVAL',
    APPROVAL_IN_PROGRESS = 'APPROVAL_IN_PROGRESS',
    MPK_IN_PROGRESS = 'MPK_IN_PROGRESS',
    REJECTED = 'REJECTED',
    PUBLISHED = 'PUBLISHED',
}

export const refRegisterStateMachine = createMachine({
    id: 'refRegisterStateMachine',
    initial: StateMachineStatesExtension.FETCHING,
    states: {
        FETCHING: {
            on: {
                READY_TO_APPROVAL: ApiReferenceRegisterState.READY_TO_APPROVAL,
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
                PUBLISHED: ApiReferenceRegisterState.PUBLISHED,
                APPROVAL_IN_PROGRESS: ApiReferenceRegisterState.APPROVAL_IN_PROGRESS,
                MPK_IN_PROGRESS: ApiReferenceRegisterState.MPK_IN_PROGRESS,
                REJECTED: ApiReferenceRegisterState.REJECTED,
            },
        },
        IN_CONSTRUCTION: {
            on: {
                READY_TO_APPROVAL: ApiReferenceRegisterState.READY_TO_APPROVAL,
            },
        },
        READY_TO_APPROVAL: {
            on: {
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
                APPROVAL_IN_PROGRESS: ApiReferenceRegisterState.APPROVAL_IN_PROGRESS,
                MPK_IN_PROGRESS: ApiReferenceRegisterState.MPK_IN_PROGRESS,
                REJECTED: ApiReferenceRegisterState.REJECTED,
            },
        },
        APPROVAL_IN_PROGRESS: {
            on: {
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
                MPK_IN_PROGRESS: ApiReferenceRegisterState.MPK_IN_PROGRESS,
                PUBLISHED: ApiReferenceRegisterState.PUBLISHED,
                REJECTED: ApiReferenceRegisterState.REJECTED,
            },
        },
        MPK_IN_PROGRESS: {
            on: {
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
                PUBLISHED: ApiReferenceRegisterState.PUBLISHED,
            },
        },
        REJECTED: {
            on: {
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
            },
        },
        PUBLISHED: {
            on: {
                IN_CONSTRUCTION: ApiReferenceRegisterState.IN_CONSTRUCTION,
                REJECTED: ApiReferenceRegisterState.REJECTED,
            },
        },
    },
})
