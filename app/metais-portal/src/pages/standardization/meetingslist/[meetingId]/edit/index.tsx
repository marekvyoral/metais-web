import { useParams } from 'react-router-dom'

import { MeetingEditContainer } from '@/components/containers/standardization/meetings/MeetingEditContainer'
import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'

const MeetingEditPage = () => {
    const { meetingId } = useParams()

    return (
        <MeetingEditContainer
            id={meetingId ?? ''}
            View={(props) => (
                <MeetingCreateEditView
                    onSubmit={props.onSubmit}
                    infoData={props.infoData}
                    isLoading={props.isLoading}
                    isError={props.isError}
                    fileUploadRef={props.fileUploadRef}
                    handleDeleteSuccess={props.handleDeleteSuccess}
                    handleUploadSuccess={props.handleUploadSuccess}
                    id={props.id}
                />
            )}
        />
    )
}
export default MeetingEditPage
