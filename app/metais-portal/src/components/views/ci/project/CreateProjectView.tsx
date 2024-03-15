import React from 'react'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'

import { CreateProjectEntity } from './CreateProjectEntity'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'
import { filterProjectSchemaForCreateBasedOnProjectStatus } from '@/componentHelpers/ci/projectHelpers'

interface Props {
    entityName: string
    ownerId: string
    roleState: RoleState
    publicAuthorityState: PublicAuthorityState
    data: CreateEntityData
    isLoading: boolean
    isError: boolean
}

export const CreateProjectView: React.FC<Props> = ({ data, entityName, ownerId, roleState, publicAuthorityState, isLoading, isError }) => {
    const { attributesData, generatedEntityId } = data
    const { t } = useTranslation()

    const { ciTypeData: projectSchema, ...rest } = attributesData

    const filteredProjectSchema = filterProjectSchemaForCreateBasedOnProjectStatus(projectSchema)

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.createEntity', { entityName: data.attributesData.ciTypeData?.name })}</TextHeading>
                <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
            </FlexColumnReverseWrapper>
            <CreateProjectEntity
                data={{ attributesData: { ...rest, ciTypeData: filteredProjectSchema }, generatedEntityId, ownerId }}
                roleState={roleState}
                publicAuthorityState={publicAuthorityState}
                entityName={entityName}
            />
        </QueryFeedback>
    )
}
