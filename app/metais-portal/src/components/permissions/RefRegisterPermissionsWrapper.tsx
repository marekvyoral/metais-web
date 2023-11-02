import { ApiReferenceRegisterState } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useRefRegisterPermissions } from '@isdd/metais-common/hooks/permissions/useRefRegisterPermissions'

interface iPermissionWrapper {
    state: ApiReferenceRegisterState | undefined
    children: JSX.Element
}

export const RefRegisterPermissionsWrapper = ({ children, state }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    useRefRegisterPermissions(state)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
