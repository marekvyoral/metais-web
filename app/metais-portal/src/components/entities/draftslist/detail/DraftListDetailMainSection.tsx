import React, { useContext } from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { getInfoGuiProfilStandardRequest, getLabelGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import sanitizeHtml from 'sanitize-html'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { DraftListRelatedDocuments } from '@/components/entities/draftslist/detail/DraftListRelatedDocuments'
import { StandardDraftsStateMachine } from '@/pages/standardization/draftslist/[entityId]/form'

interface Props {
    data: {
        requestData?: ApiStandardRequest
        guiAttributes?: Attribute[]
        workGroup?: Group
    }
}
export const DraftListDetailMainSection: React.FC<Props> = ({ data }) => {
    const { requestData, guiAttributes, workGroup } = data
    const { t } = useTranslation()
    const stateContext = useContext(StandardDraftsStateMachine)
    const stateMachine = useStateMachine({ stateContext })

    const currentState = stateMachine?.getCurrentState()

    const showWorkGroup = currentState === 'ASSIGNED'

    return (
        <div>
            <InformationGridRow
                key={ATTRIBUTE_NAME.standardRequestState}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
                value={t(`DraftsList.filter.state.${currentState}`)}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.requestChannel}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
                value={requestData?.requestChannel ? t(`DraftsList.filter.draftType.${requestData?.requestChannel}`) : ''}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.createdAt}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
                value={requestData?.createdAt ? t('date', { date: requestData?.createdAt }) : null}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
            />
            {showWorkGroup && (
                <InformationGridRow label={t('DraftsList.detail.assignedToGroup')} value={`${workGroup?.shortName} - ${workGroup?.name}`} hideIcon />
            )}
            <InformationGridRow
                key={ATTRIBUTE_NAME.email}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.email, guiAttributes) ?? ''}
                value={requestData?.email}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.email, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.fullName}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.fullName, guiAttributes) ?? ''}
                value={requestData?.fullName}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.fullName, guiAttributes) ?? ''}
            />

            <InformationGridRow
                key={ATTRIBUTE_NAME.description}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.description, guiAttributes) ?? ''}
                value={<span key={ATTRIBUTE_NAME.description} dangerouslySetInnerHTML={{ __html: sanitizeHtml(requestData?.description ?? '') }} />}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.description, guiAttributes) ?? ''}
            />

            <DraftListRelatedDocuments data={data} />
        </div>
    )
}
