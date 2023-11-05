import React from 'react'
import { TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

import { DraftsListCreateForm } from '@/components/entities/draftslist/DraftsListCreateForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListCreateContainer } from '@/components/containers/draftslist/DraftsListCreateContainer'
const DraftsListCreatePage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <MainContentWrapper>
            <TextHeading size="XL">{t('DraftsList.create.heading')}</TextHeading>
            <TextWarning>{t('DraftsList.create.warning')}</TextWarning>
            <DraftsListCreateContainer
                View={({ onSubmit, guiAttributes, isGuiDataError, isGuiDataLoading, isSuccess, isError, isLoading }) => (
                    <QueryFeedback loading={isGuiDataLoading} error={isGuiDataError}>
                        <DraftsListCreateForm
                            onSubmit={onSubmit}
                            data={{
                                defaultData: undefined,
                                guiAttributes: guiAttributes,
                            }}
                            isSuccess={isSuccess}
                            isError={isError}
                            isLoading={isLoading}
                        />
                    </QueryFeedback>
                )}
            />
        </MainContentWrapper>
    )
}
export default DraftsListCreatePage