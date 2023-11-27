import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SubHeading } from '@isdd/metais-common/src/components/sub-heading/SubHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { CloneEntity } from '@/components/clone-entity/CloneEntity'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ICiTypeRelationData, ISelectedRelationTypeState } from '@/components/containers/CiCloneContainer'

interface Props {
    ciTypeData: CiType | undefined
    relationData: ICiTypeRelationData
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    ciItemData: ConfigurationItemUi | undefined
    entityName: string
    entityId: string
    roleState: RoleState
    publicAuthorityState: PublicAuthorityState
    selectedRelationTypeState: ISelectedRelationTypeState
    isLoading: boolean
    isError: boolean
}

export const CloneCiEntityView: React.FC<Props> = ({
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
}) => {
    const { t, i18n } = useTranslation()
    const ciItemAttributes = ciItemData?.attributes

    const entityIdToClone = {
        cicode: ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_kod_metais],
        ciurl: ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_ref_id],
    }
    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemAttributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.cloneEntity', { entityName: entityName })}</TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} />}
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />
            <CloneEntity
                cloneCiItemId={ciItemData?.uuid}
                data={{
                    attributesData: { ciTypeData, constraintsData, unitsData },
                    generatedEntityId: entityIdToClone,
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
