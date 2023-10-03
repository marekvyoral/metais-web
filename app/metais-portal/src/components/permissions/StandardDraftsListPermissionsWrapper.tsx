import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useStandardDraftsListPermissions } from '@isdd/metais-common/hooks/permissions/useStandardDraftsListPermissions'

interface iPermissionWrapper {
    children: JSX.Element
}

export const StandardDraftsListPermissionsWrapper = ({ children }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    useStandardDraftsListPermissions()
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
