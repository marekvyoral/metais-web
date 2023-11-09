import React, { Reducer, createContext, useContext, useReducer, useEffect } from 'react'
import { IAuthContext, AuthContext } from 'react-oauth2-code-pkce'

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

export interface ICustomAuthContext {
    user: User | null
    token: string | null
}

const initialState: ICustomAuthContext = {
    user: null,
    token: null,
}

export enum CustomAuthActions {
    SET_USER_INFO,
    SET_USER_TOKEN,
    LOGOUT_USER,
}

interface SetUserInfo {
    type: CustomAuthActions.SET_USER_INFO
    value: User
}

interface SetUserToken {
    type: CustomAuthActions.SET_USER_TOKEN
    token: string
}

interface LogoutUser {
    type: CustomAuthActions.LOGOUT_USER
}

type Action = SetUserInfo | SetUserToken | LogoutUser

const reducer = (state: ICustomAuthContext, action: Action) => {
    switch (action.type) {
        case CustomAuthActions.SET_USER_INFO:
            return { ...state, user: action.value }
        case CustomAuthActions.SET_USER_TOKEN:
            return { ...state, token: action.token }
        case CustomAuthActions.LOGOUT_USER:
            return initialState
        default:
            return state
    }
}

const CustomAuthContext = createContext<{ state: ICustomAuthContext; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
})

const AuthContextProvider: React.FC<React.PropsWithChildren> = (props) => {
    const authContext = useContext<IAuthContext>(AuthContext)
    const [state, dispatch] = useReducer<Reducer<ICustomAuthContext, Action>>(reducer, { ...initialState, token: authContext.token })

    useEffect(() => {
        if (authContext.token) {
            dispatch({ type: CustomAuthActions.SET_USER_TOKEN, token: authContext.token })
        } else if (state.token || state.user) {
            dispatch({ type: CustomAuthActions.LOGOUT_USER })
        }
    }, [authContext, state.token, state.user])

    return <CustomAuthContext.Provider value={{ state, dispatch }}>{props.children}</CustomAuthContext.Provider>
}

const useAuth = () => useContext(CustomAuthContext)

export { useAuth, AuthContextProvider }
