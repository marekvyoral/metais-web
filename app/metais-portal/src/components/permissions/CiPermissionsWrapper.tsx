import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useEditCiPermissions } from '@isdd/metais-common/hooks/permissions/useEditCiPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const CiPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    useEditCiPermissions(entityName, entityId)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
