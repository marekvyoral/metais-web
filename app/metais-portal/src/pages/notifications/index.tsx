import React from 'react'

import { NotificationsListContainer } from '@/components/containers/NotificationsListContainer'
import NotificationsListView from '@/components/views/notifications/NotificationsListView'

const NotificationsPage = () => {
    return (
        <NotificationsListContainer
            View={(props) => (
                <NotificationsListView
                    data={props.data}
                    isError={props.isError}
                    isLoading={props.isLoading}
                    defaultFilterValues={props.defaultFilterValues}
                    columns={props.columns}
                    selectedColumns={props.selectedColumns}
                    setSelectedColumns={props.setSelectedColumns}
                    sort={props.sort}
                    setSort={props.setSort}
                    mutateAllDelete={props.mutateAllDelete}
                    mutateAllRead={props.mutateAllRead}
                    mutateDelete={props.mutateDelete}
                    handleFilterChange={props.handleFilterChange}
                    isMutateError={props.isMutateError}
                    isMutateLoading={props.isMutateLoading}
                    isMutateSuccess={props.isMutateSuccess}
                />
            )}
        />
    )
}

export default NotificationsPage
