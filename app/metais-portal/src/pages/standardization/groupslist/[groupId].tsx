import React from 'react'
import { useParams } from 'react-router-dom'

import GroupDetailContainer from '@/components/containers/standardization/groups/GroupDetailContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'
import GroupDetailView from '@/components/views/standartization/groups/GroupDetailView'

const GroupDetailPage: React.FC = () => {
    const { groupId } = useParams()

    return (
        <GroupsPermissionsWrapper groupId={groupId ?? ''}>
            <GroupDetailContainer
                id={groupId ?? ''}
                View={(props) => (
                    <GroupDetailView
                        isIdentitiesError={props.isIdentitiesError}
                        isLoading={props.isLoading}
                        error={props.error}
                        filter={props.filter}
                        handleFilterChange={props.handleFilterChange}
                        id={props.id}
                        group={props.group}
                        identityToDelete={props.identityToDelete}
                        setIdentityToDelete={props.setIdentityToDelete}
                        isAddModalOpen={props.isAddModalOpen}
                        setAddModalOpen={props.setAddModalOpen}
                        successfulUpdatedData={props.successfulUpdatedData}
                        setSuccessfulUpdatedData={props.setSuccessfulUpdatedData}
                        user={props.user}
                        rowSelection={props.rowSelection}
                        isIdentitiesLoading={props.isIdentitiesLoading}
                        selectableColumnsSpec={props.selectableColumnsSpec}
                        tableData={props.tableData}
                        identitiesData={props.identitiesData}
                        setMembersUpdated={props.setMembersUpdated}
                    />
                )}
            />
        </GroupsPermissionsWrapper>
    )
}

export default GroupDetailPage
