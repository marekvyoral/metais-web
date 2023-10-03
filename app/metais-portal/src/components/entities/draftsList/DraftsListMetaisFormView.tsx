import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { ATTRIBUTE_NAME, Attribute, API_STANDARD_REQUEST_ATTRIBUTES } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getInfoGuiProfilStandardRequest, getLabelGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'

import { customAttributesForVersion2, srDescriptionAttributes } from '@/componentHelpers'

interface Props {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
    workGroup?: Group
}
const DraftsListFormView: React.FC<Props> = ({ data, guiAttributes, workGroup }) => {
    const { t } = useTranslation()

    const linkElements = data?.links?.map((link) => (
        <Link key={link.id} to={link?.url ?? ''} state={{ from: location }} target="_blank" className="govuk-link">
            {link?.name as string}
            <br />
        </Link>
    ))
    // todo upresnit tieto downloady
    // const attachmentElements = data?.attachments?.map((attachment) => (
    //     <Link key={attachment.id} to={attachment?.id} state={{ from: location }} target="_blank" className="govuk-link">
    //         {link?.name as string}
    //         <br />
    //     </Link>
    // )) //todo
    // [<> {t('DraftsList.detail.noDocuments')}</>]
    const relatedDocuments = linkElements && linkElements?.length > 0 ? <>{...linkElements}</> : <> {t('DraftsList.detail.noDocuments')}</>
    const isVersion2 = data?.version === 2
    const showWorkGroup = data?.standardRequestState === 'ASSIGNED'
    return (
        <div>
            <InformationGridRow
                key={ATTRIBUTE_NAME.standardRequestState}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
                value={t(`DraftsList.filter.state.${data?.standardRequestState}`)}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.requestChannel}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
                value={t(`DraftsList.filter.draftType.${data?.requestChannel}`)}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.createdAt}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
                value={data?.createdAt ? t('date', { date: data?.createdAt }) : null}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
            />
            {showWorkGroup && (
                <InformationGridRow label={t('DraftsList.detail.assignedToGroup')} value={`${workGroup?.shortName} - ${workGroup?.name}`} hideIcon />
            )}
            <InformationGridRow
                key={ATTRIBUTE_NAME.email}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.email, guiAttributes) ?? ''}
                value={data?.email}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.email, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.name}
                label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
                value={data?.name}
                tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
            />
            {!isVersion2 && (
                <>
                    <InformationGridRow
                        key={ATTRIBUTE_NAME.Sr_Name}
                        label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                        value={data?.srName}
                        tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                    />

                    <InformationGridRow
                        key={ATTRIBUTE_NAME.srDescription1} //todo, what about the other srDescriptions
                        label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                        value={<span key={ATTRIBUTE_NAME.srDescription1} dangerouslySetInnerHTML={{ __html: data?.srDescription1 ?? '' }} />}
                        tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                    />
                    <InformationGridRow
                        key={ATTRIBUTE_NAME.relatedDocuments}
                        label={getLabelGuiProfilStandardRequest(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
                        value={relatedDocuments}
                        tooltip={getInfoGuiProfilStandardRequest(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
                    />
                    {srDescriptionAttributes.map((attribute) => {
                        if (data?.[attribute])
                            return (
                                <InformationGridRow
                                    key={attribute}
                                    value={<span dangerouslySetInnerHTML={{ __html: data?.[attribute] ?? '' }} />}
                                    label={getLabelGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                                    hideIcon
                                />
                            )
                    })}
                </>
            )}
            {isVersion2 &&
                customAttributesForVersion2.map((attribute) => {
                    if (data?.[attribute] && data?.[attribute] != '-') {
                        if (attribute === API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription1)
                            return (
                                <InformationGridRow
                                    key={attribute}
                                    value={<span dangerouslySetInnerHTML={{ __html: data?.[attribute] ?? '' }} />}
                                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, guiAttributes) ?? ''}
                                    hideIcon
                                />
                            )
                        else if (attribute === API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2)
                            return (
                                <InformationGridRow
                                    key={attribute}
                                    value={<span dangerouslySetInnerHTML={{ __html: data?.[attribute] ?? '' }} />}
                                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription2, guiAttributes) ?? ''}
                                    hideIcon
                                />
                            )
                        return (
                            <InformationGridRow
                                key={attribute}
                                value={<span dangerouslySetInnerHTML={{ __html: data?.[attribute] ?? '' }} />}
                                label={getInfoGuiProfilStandardRequest(attribute, guiAttributes) ?? ''}
                                hideIcon
                            />
                        )
                    }
                })}
        </div>
    )
}
export default DraftsListFormView
