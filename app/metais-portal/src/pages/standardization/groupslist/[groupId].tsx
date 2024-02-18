import React from 'react'
import { useParams } from 'react-router-dom'

import GroupDetailContainer from '@/components/containers/standardization/groups/GroupDetailContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'
import GroupDetailView from '@/components/views/standardization/groups/GroupDetailView'

const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams()

    return (
        <GroupsPermissionsWrapper groupId={groupId ?? ''}>
            <GroupDetailContainer id={groupId ?? ''} View={(props) => <GroupDetailView {...props} />} />
        </GroupsPermissionsWrapper>
    )
}

export default GroupDetailPage
