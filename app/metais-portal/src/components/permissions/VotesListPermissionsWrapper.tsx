import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useVotesListPermissions } from '@isdd/metais-common/hooks/permissions/useVotesListPermissions'

interface IVotesListPermissionsWrapper {
    children: JSX.Element
}

export const VotesListPermissionsWrapper = ({ children }: IVotesListPermissionsWrapper) => {
    const ability = useAbilityContext()
    useVotesListPermissions()
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
