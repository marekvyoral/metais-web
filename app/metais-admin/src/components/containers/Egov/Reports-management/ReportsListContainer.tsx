import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import {
    CategoryHeaderList,
    ReportHeader,
    ReportHeaderList,
    useDeleteReport,
    useListCategories,
    useListReport,
    usePublishReport,
    useUnpublishReport,
} from '@isdd/metais-common/api/generated/report-swagger'
import { mapFilterToReportsParamsAdmin } from '@isdd/metais-common/componentHelpers'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { ReportsListActionsOverRowEnum } from './ReportsUtils'

import { ReportsFilterData } from '@/pages/reports-management/reports-management'

export const mapReportHeaderListToPagination = (uiFilter?: IFilter, data?: ReportHeaderList | void): Pagination => {
    return {
        pageNumber: uiFilter?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: uiFilter?.pageSize ?? BASE_PAGE_SIZE,
        dataLength: data?.totalCount ?? 0,
    }
}

export interface IReportsListView {
    data?: ReportHeader[]
    categories?: CategoryHeaderList
    pagination: Pagination
    saveMutationIsSuccess: boolean
    changeMutationIsSuccess: boolean
    changeMutationIsSuccessReset: () => void
    defaultFilterValues: ReportsFilterData
    handleFilterChange: (filter: IFilter) => void
    handleRowAction: (action: ReportsListActionsOverRowEnum, id: number | undefined, isPublished: boolean, reportDetailLookupString?: string) => void
}

interface IReportsListContainer {
    View: React.FC<IReportsListView>
    defaultFilterValues: ReportsFilterData
}

export const ReportsListContainer: React.FC<IReportsListContainer> = ({ View, defaultFilterValues }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { filter: filterParams, handleFilterChange } = useFilterParams<FieldValues & IFilterParams & IFilter>({ defaultFilterValues })

    const { isLoading, isError, data, refetch: listReportRefetch } = useListReport(mapFilterToReportsParamsAdmin(filterParams))
    const { isLoading: isLoadingCategories, isError: isErrorCategories, data: dataCategories } = useListCategories()
    const { isLoading: isLoadingPublishReport, isError: isErrorPublishReport, mutateAsync: publishReportMutation } = usePublishReport()
    const { isLoading: isLoadingUnpublishReport, isError: isErrorUnpublishReport, mutateAsync: unpublishReportMutation } = useUnpublishReport()
    const { isLoading: isLoadingDeleteReport, isError: isErrorDeleteReport, mutateAsync: deleteReportMutation } = useDeleteReport()

    const { isActionSuccess } = useActionSuccess()
    const [saveMutationIsSuccess, setSaveMutationIsSuccess] = useState<boolean>(false)
    const [changeMutationIsSuccess, setChangeMutationIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        if (isActionSuccess.value && isActionSuccess.additionalInfo?.type === 'create') {
            setSaveMutationIsSuccess(true)
            listReportRefetch()
            return
        }
        setSaveMutationIsSuccess(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActionSuccess])

    const changeMutationIsSuccessReset = () => {
        setChangeMutationIsSuccess(false)
    }

    const handlePublishReport = useCallback(
        (id: number | undefined, published: boolean) => {
            if (id) {
                published
                    ? unpublishReportMutation({ reportId: id }).then(() => {
                          !isErrorUnpublishReport && setChangeMutationIsSuccess(true)
                          listReportRefetch()
                      })
                    : publishReportMutation({ reportId: id }).then(() => {
                          !isErrorPublishReport && setChangeMutationIsSuccess(true)
                          listReportRefetch()
                      })
            }
        },
        [isErrorPublishReport, isErrorUnpublishReport, listReportRefetch, publishReportMutation, unpublishReportMutation],
    )

    const handleRemoveReport = useCallback(
        (id?: number) => {
            if (id) {
                deleteReportMutation({ reportId: id }).then(() => {
                    setChangeMutationIsSuccess(true)
                    listReportRefetch()
                })
            }
        },
        [deleteReportMutation, listReportRefetch],
    )

    const pagination = mapReportHeaderListToPagination(filterParams, data)

    const handleRowAction = useCallback(
        (action: ReportsListActionsOverRowEnum, id: number | undefined, isPublished: boolean, reportDetailLookupString?: string) => {
            switch (action) {
                case ReportsListActionsOverRowEnum.EDIT:
                    if (reportDetailLookupString) {
                        navigate(`${AdminRouteNames.REPORTS_MANAGEMENT}/${reportDetailLookupString}`, { state: { from: location } })
                    }
                    break
                case ReportsListActionsOverRowEnum.PUBLISH:
                    handlePublishReport(id, isPublished)
                    break
                case ReportsListActionsOverRowEnum.REMOVE:
                    handleRemoveReport(id)
                    break
            }
        },
        [handlePublishReport, handleRemoveReport, location, navigate],
    )

    return (
        <QueryFeedback
            loading={isLoading || isLoadingCategories || isLoadingPublishReport || isLoadingUnpublishReport || isLoadingDeleteReport}
            error={isError || isErrorCategories || isErrorPublishReport || isErrorUnpublishReport || isErrorDeleteReport}
            indicatorProps={{ layer: 'parent' }}
        >
            <View
                data={data?.reportHeaders}
                categories={dataCategories}
                pagination={pagination}
                saveMutationIsSuccess={saveMutationIsSuccess}
                changeMutationIsSuccess={changeMutationIsSuccess}
                changeMutationIsSuccessReset={changeMutationIsSuccessReset}
                defaultFilterValues={defaultFilterValues}
                handleFilterChange={handleFilterChange}
                handleRowAction={handleRowAction}
            />
        </QueryFeedback>
    )
}
