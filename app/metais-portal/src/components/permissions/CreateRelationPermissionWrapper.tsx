import React, { PropsWithChildren } from 'react'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { RelatedCiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useCanCreateRelationTypeUnderOrgAndRole } from '@isdd/metais-common/hooks/permissions/useCanCreateRelationTypeUnderOrgAndRole'

interface Props extends PropsWithChildren {
    selectedRoleName: string
    selectedCiRelationType: RelatedCiTypePreview | undefined
}

export const RelationTypePermissionWrapper: React.FC<Props> = ({ children, selectedRoleName, selectedCiRelationType }) => {
    const ability = useAbilityContext()
    useCanCreateRelationTypeUnderOrgAndRole(selectedRoleName, selectedCiRelationType)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
