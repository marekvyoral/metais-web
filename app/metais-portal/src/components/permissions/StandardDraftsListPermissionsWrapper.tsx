import { ApiLink, ApiStandardRequestPreviewRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useStandardDraftsListPermissions } from '@isdd/metais-common/hooks/permissions/useStandardDraftsListPermissions'
import { StandardDraftsDraftStates } from '@isdd/metais-common/types/api'

interface iPermissionWrapper {
    children: JSX.Element
    groupId: string
    state: StandardDraftsDraftStates
    links: ApiLink[]
    requestChannel: ApiStandardRequestPreviewRequestChannel | undefined
}

export const StandardDraftsListPermissionsWrapper = ({ children, groupId, state, links, requestChannel }: iPermissionWrapper) => {
    const ability = useAbilityContext()
    useStandardDraftsListPermissions({ data: { state, groupId, links, requestChannel } })
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
