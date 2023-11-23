import React from 'react'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'

import { CreateEntity, CreateEntityData } from '@/components/create-entity/CreateEntity'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'

interface Props {
    entityName: string
    ownerId: string
    roleState: RoleState
    publicAuthorityState: PublicAuthorityState
    data: CreateEntityData
    isLoading: boolean
    isError: boolean
}

export const CreateCiEntityView: React.FC<Props> = ({ data, entityName, ownerId, roleState, publicAuthorityState, isLoading, isError }) => {
    const { attributesData, generatedEntityId } = data
    const { t } = useTranslation()

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('ciType.createEntity', { entityName: data.attributesData.ciTypeData?.name })}</TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />}
            </FlexColumnReverseWrapper>
            <CreateEntity
                data={{ attributesData, generatedEntityId, ownerId }}
                roleState={roleState}
                publicAuthorityState={publicAuthorityState}
                entityName={entityName}
            />
        </QueryFeedback>
    )
}
