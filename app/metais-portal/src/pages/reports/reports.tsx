import { Filter } from '@isdd/idsk-ui-kit/filter'
import { SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { mapCategoriesToOptions } from '@isdd/metais-common/componentHelpers'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ReportsListContainer } from '@/components/containers/ReportsListContainer'
import { ReportsTable } from '@/components/views/reports/ReportsTable'

export interface ReportsFilterData extends IFilterParams {
    name?: string
    category?: string
}

const ReportsListPage: React.FC = () => {
    const { t } = useTranslation()
    const defaultFilterValues: ReportsFilterData = { name: '', category: '' }

    return (
        <ReportsListContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
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
                            handleFilterChange={props.handleFilterChange}
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            entityName={'reports'}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                        />

                        <ReportsTable data={props?.data} pagination={props?.pagination} handleFilterChange={props?.handleFilterChange} />
                    </>
                )
            }}
        />
    )
}

export default ReportsListPage
