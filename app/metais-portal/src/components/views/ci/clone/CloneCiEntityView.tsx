import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SubHeading } from '@isdd/metais-common/src/components/sub-heading/SubHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CloneEntity } from '@/components/clone-entity/CloneEntity'
import { ICiCloneContainerView } from '@/components/containers/CiCloneContainer'

export const CloneCiEntityView: React.FC<ICiCloneContainerView> = ({
    ciTypeData,
    ciItemData,
    constraintsData,
    relationData,
    unitsData,
    entityName,
    entityId,
    roleState,
    publicAuthorityState,
    selectedRelationTypeState,
    isError,
    isLoading,
    newCiCode,
}) => {
    const { t, i18n } = useTranslation()
    const ciItemAttributes = ciItemData?.attributes

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.cloneEntity', { entityName: entityName })}</TextHeading>
                <QueryFeedback loading={false} error={isError} />
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />
            <CloneEntity
                cloneCiItemId={ciItemData?.uuid}
                data={{
                    attributesData: { ciTypeData, constraintsData, unitsData },
                    generatedEntityId: newCiCode,
                    relationData,
                    ciItemData: ciItemData,
                }}
                entityName={entityName}
                roleState={roleState}
                selectedRelationTypeState={selectedRelationTypeState}
                publicAuthorityState={publicAuthorityState}
                defaultItemAttributeValues={ciItemAttributes}
            />
        </QueryFeedback>
    )
}
