import React from 'react'
import { TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

import { DraftsListCreateForm } from '@/components/entities/draftsList/DraftsListCreateForm'
import { DraftsListCreateContainer } from '@/components/entities/draftsList/DraftsListCreateContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListCreatePage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <MainContentWrapper>
            <TextHeading size="XL">{t('DraftsList.create.heading')}</TextHeading>
            <TextWarning>{t('DraftsList.create.warning')}</TextWarning>
            <DraftsListCreateContainer
                View={({ onSubmit, guiAttributes, isGuiDataError, isGuiDataLoading, isSuccess, isError }) => (
                    <QueryFeedback loading={isGuiDataLoading} error={isGuiDataError}>
                        <DraftsListCreateForm
                            onSubmit={onSubmit}
                            data={{
                                defaultData: undefined,
                                guiAttributes: guiAttributes,
                            }}
                            isSuccess={isSuccess}
                            isError={isError}
                        />
                    </QueryFeedback>
                )}
            />
        </MainContentWrapper>
    )
}
export default DraftsListCreatePage
