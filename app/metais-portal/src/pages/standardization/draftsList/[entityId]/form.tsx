import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'

import { DraftsListFormContainer } from '../../../../components/entities/draftsList/DraftsListFormContainer'
import DraftsListFormView from '../../../../components/entities/draftsList/DraftsListMetaisFormView'

import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListFormPage: React.FC = () => {
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
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <DraftsListFormView data={props?.data} />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftsListFormPage
