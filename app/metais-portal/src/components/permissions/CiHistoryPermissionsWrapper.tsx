import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useHistoryCiPermissions } from '@isdd/metais-common/hooks/permissions/useHistoryCiPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const CiHistoryPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useHistoryCiPermissions(entityName, entityId)
    return <AbilityContextWithFeedback.Provider value={{ ability, isLoading, isError }}>{children}</AbilityContextWithFeedback.Provider>
}
