import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'

import { DraftsListFormContainer } from '../../../../components/entities/draftsList/DraftsListFormContainer'
import DraftsListFormView from '../../../../components/entities/draftsList/DraftsListMetaisFormView'

import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftDetail: React.FC = () => {
    const { t } = useTranslation()
    return (
        <DraftsListFormContainer
            View={(props) => {
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
                            <TextHeading size="L">{props?.data?.srName}</TextHeading>
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <DraftsListFormView data={props?.data} guiAttributes={props.guiAttributes} />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftDetail
