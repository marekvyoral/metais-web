import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { PropsWithChildren } from 'react'
import { useCodeListPermissions } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

interface CodeListPermissionsWrapperProps extends PropsWithChildren {
    id: string
}

export const CodeListPermissionsWrapper: React.FC<CodeListPermissionsWrapperProps> = ({ id, children }) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useCodeListPermissions(id)
    return <AbilityContextWithFeedback.Provider value={{ ability, isError, isLoading }}>{children}</AbilityContextWithFeedback.Provider>
}
