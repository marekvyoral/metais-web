import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useGroupsPermissions } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'
interface IGroupsPermissionWrapper {
    children: JSX.Element
    groupId?: string
}

export const GroupsPermissionsWrapper = ({ children, groupId }: IGroupsPermissionWrapper) => {
    const ability = useAbilityContext()
    useGroupsPermissions(groupId)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
