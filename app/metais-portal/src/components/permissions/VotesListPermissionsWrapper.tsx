import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useVotesListPermissions } from '@isdd/metais-common/hooks/permissions/useVotesListPermissions'

interface IVotesListPermissionsWrapper {
    children: JSX.Element
}

export const VotesListPermissionsWrapper = ({ children }: IVotesListPermissionsWrapper) => {
    const ability = useAbilityContext()
    useVotesListPermissions()
    return <AbilityContextWithFeedback.Provider value={{ ability }}>{children}</AbilityContextWithFeedback.Provider>
}
