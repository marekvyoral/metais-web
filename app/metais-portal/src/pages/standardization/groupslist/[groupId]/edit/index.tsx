import { useParams } from 'react-router-dom'

import { GroupEditContainer } from '@/components/containers/standardization/groups/GroupEditContainer'
import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'

const GroupEditPage = () => {
    const { groupId } = useParams()

    return (
        <GroupEditContainer
            id={groupId}
            View={(props) => (
                <GroupCreateEditView
                    onSubmit={props.onSubmit}
                    goBack={props.goBack}
                    infoData={props.infoData}
                    isLoading={false}
                    resultApiCall={props.resultApiCall}
                    resetResultSuccessApiCall={props.resetResultSuccessApiCall}
                />
            )}
        />
    )
}
export default GroupEditPage
