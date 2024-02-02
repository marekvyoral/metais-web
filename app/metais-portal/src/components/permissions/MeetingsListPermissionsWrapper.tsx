import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useMeetingsListPermissions } from '@isdd/metais-common/hooks/permissions/useMeetingsListPermissions'

interface IMeetingsListPermissionsWrapper {
    children: JSX.Element
}

export const MeetingsListPermissionsWrapper = ({ children }: IMeetingsListPermissionsWrapper) => {
    const ability = useAbilityContext()
    useMeetingsListPermissions()
    return <AbilityContextWithFeedback.Provider value={{ ability }}>{children}</AbilityContextWithFeedback.Provider>
}
