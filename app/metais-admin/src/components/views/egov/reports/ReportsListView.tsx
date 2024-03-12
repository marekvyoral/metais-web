import { Filter, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, CreateReportButton, MutationFeedback } from '@isdd/metais-common/index'
import { mapCategoriesToOptions } from '@isdd/metais-common/componentHelpers'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useEffect } from 'react'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useTranslation } from 'react-i18next'

import { ReportsTable } from './ReportsTable'

import { ReportsFilterData } from '@/pages/reports-management/reports-management'
import { IReportsListView } from '@/components/containers/Egov/Reports-management/ReportsListContainer'

export const ReportsListView = ({
    data,
    categories,
    defaultFilterValues,
    handleFilterChange,
    handleRowAction,
    changeMutationIsSuccessReset,
    pagination,
    saveMutationIsSuccess,
    changeMutationIsSuccess,
}: IReportsListView) => {
    const { t } = useTranslation()
    const { wrapperRef: scrollRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [scrollToMutationFeedback])

    return (
        <>
            <div ref={scrollRef} />
            <MutationFeedback
                success={saveMutationIsSuccess || changeMutationIsSuccess}
                error={false}
                onMessageClose={changeMutationIsSuccessReset}
            />
            <Filter<ReportsFilterData>
                defaultFilterValues={defaultFilterValues}
                form={({ setValue, filter }) => (
                    <div>
                        <SimpleSelect
                            label={t('reports.filter.category')}
                            name={'category'}
                            id="category"
                            options={mapCategoriesToOptions(categories?.categories)}
                            setValue={setValue}
                            defaultValue={filter?.category}
                        />
                    </div>
                )}
            />
            <ActionsOverTable
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={'reports'}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                createButton={<CreateReportButton path={`${AdminRouteNames.REPORTS_MANAGEMENT}/create`} />}
            />

            <ReportsTable data={data} pagination={pagination} handleFilterChange={handleFilterChange} handleRowAction={handleRowAction} />
        </>
    )
}
