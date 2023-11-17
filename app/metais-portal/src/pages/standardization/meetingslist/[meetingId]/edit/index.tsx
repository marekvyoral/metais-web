import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { MeetingEditContainer } from '@/components/containers/standardization/meetings/MeetingEditContainer'
import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'

const MeetingEditPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.meetingDetail')} | MetaIS`
    const { meetingId } = useParams()

    return (
        <MeetingEditContainer
            id={meetingId ?? ''}
            View={(props) => (
                <MeetingCreateEditView
                    onSubmit={props.onSubmit}
                    goBack={props.goBack}
                    infoData={props.infoData}
                    isLoading={props.isLoading}
                    isError={props.isError}
                />
            )}
        />
    )
}
export default MeetingEditPage
