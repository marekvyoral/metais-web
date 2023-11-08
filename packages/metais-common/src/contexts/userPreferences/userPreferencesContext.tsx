import React, { createContext, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { META_PREFERENCES_KEY } from '@isdd/metais-common/constants'

export enum UserPreferencesFormNamesEnum {
    SHOW_INVALIDATED = 'showInvalidatedItems',
    DEFAULT_PER_PAGE = 'defaultPerPage',
    DEFAULT_LANG = 'defaultLanguage',
    MY_PO = 'myPO',
}

export interface IUserPreferences {
    [UserPreferencesFormNamesEnum.SHOW_INVALIDATED]: boolean
    [UserPreferencesFormNamesEnum.DEFAULT_PER_PAGE]: string
    [UserPreferencesFormNamesEnum.DEFAULT_LANG]: string
    [UserPreferencesFormNamesEnum.MY_PO]: string
}

export enum UpdatePreferencesReturnEnum {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

interface UserPreferencesContextValue {
    currentPreferences: IUserPreferences
    updateUserPreferences: (preferencesData: IUserPreferences) => UpdatePreferencesReturnEnum
}

const DEFAULT_PREFERENCES: IUserPreferences = {
    [UserPreferencesFormNamesEnum.SHOW_INVALIDATED]: false,
    [UserPreferencesFormNamesEnum.DEFAULT_PER_PAGE]: '',
    [UserPreferencesFormNamesEnum.DEFAULT_LANG]: '',
    [UserPreferencesFormNamesEnum.MY_PO]: '',
}

const UserPreferences = createContext<UserPreferencesContextValue>({
    currentPreferences: DEFAULT_PREFERENCES,
    updateUserPreferences: () => UpdatePreferencesReturnEnum.SUCCESS,
})

const UserPreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { i18n } = useTranslation()
    const { userInfo: user } = useAuth()

    const storedPreferences = localStorage.getItem(META_PREFERENCES_KEY + user?.login)
    const currentPreferences: IUserPreferences = storedPreferences ? JSON.parse(storedPreferences) : {}

    useEffect(() => {
        if (currentPreferences.defaultLanguage) {
            i18n.changeLanguage(currentPreferences.defaultLanguage)
        }
    }, [currentPreferences.defaultLanguage, i18n])

    const updateUserPreferences = (preferencesData: IUserPreferences) => {
        try {
            localStorage.setItem(META_PREFERENCES_KEY + user?.login, JSON.stringify(preferencesData))
            return UpdatePreferencesReturnEnum.SUCCESS
        } catch {
            return UpdatePreferencesReturnEnum.ERROR
        }
    }

    return <UserPreferences.Provider value={{ currentPreferences, updateUserPreferences }}>{children}</UserPreferences.Provider>
}

const useUserPreferences = () => useContext(UserPreferences)

export { useUserPreferences, UserPreferencesProvider }
