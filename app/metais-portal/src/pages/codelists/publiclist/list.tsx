import React from 'react'

import { CodeListListContainer } from '@/components/containers/CodeListListContainer'
import { CodeListListView } from '@/components/views/codeLists/CodeListListView'

const CodeListPage = () => {
    return (
        <CodeListListContainer
            View={(props) => <CodeListListView data={props.data} filter={props.filter} handleFilterChange={props.handleFilterChange} />}
        />
    )
}

export default CodeListPage
