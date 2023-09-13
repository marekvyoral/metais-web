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
                        id={props.id}
                        group={props.group}
                        identityToDelete={props.identityToDelete}
                        setIdentityToDelete={props.setIdentityToDelete}
                        isAddModalOpen={props.isAddModalOpen}
                        setAddModalOpen={props.setAddModalOpen}
                        successfulUpdatedData={props.successfulUpdatedData}
                        setSuccessfulUpdatedData={props.setSuccessfulUpdatedData}
                        listParams={props.listParams}
                        setListParams={props.setListParams}
                        user={props.user}
                        rowSelection={props.rowSelection}
                        sorting={props.sorting}
                        setSorting={props.setSorting}
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
