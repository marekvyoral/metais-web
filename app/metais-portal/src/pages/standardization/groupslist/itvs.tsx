import React from 'react'
import { KSIVS_SHORT_NAME } from '@isdd/metais-common/constants'
import { useFind2111 } from '@isdd/metais-common/api/generated/iam-swagger'

import GroupDetailContainer from '@/components/containers/standardization/groups/GroupDetailContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'
import GroupDetailView from '@/components/views/standardization/groups/GroupDetailView'

const GroupItvsDetailPage: React.FC = () => {
    const { data: ksisvsGroup, isLoading, isError, error } = useFind2111({ shortName: KSIVS_SHORT_NAME })
    const groupId = Array.isArray(ksisvsGroup) ? ksisvsGroup[0].uuid : ksisvsGroup?.uuid

    return (
        <GroupsPermissionsWrapper groupId={groupId ?? ''}>
            <GroupDetailContainer
                id={groupId ?? ''}
                View={(props) => (
                    <GroupDetailView
                        {...props}
                        isLoading={isLoading || props.isLoading}
                        error={error || props.error}
                        isIdentitiesError={isError || props.isIdentitiesError}
                    />
                )}
            />
        </GroupsPermissionsWrapper>
    )
}

export default GroupItvsDetailPage
