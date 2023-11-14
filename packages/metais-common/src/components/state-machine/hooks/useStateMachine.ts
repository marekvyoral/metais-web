import { useActor } from '@xstate/react'
import { Interpreter, StateValue } from 'xstate'

export interface IStateMachineMethods {
    changeState: (state: string) => void
    getCurrentState: () => StateValue
    isInitialState: <T>(initialState: T) => boolean
    getAllPosibleTransitions: <T>() => T[]
}

interface IUseStateMachine<V> {
    stateContext: {
        stateMachineService: V
    }
}

export const useStateMachine = <V>({ stateContext }: IUseStateMachine<V>): IStateMachineMethods => {
    const [state] = useActor(stateContext?.stateMachineService as Interpreter<V>)
    const stateMethods = stateContext?.stateMachineService as Interpreter<V>

    const changeState = (incomingState: string) => {
        stateMethods?.send?.({ type: incomingState })
    }

    const getCurrentState = () => {
        return state?.value
    }

    const getAllPosibleTransitions = <T>() => {
        const currentState = stateMethods?.getSnapshot()
        return currentState?.nextEvents as T[]
    }

    const isInitialLoadingState = <T>(initialState: T): boolean => {
        return getCurrentState() == initialState
    }

    return {
        changeState,
        getCurrentState,
        isInitialState: isInitialLoadingState,
        getAllPosibleTransitions,
    }
}
