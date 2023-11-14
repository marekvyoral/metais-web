import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useHistoryCiPermissions } from '@isdd/metais-common/hooks/permissions/useHistoryCiPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const CiHistoryPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    useHistoryCiPermissions(entityName, entityId)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
