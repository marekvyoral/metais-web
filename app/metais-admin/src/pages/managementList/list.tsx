import React from 'react'

import UserManagementListContainer from '@/components/containers/ManagementList/UserManagementListContainer'
import { UserManagementListPageView } from '@/components/views/userManagement/userManagementListWrapper'

const UserManagementListPage = () => {
    return (
        <UserManagementListContainer
            View={({ data, filter, handleFilterChange, handleRowAction, handleBlockRowsAction, handleExport }) => (
                <UserManagementListPageView
                    data={data}
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                    handleRowAction={handleRowAction}
                    handleBlockRowsAction={handleBlockRowsAction}
                    handleExport={handleExport}
                />
            )}
        />
    )
}

export default UserManagementListPage
