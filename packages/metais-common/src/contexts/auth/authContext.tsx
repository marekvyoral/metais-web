import React, { useReducer, useContext, Reducer, createContext, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export enum AuthActions {
    SET_USER_INFO,
    SET_TOKEN,
    LOGOUT,
}

export interface Role {
    gid: string
    roleDescription: string
    roleName: string
    roleUuid: string
    roleWeight: number
}

export interface Group {
    orgId: string
    roles: Role[]
}

export interface User {
    login: string
    displayName: string
    firstName: string
    lastName: string
    state: string
    position: string
    uuid: string
    name: string
    preferred_username: string
    authenticationResource: string
    email: string
    phone: string
    roles: string[]
    groupData: Group[]
}

interface AuthContextState {
    user: User | null
    accessToken: string | null
}

interface SetUserAction {
    type: AuthActions.SET_USER_INFO
    value: User
}

interface SetTokenAction {
    type: AuthActions.SET_TOKEN
    value: string
}

interface EmptyAction {
    type: AuthActions.LOGOUT
}

type Action = SetTokenAction | SetUserAction | EmptyAction

const initialState: AuthContextState = {
    user: null,
    accessToken: localStorage.getItem('token') || null,
}

const reducer = (state: AuthContextState, action: Action) => {
    switch (action.type) {
        case AuthActions.SET_USER_INFO:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.value,
                },
            }
        case AuthActions.SET_TOKEN:
            localStorage.setItem('token', action.value)
            return { ...state, accessToken: action.value }
        case AuthActions.LOGOUT:
            localStorage.removeItem('token')
            return {
                user: null,
                accessToken: null,
            }
        default:
            return state
    }
}

const AuthContext = createContext<{ state: AuthContextState; dispatch: React.Dispatch<Action> }>({ state: initialState, dispatch: () => null })

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
    const locationCurrent = useLocation()

    const [state, dispatch] = useReducer<Reducer<AuthContextState, Action>>(reducer, initialState)
    const navigate = useNavigate()
    const [urlParams] = useSearchParams()
    const accessToken = urlParams.get('access_token')
    useEffect(() => {
        if (accessToken && !state.accessToken) {
            dispatch({ type: AuthActions.SET_TOKEN, value: accessToken })
        }
    }, [accessToken, state.accessToken])

    if (accessToken) navigate(locationCurrent.pathname)
    return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { useAuth, AuthContextProvider }
