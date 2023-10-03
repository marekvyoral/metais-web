import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'
import { useParams } from 'react-router-dom'

import { DraftsListFormContainer } from '../../../../components/entities/draftsList/DraftsListFormContainer'
import DraftsListFormView from '../../../../components/entities/draftsList/DraftsListMetaisFormView'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListIdHeader } from '@/components/entities/draftsList/DraftsListIdHeader'
const DraftDetail: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    return (
        <DraftsListFormContainer
            View={({ data, isLoading, isError, guiAttributes, workGroup }) => {
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('reports.placeHolder') ?? '', href: `placeholder` },
                            ]}
                        />
                        <MainContentWrapper>
                            <DraftsListIdHeader
                                entityId={entityId ?? ''}
                                entityItemName={data?.srName ?? ''}
                                isLoading={isLoading}
                                isError={isError}
                            />
                            {/* <TextHeading size="L">{props?.data?.srName}</TextHeading> */}
                            <QueryFeedback loading={isLoading} error={false} withChildren>
                                <DraftsListFormView data={data} guiAttributes={guiAttributes} workGroup={workGroup} />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftDetail
