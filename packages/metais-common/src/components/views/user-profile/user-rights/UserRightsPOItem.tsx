import { TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'

import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type Props = {
    poItem: ConfigurationItemUi
}

export const UserRightsPOItem: React.FC<Props> = ({ poItem }) => {
    const {
        state: { userInfo: user },
    } = useAuth()
    return (
        <li>
            <TextHeading size="M">{poItem?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}</TextHeading>
            <ul>
                {user?.groupData
                    .find((po) => po.orgId === poItem.uuid)
                    ?.roles.map((role) => (
                        <li key={role.roleUuid}>
                            <TextBody> {role.roleDescription}</TextBody>
                        </li>
                    ))}
            </ul>
        </li>
    )
}
