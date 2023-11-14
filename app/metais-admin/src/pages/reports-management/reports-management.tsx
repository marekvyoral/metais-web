import { Filter } from '@isdd/idsk-ui-kit/filter'
import { BreadCrumbs, HomeIcon, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { mapCategoriesToOptions } from '@isdd/metais-common/componentHelpers'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { CreateReportButton } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { ReportsListContainer } from '@/components/containers/Egov/Reports-management/ReportsListContainer'
import { ReportsTable } from '@/components/views/egov/reports/ReportsTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface ReportsFilterData extends IFilterParams {
    name?: string
    category?: string
}

const ReportsListPage: React.FC = () => {
    const { t } = useTranslation()
    const defaultFilterValues: ReportsFilterData = { name: '', category: '' }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('breadcrumbs.reports-management'), href: `${AdminRouteNames.REPORTS_MANAGEMENT}` },
                ]}
            />
            <MainContentWrapper>
                <ReportsListContainer
                    defaultFilterValues={defaultFilterValues}
                    View={(props) => {
                        return (
                            <>
                                <Filter<ReportsFilterData>
                                    defaultFilterValues={defaultFilterValues}
                                    form={({ setValue, filter }) => (
                                        <div>
                                            <SimpleSelect
                                                label={t('report.filter.category')}
                                                name={'category'}
                                                id="category"
                                                options={mapCategoriesToOptions(props.categories?.categories)}
                                                setValue={setValue}
                                                defaultValue={filter?.category}
                                            />
                                        </div>
                                    )}
                                />
                                <ActionsOverTable
                                    pagination={props.pagination}
                                    handleFilterChange={props.handleFilterChange}
                                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    entityName={'reports'}
                                    hiddenButtons={{ SELECT_COLUMNS: true }}
                                    createButton={<CreateReportButton path={`${AdminRouteNames.REPORTS_MANAGEMENT}/create`} />}
                                />

                                <ReportsTable data={props?.data} pagination={props?.pagination} handleFilterChange={props?.handleFilterChange} />
                            </>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default ReportsListPage
