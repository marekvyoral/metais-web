import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetMeetingRequestsParams, useGetMeetingRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { useState } from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'

import { MeetingsListView } from '@/components/views/standardization/meetings/MeetingsListView'

export const MeetingsListContainer: React.FC = () => {
    const [meetingsRequestParams, setMeetingsRequestParams] = useState<GetMeetingRequestsParams>({
        pageNumber: 1,
        perPage: 10,
        sortBy: 'beginDate',
        ascending: false,
        // sortBy: filter.sort?.[0]?.orderBy ?? 'changedAt',
        // ascending: filter.sort?.[0]?.sortDirection === SortType.DESC ?? false,
    })

    const { data: meetings, isError, isFetching: isMeetingRequestLoading } = useGetMeetingRequests(meetingsRequestParams)
    const { data: groups, isFetching: isGroupLoading } = useFind2111({})

    return (
        <QueryFeedback loading={isMeetingRequestLoading || isGroupLoading} error={isError} withChildren>
            <MeetingsListView
                meetings={Array.isArray(meetings?.meetingRequests) ? meetings?.meetingRequests : undefined}
                groups={Array.isArray(groups) ? groups : undefined}
                isLoading={isMeetingRequestLoading || isGroupLoading}
                isError={isError}
                setMeetingsRequestParams={setMeetingsRequestParams}
                meetingsCount={meetings?.meetingRequestsCount ?? 0}
            />
        </QueryFeedback>
    )
}
