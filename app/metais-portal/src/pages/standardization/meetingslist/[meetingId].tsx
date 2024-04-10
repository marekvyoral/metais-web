import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import MeetingDetailContainer from '@/components/containers/standardization/meetings/MeetingDetailContainer'
import MeetingDetailView from '@/components/views/standardization/meetings/MeetingDetailView'

const MeetingDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { meetingId } = useParams()

    return (
        <MeetingDetailContainer
            meetingId={Number(meetingId) ?? ''}
            View={(props) => {
                document.title = `${t('titles.meetingDetail', { itemName: props.meetingDetailData?.name })} ${META_IS_TITLE}`

                return (
                    <MeetingDetailView
                        isLoading={props.isLoading}
                        filter={props.filter}
                        handleFilterChange={props.handleFilterChange}
                        group={props.group}
                        user={props.user}
                        meetingId={props.meetingId}
                        meetingDetailData={props.meetingDetailData}
                        refetch={props.refetch}
                        attachmentsMetaData={props.attachmentsMetaData}
                    />
                )
            }}
        />
    )
}

export default MeetingDetailPage
