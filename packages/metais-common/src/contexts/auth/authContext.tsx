import jwt from 'jwt-decode'
import React, { Reducer, createContext, useContext, useEffect, useReducer } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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

const ACCESS_TOKEN = 'token'

const initialState: AuthContextState = {
    user: null,
    accessToken: localStorage.getItem(ACCESS_TOKEN) || null,
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
            localStorage.setItem(ACCESS_TOKEN, action.value)
            return { ...state, accessToken: action.value }
        case AuthActions.LOGOUT:
            localStorage.removeItem(ACCESS_TOKEN)
            return {
                user: null,
                accessToken: null,
            }
        default:
            return state
    }
}

const isTokenExpired = (accessToken: string | null) => {
    if (!accessToken) {
        return true
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedJwt: Record<string, any> = jwt(accessToken)
        if (decodedJwt.exp * 1000 < new Date().getTime()) {
            localStorage.removeItem(ACCESS_TOKEN)
            return true
        }
        return false
    } catch {
        //invalid access token
        localStorage.removeItem(ACCESS_TOKEN)
        return true
    }
}

const AuthContext = createContext<{ state: AuthContextState; dispatch: React.Dispatch<Action> }>({ state: initialState, dispatch: () => null })

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
    const locationCurrent = useLocation()

    const authInitialState = { ...initialState, accessToken: isTokenExpired(initialState.accessToken) ? null : initialState.accessToken }
    const [state, dispatch] = useReducer<Reducer<AuthContextState, Action>>(reducer, authInitialState)
    const { hash } = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(hash)
    const accessToken = searchParams.get('#access_token')

    useEffect(() => {
        if (accessToken && isTokenExpired(state.accessToken)) {
            dispatch({ type: AuthActions.SET_TOKEN, value: accessToken })
        }
    }, [accessToken, state.accessToken])

    if (accessToken) navigate(locationCurrent.pathname)
    return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthContextProvider, useAuth }
