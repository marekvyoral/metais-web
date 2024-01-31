import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useSlaContractPermissions } from '@isdd/metais-common/hooks/permissions/useSlaContractPermissions'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const SlaContractPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isError, isLoading } = useSlaContractPermissions(entityName, entityId)
    return <AbilityContextWithFeedback.Provider value={{ ability, isError, isLoading }}>{children}</AbilityContextWithFeedback.Provider>
}
