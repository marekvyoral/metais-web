import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useEditIntegrationPermissions } from '@isdd/metais-common/hooks/permissions/useEditIntegrationPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const IntegrationPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useEditIntegrationPermissions(entityName, entityId)

    return <AbilityContextWithFeedback.Provider value={{ ability, isError, isLoading }}>{children}</AbilityContextWithFeedback.Provider>
}
