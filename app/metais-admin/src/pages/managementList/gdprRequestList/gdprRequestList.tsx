import { RequestListContainer, RequestListType } from '@/components/containers/ManagementList/RequestListContainer'
import { RequestListView } from '@/components/views/userManagement/request-list-view/RequestListView'

const GdprRequestListPage = () => {
    return (
        <RequestListContainer
            listType={RequestListType.GDPR}
            View={(props) => (
                <RequestListView
                    listType={props.listType}
                    route={props.route}
                    data={props.data}
                    defaultFilterParams={props.defaultFilterParams}
                    handleFilterChange={props.handleFilterChange}
                />
            )}
        />
    )
}

export default GdprRequestListPage
