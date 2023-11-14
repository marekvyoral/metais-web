import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { ReportsDetailContainer } from '@/components/containers/Egov/Reports-management/ReportsDetailContainer'
import { ReportsDetail } from '@/components/views/egov/reports/ReportsDetail'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const ReportsDetailPage: React.FC = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.reports-management'), href: `${AdminRouteNames.REPORTS_MANAGEMENT}` },
                    {
                        label: t('breadcrumbs.reportsCreate'),
                        href: `${AdminRouteNames.REPORTS_MANAGEMENT}/create`,
                    },
                ]}
            />
            <MainContentWrapper>
                <ReportsDetailContainer
                    View={(props) => {
                        return (
                            <>
                                <TextHeading size="L">{t('breadcrumbs.reportsCreate')}</TextHeading>

                                <ReportsDetail
                                    categories={props.dataCategories}
                                    saveReport={props.saveReport}
                                    runReport={props.runReport}
                                    saveIsLoading={props.saveIsLoading}
                                    mutationIsLoading={props.mutationIsLoading}
                                    runMutationIsSuccess={props.runMutationIsSuccess}
                                    mutationError={props.mutationError}
                                />
                            </>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default ReportsDetailPage
