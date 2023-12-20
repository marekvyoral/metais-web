import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetMeetingRequestsParams, useGetMeetingRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { useEffect, useMemo } from 'react'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { MeetingFilter, MeetingsFilterData, MeetingsListView, SortType } from '@/components/views/standardization/meetings/MeetingsListView'
import { MeetingsListPermissionsWrapper } from '@/components/permissions/MeetingsListPermissionsWrapper'

export const MeetingsListContainer: React.FC = () => {
    const defaultFilterValues: MeetingsFilterData = {
        meetingOption: MeetingFilter.MY_MEETINGS,
        group: '',
        state: '',
        startDate: '',
        endDate: '',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        sort: [
            {
                orderBy: 'beginDate',
                sortDirection: SortType.DESC,
            },
        ],
    }

    const { filter, handleFilterChange } = useFilterParams<MeetingsFilterData>(defaultFilterValues)

    const meetingsRequestParams = useMemo((): GetMeetingRequestsParams => {
        const meetingParamValues: GetMeetingRequestsParams = {
            pageNumber: Number(filter.pageNumber ?? BASE_PAGE_NUMBER),
            perPage: Number(filter.pageSize ?? BASE_PAGE_SIZE),
            ...(filter?.meetingOption == MeetingFilter.MY_MEETINGS && { onlyMy: true }),
            ...(filter?.group && { workGroupId: filter?.group }),
            ...(filter?.state && { state: filter?.state }),
            ...(filter?.startDate && { fromDate: filter?.startDate }),
            ...(filter?.endDate && { toDate: filter?.endDate }),
            ...(filter.sort?.[0]?.orderBy && { sortBy: filter.sort?.[0]?.orderBy ?? 'beginDate' }),
            ...(filter.sort?.[0]?.sortDirection && { ascending: filter.sort?.[0]?.sortDirection === SortType.ASC }),
        }
        return meetingParamValues
    }, [filter?.endDate, filter?.group, filter?.meetingOption, filter.pageNumber, filter.pageSize, filter.sort, filter?.startDate, filter?.state])

    const { data: meetings, isError, isFetching: isMeetingRequestLoading } = useGetMeetingRequests(meetingsRequestParams)
    const { data: groups, isFetching: isGroupLoading } = useFind2111({})

    const { wrapperRef: scrollRef, scrollToMutationFeedback: scrollToRef } = useScroll()

    useEffect(() => {
        if (isError) scrollToRef()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError])

    return (
        <MeetingsListPermissionsWrapper>
            <QueryFeedback loading={isMeetingRequestLoading || isGroupLoading} error={isError} withChildren>
                <div ref={scrollRef} />
                <MeetingsListView
                    meetings={Array.isArray(meetings?.meetingRequests) ? meetings?.meetingRequests : undefined}
                    groups={Array.isArray(groups) ? groups : undefined}
                    meetingsCount={meetings?.meetingRequestsCount ?? 0}
                    defaultFilterValues={defaultFilterValues}
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                />
            </QueryFeedback>
        </MeetingsListPermissionsWrapper>
    )
}
