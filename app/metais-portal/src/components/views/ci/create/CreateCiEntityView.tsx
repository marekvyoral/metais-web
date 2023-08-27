import React from 'react'
import { BreadCrumbs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { CreateEntity, CreateEntityData } from '@/components/create-entity/CreateEntity'

interface Props {
    entityName: string
    data: CreateEntityData
}

export const CreateCiEntityView: React.FC<Props> = ({ data, entityName }) => {
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
            <CreateEntity data={{ attributesData, generatedEntityId }} entityName={entityName} />
        </>
    )
}
