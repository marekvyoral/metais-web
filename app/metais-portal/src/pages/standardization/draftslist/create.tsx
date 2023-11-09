import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading, TextWarning } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { DraftsListCreateForm } from '@/components/entities/draftslist/DraftsListCreateForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { DraftsListCreateContainer } from '@/components/containers/draftslist/DraftsListCreateContainer'

const DraftsListCreatePage: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('breadcrumbs.draftsList'), href: NavigationSubRoutes.ZOZNAM_NAVRHOV },
                    { label: t('DraftsList.createForm.heading'), href: NavigationSubRoutes.TVORBA_NAVRHU },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('DraftsList.create.heading')}</TextHeading>
                <TextWarning>{t('DraftsList.create.warning')}</TextWarning>
                <DraftsListCreateContainer
                    View={({ onSubmit, guiAttributes, isGuiDataError, isGuiDataLoading, isError, isLoading }) => (
                        <QueryFeedback loading={isGuiDataLoading} error={isGuiDataError}>
                            <DraftsListCreateForm
                                onSubmit={onSubmit}
                                data={{
                                    defaultData: undefined,
                                    guiAttributes: guiAttributes,
                                }}
                                isError={isError}
                                isLoading={isLoading}
                            />
                        </QueryFeedback>
                    )}
                />
            </MainContentWrapper>
        </>
    )
}
export default DraftsListCreatePage
