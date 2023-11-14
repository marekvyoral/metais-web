import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { PropsWithChildren } from 'react'
import { useCodeListPermissions } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'

interface CodeListPermissionsWrapperProps extends PropsWithChildren {
    id: string
}

export const CodeListPermissionsWrapper: React.FC<CodeListPermissionsWrapperProps> = ({ id, children }) => {
    const ability = useAbilityContext()
    useCodeListPermissions(id)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
