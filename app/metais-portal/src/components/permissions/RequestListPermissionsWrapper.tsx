import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useRequestPermissions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'

interface iRequestWrapper {
    id?: string
    children: JSX.Element
}

export const RequestListPermissionsWrapper = ({ id, children }: iRequestWrapper) => {
    const ability = useAbilityContext()
    useRequestPermissions(id)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
