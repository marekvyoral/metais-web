import { useParams } from 'react-router-dom'

import { MeetingEditContainer } from '@/components/containers/standardization/meetings/MeetingEditContainer'
import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'

const MeetingEditPage = () => {
    const { meetingId } = useParams()

    return <MeetingEditContainer id={meetingId ?? ''} View={(props) => <MeetingCreateEditView {...props} />} />
}
export default MeetingEditPage
