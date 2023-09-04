import { BreadCrumbs, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateEntity, CreateEntityData } from '@/components/create-entity/CreateEntity'

interface Props {
    entityName: string
    ownerId: string
    roleState: RoleState
    publicAuthorityState: PublicAuthorityState
    data: CreateEntityData
}

export const CreateCiEntityView: React.FC<Props> = ({ data, entityName, ownerId, roleState, publicAuthorityState }) => {
    const { attributesData, generatedEntityId } = data
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: '/' },
                    { label: entityName, href: `/ci/${entityName}` },
                    { label: t('breadcrumbs.ciCreate'), href: `/ci/create` },
                ]}
            />
            <TextHeading size="XL">{t('ciType.createEntity')}</TextHeading>
            <CreateEntity
                data={{ attributesData, generatedEntityId, ownerId }}
                roleState={roleState}
                publicAuthorityState={publicAuthorityState}
                entityName={entityName}
            />
        </>
    )
}
