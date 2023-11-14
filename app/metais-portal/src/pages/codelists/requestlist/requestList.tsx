import { RequestListContainer } from '@/components/containers/RequestListContainer'
import { RequestListsView } from '@/components/views/requestLists/RequestListsView'

const RequestListPage = () => {
    return (
        <RequestListContainer
            View={(props) => (
                <RequestListsView
                    entityName={props.entityName}
                    isError={props.isError}
                    isLoading={props.isLoading}
                    data={props.data}
                    filter={props.filter}
                    handleFilterChange={props.handleFilterChange}
                />
            )}
        />
    )
}

export default RequestListPage
