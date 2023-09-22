import React, { createContext, useContext } from 'react'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { META_PREFERENCES_KEY } from '@isdd/metais-common/constants'

export interface IUserPreferences {
    showInvalidatedItems: boolean
}

export enum UpdatePreferencesReturnEnum {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

interface UserPreferencesContextValue {
    currentPreferences: IUserPreferences
    updateUserPreferences: (preferencesData: IUserPreferences) => UpdatePreferencesReturnEnum
}

const DEFAULT_PREFERENCES: IUserPreferences = { showInvalidatedItems: false }

const UserPreferences = createContext<UserPreferencesContextValue>({
    currentPreferences: DEFAULT_PREFERENCES,
    updateUserPreferences: () => UpdatePreferencesReturnEnum.SUCCESS,
})

const UserPreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const {
        state: { user },
    } = useAuth()
    if (user?.login) {
        const storedPreferences = localStorage.getItem(META_PREFERENCES_KEY + user.login)
        const currentPreferences: IUserPreferences = storedPreferences ? JSON.parse(storedPreferences) : {}

        const updateUserPreferences = (preferencesData: IUserPreferences) => {
            try {
                localStorage.setItem(META_PREFERENCES_KEY + user.login, JSON.stringify(preferencesData))
                return UpdatePreferencesReturnEnum.SUCCESS
            } catch {
                return UpdatePreferencesReturnEnum.ERROR
            }
        }
        return <UserPreferences.Provider value={{ currentPreferences, updateUserPreferences }}>{children}</UserPreferences.Provider>
    }

    return <>{children}</>
}

const useUserPreferences = () => useContext(UserPreferences)

export { useUserPreferences, UserPreferencesProvider }
