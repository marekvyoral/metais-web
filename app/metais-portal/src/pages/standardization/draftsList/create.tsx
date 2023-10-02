import React from 'react'
import { TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import DraftsListCreateForm from '@/components/entities/draftsList/DraftsListCreateForm'
import DraftsListCreateContainer from '@/components/entities/draftsList/DraftsListCreateContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListCreatePage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <MainContentWrapper>
            <TextHeading size="XL">{t('DraftsList.create.heading')}</TextHeading>
            <TextWarning>{t('DraftsList.create.warning')}</TextWarning>
            <DraftsListCreateContainer
                View={(props) => (
                    <DraftsListCreateForm onSubmit={props?.onSubmit} data={undefined} isSuccess={props?.isSuccess} isError={props?.isError} />
                )}
            />
        </MainContentWrapper>
    )
}
export default DraftsListCreatePage
