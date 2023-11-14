import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'
import { GetMeetingRequestsParams, useGetMeetingRequests } from '@isdd/metais-common/api/generated/standards-swagger'
import React, { useState } from 'react'

import { MeetingsListView } from '@/components/views/standardization/meetings/MeetingsListView'

export const MeetingsListContainer: React.FC = () => {
    const [meetingsRequestParams, setMeetingsRequestParams] = useState<GetMeetingRequestsParams>({
        pageNumber: 1,
        perPage: 10,
        sortBy: 'beginDate',
        ascending: false,
    })

    const { data: meetings, isError, isLoading } = useGetMeetingRequests(meetingsRequestParams)

    const { data: groups, isLoading: isGroupLoading } = useFind2111({})
    return (
        <MeetingsListView
            meetings={Array.isArray(meetings?.meetingRequests) ? meetings?.meetingRequests : undefined}
            groups={Array.isArray(groups) ? groups : undefined}
            isLoading={isLoading && isGroupLoading}
            isError={isError}
            setMeetingsRequestParams={setMeetingsRequestParams}
            meetingsCount={meetings?.meetingRequestsCount ?? 0}
        />
    )
}
