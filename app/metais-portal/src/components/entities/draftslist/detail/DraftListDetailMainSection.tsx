import React, { useContext } from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { ATTRIBUTE_NAME, API_STANDARD_REQUEST_ATTRIBUTES } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { getInfoGuiProfilStandardRequest, getLabelGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { useStateMachine } from '@isdd/metais-common/components/state-machine/hooks/useStateMachine'
import sanitizeHtml from 'sanitize-html'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { DraftListRelatedDocuments } from '@/components/entities/draftslist/detail/DraftListRelatedDocuments'
import { srDescriptionAttributes } from '@/componentHelpers'
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

    const isVersion1 = requestData?.version === 1
    const showWorkGroup = currentState === 'ASSIGNED'
    const showActionDesription = currentState === 'REJECTED'

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
                value={t(`DraftsList.filter.draftType.${requestData?.requestChannel}`)}
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
                key={ATTRIBUTE_NAME.name}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
                value={requestData?.name}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
            />
            {isVersion1 && (
                <>
                    <InformationGridRow
                        key={ATTRIBUTE_NAME.Sr_Name}
                        label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                        value={requestData?.srName}
                        tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                    />

                    <InformationGridRow
                        key={ATTRIBUTE_NAME.srDescription1}
                        label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                        value={
                            <span
                                key={ATTRIBUTE_NAME.srDescription1}
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(requestData?.srDescription1 ?? '') }}
                            />
                        }
                        tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                    />
                </>
            )}
            <DraftListRelatedDocuments data={data} />

            {isVersion1 && (
                <>
                    {srDescriptionAttributes.map((attribute) => {
                        if (requestData?.[attribute] && requestData?.[attribute] != '-')
                            if (attribute === API_STANDARD_REQUEST_ATTRIBUTES.srDescription2)
                                return (
                                    <InformationGridRow
                                        key={attribute}
                                        value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(requestData?.[attribute] ?? '') }} />}
                                        label={
                                            getLabelGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2, guiAttributes) ??
                                            ''
                                        }
                                        hideIcon
                                    />
                                )
                            else
                                return (
                                    <InformationGridRow
                                        key={attribute}
                                        value={<span dangerouslySetInnerHTML={{ __html: sanitizeHtml(requestData?.[attribute] ?? '') }} />}
                                        label={getLabelGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                                        hideIcon
                                    />
                                )
                    })}
                </>
            )}
            {showActionDesription && (
                <InformationGridRow
                    key={API_STANDARD_REQUEST_ATTRIBUTES.actionDesription}
                    label={getLabelGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.actionDesription, guiAttributes) ?? ''}
                    value={requestData?.actionDesription ?? t('DraftsList.detail.missingRejectReason')}
                    tooltip={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.actionDesription, guiAttributes) ?? ''}
                />
            )}
        </div>
    )
}
