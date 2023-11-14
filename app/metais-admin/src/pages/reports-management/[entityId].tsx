import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useParams } from 'react-router-dom'

import { ReportsDetailContainer } from '@/components/containers/Egov/Reports-management/ReportsDetailContainer'
import { ReportsDetail } from '@/components/views/egov/reports/ReportsDetail'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const ReportsDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    return (
        <ReportsDetailContainer
            View={(props) => {
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                                { label: t('breadcrumbs.reports-management'), href: AdminRouteNames.REPORTS_MANAGEMENT },
                                {
                                    label: `${props.data?.name} - ${t('breadcrumbs.reportsEdit')}` ?? t('breadcrumbs.noName'),
                                    href: `${AdminRouteNames.REPORTS_MANAGEMENT}/${entityId}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <TextHeading size="L">{t('breadcrumbs.reportsEdit')}</TextHeading>

                            <ReportsDetail
                                data={props.data}
                                categories={props.dataCategories}
                                runReport={props.runReport}
                                saveReport={props.saveReport}
                                saveIsLoading={props.saveIsLoading}
                                mutationIsLoading={props.mutationIsLoading}
                                runMutationIsSuccess={props.runMutationIsSuccess}
                                mutationError={props.mutationError}
                            />
                        </MainContentWrapper>
                    </>
                )
            }}
        />
    )
}

export default ReportsDetailPage
