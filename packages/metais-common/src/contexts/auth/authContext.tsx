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
    userInfo: User | null
    userContext: IAuthContext
}

const initialState: ICustomAuthContext = {
    userInfo: null,
    userContext: {
        login: () => null,
        logOut: () => null,
        token: '',
        error: null,
        loginInProgress: false,
    },
}

export enum CustomAuthActions {
    SET_USER_INFO,
    SET_USER_CONTEXT,
    LOGOUT_USER,
}

interface SetUserInfo {
    type: CustomAuthActions.SET_USER_INFO
    value: User
}

interface SetUserToken {
    type: CustomAuthActions.SET_USER_CONTEXT
    value: IAuthContext
}

interface LogoutUser {
    type: CustomAuthActions.LOGOUT_USER
    value: IAuthContext
}
type Action = SetUserInfo | SetUserToken | LogoutUser

const reducer = (state: ICustomAuthContext, action: Action) => {
    switch (action.type) {
        case CustomAuthActions.SET_USER_INFO:
            return { ...state, userInfo: action.value }
        case CustomAuthActions.SET_USER_CONTEXT:
            return { ...state, userContext: action.value }
        case CustomAuthActions.LOGOUT_USER:
            return { userContext: action.value, userInfo: null }
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
    const [state, dispatch] = useReducer<Reducer<ICustomAuthContext, Action>>(reducer, { userInfo: null, userContext: authContext })

    useEffect(() => {
        if (authContext.token) {
            dispatch({ type: CustomAuthActions.SET_USER_CONTEXT, value: authContext })
        } else if (state.userContext.token || state.userInfo) {
            dispatch({ type: CustomAuthActions.LOGOUT_USER, value: authContext })
        }
    }, [authContext, state.userContext.token, state.userInfo])

    return <CustomAuthContext.Provider value={{ state, dispatch }}>{props.children}</CustomAuthContext.Provider>
}

const useAuth = () => useContext(CustomAuthContext)

export { useAuth, AuthContextProvider }
