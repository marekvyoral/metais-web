import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isEqual } from 'lodash'

import { useAuth } from '../auth/authContext'

import { META_PREFERENCES_KEY, UNAUTHORIZED } from '@isdd/metais-common/constants'

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

export enum WizardTypes {
    SEARCH = 'searchWizard',
    FILTER = 'filterWizard',
    ACTIONS = 'actionsWizard',
    RELATIONS = 'relationsWizard',
}

export interface WizardSettings {
    [WizardTypes.SEARCH]?: boolean
    [WizardTypes.FILTER]?: boolean
    [WizardTypes.ACTIONS]?: boolean
    [WizardTypes.RELATIONS]?: boolean
}

export enum UpdatePreferencesReturnEnum {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

interface UserPreferencesContextValue {
    currentPreferences: IUserPreferences & WizardSettings
    updateUserPreferences: (preferencesData: IUserPreferences & WizardSettings) => UpdatePreferencesReturnEnum
    isLoadingUserPreferences: boolean
}

const DEFAULT_PREFERENCES: IUserPreferences & WizardSettings = {
    [UserPreferencesFormNamesEnum.SHOW_INVALIDATED]: false,
    [UserPreferencesFormNamesEnum.DEFAULT_PER_PAGE]: '',
    [UserPreferencesFormNamesEnum.DEFAULT_LANG]: '',
    [UserPreferencesFormNamesEnum.MY_PO]: '',
    [WizardTypes.SEARCH]: true,
    [WizardTypes.FILTER]: true,
    [WizardTypes.ACTIONS]: true,
    [WizardTypes.RELATIONS]: true,
}

const UserPreferences = createContext<UserPreferencesContextValue>({
    currentPreferences: DEFAULT_PREFERENCES,
    updateUserPreferences: () => UpdatePreferencesReturnEnum.SUCCESS,
    isLoadingUserPreferences: true,
})

const UserPreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { i18n } = useTranslation()
    const {
        state: { user, token },
    } = useAuth()
    const localStorageKey = META_PREFERENCES_KEY + (user?.login ?? UNAUTHORIZED)
    const storedPreferences = localStorage.getItem(localStorageKey)
    const [isPrefsLoading, setIsPrefsLoading] = useState(true)

    const [currentPreferences, setCurrentPreferences] = useState<IUserPreferences & WizardSettings>(DEFAULT_PREFERENCES)

    useEffect(() => {
        if (token && user && isEqual(storedPreferences ? JSON.parse(storedPreferences) : DEFAULT_PREFERENCES, currentPreferences)) {
            setIsPrefsLoading(false)
        }
        if (!token) setIsPrefsLoading(false)
    }, [token, user, currentPreferences, storedPreferences])

    useEffect(() => {
        if (storedPreferences) setCurrentPreferences(JSON.parse(storedPreferences))
    }, [storedPreferences])

    useEffect(() => {
        if (currentPreferences.defaultLanguage) {
            i18n.changeLanguage(currentPreferences.defaultLanguage)
        }
    }, [currentPreferences.defaultLanguage, i18n])

    const updateUserPreferences = (preferencesData: IUserPreferences & WizardSettings) => {
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(preferencesData))
            setCurrentPreferences(preferencesData)
            return UpdatePreferencesReturnEnum.SUCCESS
        } catch {
            return UpdatePreferencesReturnEnum.ERROR
        }
    }

    return (
        <UserPreferences.Provider value={{ currentPreferences, updateUserPreferences, isLoadingUserPreferences: isPrefsLoading }}>
            {children}
        </UserPreferences.Provider>
    )
}

const useUserPreferences = () => useContext(UserPreferences)

export { useUserPreferences, UserPreferencesProvider }
