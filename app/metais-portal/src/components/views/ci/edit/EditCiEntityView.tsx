import { ATTRIBUTE_NAME, CiType, ConfigurationItemUi, EnumType } from '@isdd/metais-common/api'
import React from 'react'
import { BreadCrumbs, TextBody, TextHeading, TextLink } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'

import styles from './editCiEntityView.module.scss'

import { CreateEntity } from '@/components/create-entity/CreateEntity'

interface Props {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    ciItemData: ConfigurationItemUi | undefined
    entityName: string
    entityId: string
}

export const EditCiEntityView: React.FC<Props> = ({ ciTypeData, ciItemData, constraintsData, unitsData, entityName, entityId }) => {
    const { t, i18n } = useTranslation()
    const ciItemAttributes = ciItemData?.attributes

    const entityIdToUpdate = {
        cicode: ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }
    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: '/' },
                    { label: entityName, href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    { label: t('breadcrumbs.ciEdit', { itemName: currentName }), href: `/ci/${entityName}/edit/${entityId}` },
                ]}
            />
            <TextHeading size="XL">{t('ciType.editEntity')}</TextHeading>
            <div className={styles.subHeading}>
                <TextBody>
                    <strong>{t('ciType.chosenObject')} </strong>
                </TextBody>
                <TextBody>
                    <TextLink to={`/ci/${entityName}/${entityId}`}>{currentName ? currentName : t('breadcrumbs.noName')}</TextLink>
                </TextBody>
            </div>
            <CreateEntity
                updateCiItemId={ciItemData?.uuid}
                data={{ attributesData: { ciTypeData, constraintsData, unitsData }, generatedEntityId: entityIdToUpdate }}
                entityName={entityName}
                defaultItemAttributeValues={ciItemAttributes}
            />
        </>
    )
}
