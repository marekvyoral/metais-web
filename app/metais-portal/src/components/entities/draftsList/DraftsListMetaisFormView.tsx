import React from 'react'
import { InformationGridRow } from '@isdd/metais-common/src/components/info-grid-row/InformationGridRow'
import { ApiStandardRequest, ApiStandardRequestPreviewRequestChannel } from '@isdd/metais-common/api/generated/standards-swagger'
import { ATTRIBUTE_NAME, Attribute } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Props {
    data?: ApiStandardRequest
    guiAttributes?: Attribute[]
}
const DraftsListFormView: React.FC<Props> = ({ data, guiAttributes }) => {
    const { t } = useTranslation()

    const linkElements = data?.links?.map((link) => (
        <Link key={link.id} to={link?.url ?? ''} state={{ from: location }} target="_blank" className="govuk-link">
            {link?.name as string}
            <br />
        </Link>
    ))
    const isGeneralType = data?.requestChannel === ApiStandardRequestPreviewRequestChannel.WEB
    // const attachmentElements = data?.attachments?.map((attachment) => (
    //     <Link key={attachment.id} to={attachment?.id} state={{ from: location }} target="_blank" className="govuk-link">
    //         {link?.name as string}
    //         <br />
    //     </Link>
    // )) //todo
    // [<> {t('DraftsList.detail.noDocuments')}</>] //todo upresnit tieto downloady
    const relatedDocuments = linkElements && linkElements?.length > 0 ? <>{...linkElements}</> : <> {t('DraftsList.detail.noDocuments')}</>
    return (
        <div>
            <InformationGridRow
                key={ATTRIBUTE_NAME.standardRequestState}
                label={getLabel(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
                value={t(`DraftsList.filter.state.${data?.standardRequestState}`)}
                tooltip={getInfo(ATTRIBUTE_NAME.standardRequestState, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.requestChannel}
                label={getLabel(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
                value={t(`DraftsList.filter.draftType.${data?.requestChannel}`)}
                tooltip={getInfo(ATTRIBUTE_NAME.requestChannel, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.createdAt}
                label={getLabel(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
                value={data?.createdAt ? t('date', { date: data?.createdAt }) : null}
                tooltip={getInfo(ATTRIBUTE_NAME.createdAt, guiAttributes) ?? ''}
            />
            <InformationGridRow
                key={ATTRIBUTE_NAME.name}
                label={getLabel(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
                value={data?.name}
                tooltip={getInfo(ATTRIBUTE_NAME.name, guiAttributes) ?? ''}
            />
            {!isGeneralType && (
                <>
                    <InformationGridRow
                        key={ATTRIBUTE_NAME.Sr_Name}
                        label={getLabel(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                        value={data?.srName}
                        tooltip={getInfo(ATTRIBUTE_NAME.Sr_Name, guiAttributes) ?? ''}
                    />

                    <InformationGridRow
                        key={ATTRIBUTE_NAME.srDescription1} //todo, what about the other srDescriptions
                        label={getLabel(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                        value={<span key={ATTRIBUTE_NAME.srDescription1} dangerouslySetInnerHTML={{ __html: data?.srDescription1 ?? '' }} />}
                        tooltip={getInfo(ATTRIBUTE_NAME.srDescription1, guiAttributes) ?? ''}
                    />
                    <InformationGridRow
                        key={ATTRIBUTE_NAME.relatedDocuments}
                        label={getLabel(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
                        value={relatedDocuments}
                        tooltip={getInfo(ATTRIBUTE_NAME.relatedDocuments, guiAttributes) ?? ''}
                    />
                </>
            )}
        </div>
    )
}
export default DraftsListFormView

export const getLabel = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.name
}

export const getInfo = (attributeName: string, attributes?: Attribute[]) => {
    return attributes?.find((val) => val?.technicalName === attributeName)?.description
}
