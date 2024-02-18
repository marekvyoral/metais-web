import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import {
    ParameterType,
    ReportDefinition,
    ReportResultObjectResult,
    useExecute,
    useGetReport1,
} from '@isdd/metais-common/api/generated/report-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { mapFilterToExecuteParams } from '@isdd/metais-common/componentHelpers'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetEnumBulk } from '@isdd/metais-common/hooks/useGetEnumBulk'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { META_IS_TITLE } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'

import { getDefaultValueForKey } from '@/componentHelpers'
import { mapGenericTypeToPagination } from '@/componentHelpers/pagination'

export interface IView {
    data?: ReportDefinition
    filterEmumData?: (EnumType | undefined)[]
    filterParams?: FieldValues & IFilterParams & IFilter
    reportResult?: ReportResultObjectResult
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

interface IReportsDetailContainer {
    View: React.FC<IView>
    defaultFilterValues: IFilterParams
}
const TYP = 'typ'

export const ReportsDetailContainer: React.FC<IReportsDetailContainer> = ({ View, defaultFilterValues }) => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    const { isLoading, isError, data: reportMetaData } = useGetReport1(entityId ?? '')

    const enumCodes =
        reportMetaData?.parameters?.filter((parameter) => parameter.type === ParameterType.ENUMS_REPO).map((parameter) => parameter.metaData) ?? []

    const customFilterParamsKeys = reportMetaData?.parameters?.map((param) =>
        param.key ? [param.key, getDefaultValueForKey(param.key, reportMetaData.parameters)] : [],
    )
    const customFilterParams = customFilterParamsKeys ? Object.fromEntries(customFilterParamsKeys) : {}

    const { filter: filterParams, handleFilterChange } = useFilterParams<FieldValues & IFilterParams & IFilter>({
        ...defaultFilterValues,
        ...customFilterParams,
    })

    const { data: filterEnumData } = useGetEnumBulk(enumCodes)

    const {
        isLoading: isLoadingReport,
        isError: isErrorReport,
        data: reportData,
    } = useExecute(reportMetaData?.id ?? 0, TYP, mapFilterToExecuteParams(filterParams, reportMetaData?.parameters, filterEnumData))

    const pagination = mapGenericTypeToPagination(filterParams, reportData)
    document.title = `${t('titles.reportDetail')} ${reportMetaData?.name ?? ''} ${META_IS_TITLE}`
    return (
        <View
            data={reportMetaData}
            filterEmumData={filterEnumData}
            filterParams={filterParams}
            reportResult={reportData?.result}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading || isLoadingReport}
            isError={isError || isErrorReport}
        />
    )
}
