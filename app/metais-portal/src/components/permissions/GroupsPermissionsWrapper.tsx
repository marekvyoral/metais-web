import { AbilityContextWithFeedback, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useGroupsPermissions } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'
interface IGroupsPermissionWrapper {
    children: JSX.Element
    groupId?: string
}

export const GroupsPermissionsWrapper = ({ children, groupId }: IGroupsPermissionWrapper) => {
    const ability = useAbilityContext()
    const { isLoading, isError } = useGroupsPermissions(groupId)
    return <AbilityContextWithFeedback.Provider value={{ ability, isError, isLoading }}>{children}</AbilityContextWithFeedback.Provider>
}
