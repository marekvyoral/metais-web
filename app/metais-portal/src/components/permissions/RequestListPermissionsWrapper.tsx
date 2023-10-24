import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useRequestPermissions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'

interface iRequestWrapper {
    entityName: string
    children: JSX.Element
}

export const RequestListPermissionsWrapper = ({ children, entityName }: iRequestWrapper) => {
    const ability = useAbilityContext()
    useRequestPermissions(entityName)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
