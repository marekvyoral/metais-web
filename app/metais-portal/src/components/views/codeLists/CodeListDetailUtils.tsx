import { RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistItemValidity } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

interface CodeListItemWithLanguageAndDate {
    language?: string
    value?: string | boolean
    effectiveFrom?: string
    effectiveTo?: string
}

const MIN_DATE = new Date(-8640000000000000)
const MAX_DATE = new Date(8640000000000000)

export const isEffective = (dates: ApiCodelistItemValidity[]): boolean => {
    return dates.some((date) => {
        const today = new Date()
        const minDate = date.effectiveFrom ? new Date(date.effectiveFrom) : new Date(MIN_DATE)
        const maxDate = date.effectiveTo ? new Date(date.effectiveTo) : new Date(MAX_DATE)

        if (today >= minDate && today < maxDate) {
            const minDateValue = date.effectiveFromValue ? new Date(date.effectiveFromValue) : new Date(MIN_DATE)
            const maxDateValue = date.effectiveToValue ? new Date(date.effectiveToValue) : new Date(MAX_DATE)
            if (today >= minDateValue && today < maxDateValue) {
                return true
            }
        }
    })
}

export const filterBasedOnLanguage = (language: string, languageData?: CodeListItemWithLanguageAndDate[]) => {
    return languageData?.filter((item) => item.language === language) || []
}

const createFromDate = (item: CodeListItemWithLanguageAndDate) => {
    return item.effectiveFrom ? new Date(item.effectiveFrom) : new Date(MIN_DATE)
}

const createToDate = (item: CodeListItemWithLanguageAndDate) => {
    return item.effectiveTo ? new Date(item.effectiveTo) : new Date(MAX_DATE)
}

export const findClosestDateInterval = (languageData: CodeListItemWithLanguageAndDate[]): CodeListItemWithLanguageAndDate | null => {
    const today = new Date()

    // find with interval in current date
    const foundInCurrentInterval = languageData.find((item) => {
        return today >= createFromDate(item) && today < createToDate(item)
    })

    if (foundInCurrentInterval !== undefined) {
        return foundInCurrentInterval
    }

    // find from today to future
    languageData = languageData.sort((a, b) => Number(createToDate(b)) - Number(createFromDate(a)))
    const foundClosestInFuture = languageData.find((item) => today < createFromDate(item))
    if (foundClosestInFuture !== undefined) {
        return foundClosestInFuture
    }

    // find from today to history
    languageData = languageData.sort((a, b) => Number(createFromDate(a)) - Number(createFromDate(b)))
    const foundClosestInHistory = languageData.find((item) => today > createFromDate(item))
    if (foundClosestInHistory !== undefined) {
        return foundClosestInHistory
    }

    return null
}

export const selectBasedOnLanguageAndDate = (
    languageData?: CodeListItemWithLanguageAndDate[],
    language?: string,
    returnDefaultLanguageOnNotFound = true,
): string | boolean | null => {
    if (!languageData || !languageData.length || !language) return null

    let temp = languageData
    temp = filterBasedOnLanguage(language, temp)

    if (temp.some((item) => 'effectiveFrom' in item && 'effectiveTo' in item)) {
        return findClosestDateInterval(temp)?.value ?? null
    }

    if (returnDefaultLanguageOnNotFound) {
        temp?.find(() => true)?.value ?? null
    }

    return null
}

const findProfileAttribute = (profile: AttributeProfile, technicalName: string): Attribute | undefined => {
    return profile?.attributes?.find((attribute) => attribute.technicalName === technicalName)
}

export const getDescription = (profile: AttributeProfile, technicalName: string, language: string) => {
    return findProfileAttribute(profile, technicalName)?.[language === 'en' ? 'engName' : 'name'] ?? ''
}

export const getName = (profile: AttributeProfile, technicalName: string, language: string) => {
    return findProfileAttribute(profile, technicalName)?.[language === 'en' ? 'engDescription' : 'description'] ?? ''
}

export const getGestorName = (gestors?: RoleParticipantUI[], gid?: string): string => {
    return gestors?.find((gestor) => gestor?.gid === gid)?.configurationItemUi?.attributes?.['Gen_Profil_nazov'] ?? ''
}