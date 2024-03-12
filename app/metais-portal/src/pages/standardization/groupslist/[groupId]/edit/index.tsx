import { useParams } from 'react-router-dom'

import { GroupEditContainer } from '@/components/containers/standardization/groups/GroupEditContainer'
import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'

const GroupEditPage = () => {
    const { groupId } = useParams()

    return <GroupEditContainer id={groupId} backGroupId={groupId} View={(props) => <GroupCreateEditView {...props} />} />
}
export default GroupEditPage
