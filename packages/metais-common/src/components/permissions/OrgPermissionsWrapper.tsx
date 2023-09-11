import React, { PropsWithChildren } from 'react'

import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useOrgPermissions } from '@isdd/metais-common/hooks/permissions/useOrgPermissions'

interface Props extends PropsWithChildren {
    selectedOrganizationId: string
}

export const OrgPermissionsWrapper: React.FC<Props> = ({ children, selectedOrganizationId }) => {
    const ability = useAbilityContext()
    useOrgPermissions(selectedOrganizationId)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
