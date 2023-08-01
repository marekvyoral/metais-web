import React, { createContext, Reducer, useContext, useReducer } from 'react'
import { FieldValues } from 'react-hook-form'

interface FilterContextState {
    clearedFilter: {
        [path: string]: boolean
    }
    filter: {
        [path: string]: {
            [key: string]: string | string[]
        }
    }
}
export enum FilterActions {
    SET_FILTER,
    RESET_FILTER,
}

interface SetFilterAction {
    type: FilterActions.SET_FILTER
    value: FieldValues
    path: string
}

interface ResetFilterAction {
    type: FilterActions.RESET_FILTER
    path: string
}

type Action = SetFilterAction | ResetFilterAction

const initialState: FilterContextState = {
    clearedFilter: {},
    filter: {},
}

const reducer = (state: FilterContextState, action: Action) => {
    switch (action.type) {
        case FilterActions.SET_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    [action.path]: {
                        ...action.value,
                    },
                },
            }
        case FilterActions.RESET_FILTER:
            return { ...state, clearedFilter: { ...state.clearedFilter, [action.path]: true } }
        default:
            return state
    }
}

const FilterContext = createContext<{ state: FilterContextState; dispatch: React.Dispatch<Action> }>({ state: initialState, dispatch: () => null })

const FilterContextProvider: React.FC<React.PropsWithChildren> = (props) => {
    const [state, dispatch] = useReducer<Reducer<FilterContextState, Action>>(reducer, initialState)
    return <FilterContext.Provider value={{ state, dispatch }}>{props.children}</FilterContext.Provider>
}

const useFilterContext = () => useContext(FilterContext)

export { useFilterContext, FilterContextProvider }
