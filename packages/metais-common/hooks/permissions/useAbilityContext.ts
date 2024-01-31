import { defineAbility } from '@casl/ability'
import { createContextualCan, useAbility } from '@casl/react'
import { createContext, useContext } from 'react'

const detectSubjectType = (object: object) => {
    return object.constructor.name
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const defaultAbility = defineAbility(() => {}, { detectSubjectType })
export const AbilityContext = createContext(defaultAbility)

export const useAbilityContext = () => useAbility(AbilityContext)
export const Can = createContextualCan(AbilityContext.Consumer)

export const AbilityContextWithFeedback = createContext({
    ability: defaultAbility,
    isError: false,
    isLoading: false,
})
export const useAbilityContextWithFeedback = () => useContext(AbilityContextWithFeedback)
