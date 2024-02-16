import { Filter } from '@isdd/idsk-ui-kit/filter'
import { BreadCrumbs, HomeIcon, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { mapCategoriesToOptions } from '@isdd/metais-common/componentHelpers'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { ReportsListContainer } from '@/components/containers/ReportsListContainer'
import { ReportsTable } from '@/components/views/reports/ReportsTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface ReportsFilterData extends IFilterParams {
    name?: string
    category?: string
}

const ReportsListPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.reports')} | MetaIS`
    const defaultFilterValues: ReportsFilterData = { name: '', category: '' }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('reports.heading') ?? '', href: RouterRoutes.REPORTS_LIST },
                ]}
            />

            <ReportsListContainer
                defaultFilterValues={defaultFilterValues}
                View={(props) => {
                    return (
                        <MainContentWrapper>
                            <QueryFeedback loading={props.isLoading} error={false} withChildren>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="L">{t('reports.heading')}</TextHeading>
                                    {props.isError && <QueryFeedback loading={false} error={props.isError} />}
                                </FlexColumnReverseWrapper>
                                <Filter<ReportsFilterData>
                                    defaultFilterValues={defaultFilterValues}
                                    form={({ setValue, clearErrors, filter }) => (
                                        <div>
                                            <SimpleSelect
                                                name="category"
                                                label={t('reports.filter.category')}
                                                options={mapCategoriesToOptions(props.categories?.categories)}
                                                setValue={setValue}
                                                clearErrors={clearErrors}
                                                defaultValue={filter.category}
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
                                />

                                <ReportsTable
                                    data={props?.data}
                                    pagination={props?.pagination}
                                    filter={props.filter}
                                    handleFilterChange={props?.handleFilterChange}
                                />
                            </QueryFeedback>
                        </MainContentWrapper>
                    )
                }}
            />
        </>
    )
}

export default ReportsListPage
