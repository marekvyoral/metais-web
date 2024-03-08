import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SubHeading } from '@isdd/metais-common/src/components/sub-heading/SubHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { CreateProjectEntity } from '@/components/views/ci/project/CreateProjectEntity'
import { filterProjectSchemaForEditBasedOnProjectStatus } from '@/componentHelpers/ci/projectHelpers'

interface Props {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    ciItemData: ConfigurationItemUi | undefined
    entityName: string
    entityId: string
    isLoading: boolean
    isError: boolean
}

export const EditProjectView: React.FC<Props> = ({
    ciTypeData,
    ciItemData,
    constraintsData,
    unitsData,
    entityName,
    entityId,
    isError,
    isLoading,
}) => {
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

    const filteredProjectSchema = filterProjectSchemaForEditBasedOnProjectStatus(ciTypeData, ciItemData)
    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.editEntity', { entityName: entityName })}</TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} />}
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />
            <CreateProjectEntity
                updateCiItemId={ciItemData?.uuid}
                data={{ attributesData: { ciTypeData: filteredProjectSchema, constraintsData, unitsData }, generatedEntityId: entityIdToUpdate }}
                entityName={entityName}
                defaultItemAttributeValues={ciItemData?.attributes}
            />
        </QueryFeedback>
    )
}
