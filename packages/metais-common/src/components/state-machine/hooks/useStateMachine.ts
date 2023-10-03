import { useActor } from '@xstate/react'
import { AnyEventObject, BaseActionObject, Interpreter, ResolveTypegenMeta, ServiceMap, StateValue, TypegenDisabled } from 'xstate'

export interface IStateMachineMethods {
    changeState: (state: string) => void
    useCurrentState: () => StateValue
    isInitialState: <T>(initialState: T) => boolean
    getAllPosibleTransitions: <T>() => T[]
}

interface IUseStateMachine {
    stateContext: {
        stateMachineService: Interpreter<
            unknown,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            any,
            AnyEventObject,
            {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value: any
                context: unknown
            },
            ResolveTypegenMeta<TypegenDisabled, AnyEventObject, BaseActionObject, ServiceMap>
        >
    }
}

export const useStateMachine = ({ stateContext }: IUseStateMachine): IStateMachineMethods => {
    const [state] = useActor(stateContext?.stateMachineService)

    const changeState = (incomingState: string) => {
        const stateMethods = stateContext?.stateMachineService
        stateMethods?.send?.({ type: incomingState })
    }

    const getCurrentState = () => {
        return state?.value
    }

    const getAllPosibleTransitions = <T>() => {
        const currentState = stateContext?.stateMachineService?.getSnapshot()
        return currentState?.nextEvents as T[]
    }

    const isInitialLoadingState = <T>(initialState: T): boolean => {
        return getCurrentState() == initialState
    }

    return {
        changeState: changeState,
        useCurrentState: getCurrentState,
        isInitialState: isInitialLoadingState,
        getAllPosibleTransitions,
    }
}
