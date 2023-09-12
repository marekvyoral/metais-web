import { CodeListListContainer } from '@/components/containers/CodeListListContainer'
import { CodeListListView } from '@/components/views/codeLists/CodeListListView'

const CodeListPage = () => {
    return (
        <CodeListListContainer
            isOnlyPublishedPage
            View={(props) => (
                <CodeListListView data={props.data} filter={props.filter} handleFilterChange={props.handleFilterChange} isOnlyPublishedPage />
            )}
        />
    )
}

export default CodeListPage
