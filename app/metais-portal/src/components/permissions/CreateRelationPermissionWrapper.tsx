import React, { PropsWithChildren } from 'react'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useCanCreateRelationTypeUnderOrgAndRole } from '@isdd/metais-common/hooks/permissions/useCanCreateRelationTypeUnderOrgAndRole'

interface Props extends PropsWithChildren {
    selectedRoleName: string
    rolesToCompareWith: string[]
}

export const RelationTypePermissionWrapper: React.FC<Props> = ({ children, selectedRoleName, rolesToCompareWith }) => {
    const ability = useAbilityContext()
    useCanCreateRelationTypeUnderOrgAndRole(selectedRoleName, rolesToCompareWith)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
