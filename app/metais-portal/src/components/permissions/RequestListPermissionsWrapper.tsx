import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useRequestPermissions } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'

interface iRequestWrapper {
    id?: string
    children: JSX.Element
}

export const RequestListPermissionsWrapper = ({ id, children }: iRequestWrapper) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useRequestPermissions(id)
    return <AbilityContextWithFeedback.Provider value={{ ability, isError, isLoading }}>{children}</AbilityContextWithFeedback.Provider>
}
