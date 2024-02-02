import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useEditCiPermissions } from '@isdd/metais-common/hooks/permissions/useEditCiPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const CiPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useEditCiPermissions(entityName, entityId)
    return <AbilityContextWithFeedback.Provider value={{ ability, isLoading, isError }}>{children}</AbilityContextWithFeedback.Provider>
}
