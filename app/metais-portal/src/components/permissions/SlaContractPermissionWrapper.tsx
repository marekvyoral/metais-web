import { AbilityContext, ExtendedAbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useSlaContractPermissions } from '@isdd/metais-common/hooks/permissions/useSlaContractPermissions'
import { createContext } from 'react'

interface iPermissionWrapper {
    entityName: string
    entityId: string
    children: JSX.Element
}

export const SlaContractPermissionsWrapper = ({ children, entityName, entityId }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isError, isLoading } = useSlaContractPermissions(entityName, entityId)
    return <ExtendedAbilityContext.Provider value={{ ability, isError, isLoading }}>{children}</ExtendedAbilityContext.Provider>
}
