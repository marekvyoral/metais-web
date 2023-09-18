import React, { PropsWithChildren } from 'react'
import { AbilityContext, useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { RelatedCiTypePreview } from '@isdd/metais-common/api'
import { useCanCreateRelationTypeUnderOrgAndRole } from '@isdd/metais-common/hooks/permissions/useCanCreateRelationTypeUnderOrgAndRole'

interface Props extends PropsWithChildren {
    selectedOrgId: string
    selectedRoleName: string
    selectedCiRelationType: RelatedCiTypePreview | undefined
}

export const RelationTypePermissionWrapper: React.FC<Props> = ({ children, selectedOrgId, selectedRoleName, selectedCiRelationType }) => {
    const ability = useAbilityContext()
    useCanCreateRelationTypeUnderOrgAndRole(selectedOrgId, selectedRoleName, selectedCiRelationType)
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}
