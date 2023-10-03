import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit'
import { QueryFeedback } from '@isdd/metais-common'

import DraftsListCreateForm from '../../../../components/entities/draftsList/DraftsListCreateForm'
import { DraftsListFormContainer } from '../../../../components/entities/draftsList/DraftsListFormContainer'

import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListEditPage = () => {
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
                                <DraftsListCreateForm
                                    data={{
                                        defaultData: props?.data,
                                        guiAttributes: props?.guiAttributes ?? [],
                                    }}
                                    isSuccess={false}
                                    isError={false}
                                    onSubmit={async (data) => {
                                        console.log('CREATE: ', data)
                                    }}
                                />
                            </QueryFeedback>
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}
export default DraftsListEditPage
