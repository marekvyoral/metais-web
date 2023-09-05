import { mapFilterToExecuteParams } from '@isdd/metais-common/componentHelpers'
import { ReportExportButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'

import { ReportsDetailContainer } from '@/components/containers/ReportsDetailContainer'
import { ReportTable } from '@/components/views/reports/ReportTable'
import { ReportsCard } from '@/components/views/reports/ReportsCard'
import { ReportsFilterParameterWrapper } from '@/components/views/reports/ReportsFilterParameterWrapper'

const ReportsDetailPage: React.FC = () => {
    const defaultFilterValues: IFilterParams & { [key: string]: string } = {}

    return (
        <ReportsDetailContainer
            defaultFilterValues={defaultFilterValues}
            View={(props) => {
                return (
                    <>
                        <ReportsCard data={props.data} />
                        <ReportsFilterParameterWrapper
                            defaultFilterValues={defaultFilterValues}
                            parameters={props.data?.parameters}
                            filterEnumData={props.filterEmumData}
                        />
                        <ActionsOverTable
                            handleFilterChange={props.handleFilterChange}
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            entityName={props?.data?.lookupKey ?? ''}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                            exportButton={
                                <ReportExportButton
                                    entityId={props?.data?.id ?? 0}
                                    filter={mapFilterToExecuteParams(props.filterParams ?? {}, props.data?.parameters, props.filterEmumData)}
                                />
                            }
                        />

                        <ReportTable data={props?.reportResult} pagination={props?.pagination} handleFilterChange={props?.handleFilterChange} />
                    </>
                )
            }}
        />
    )
}

export default ReportsDetailPage
