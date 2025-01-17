import React, { useReducer, useContext, Reducer, createContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export enum AuthActions {
    SET_USER_INFO,
    SET_TOKEN,
    LOGOUT,
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
    groupData: string[]
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
    const [state, dispatch] = useReducer<Reducer<AuthContextState, Action>>(reducer, initialState)
    const { hash } = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(hash)
    const accessToken = searchParams.get('#access_token')
    useEffect(() => {
        if (accessToken && !state.accessToken) {
            dispatch({ type: AuthActions.SET_TOKEN, value: accessToken })
        }
    }, [accessToken, state.accessToken])

    if (accessToken) navigate('/')
    return <AuthContext.Provider value={{ state, dispatch }}>{props.children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { useAuth, AuthContextProvider }
