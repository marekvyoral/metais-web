import React from 'react'

import DraftsListCreateContainer from '../../../components/entities/draftsList/DraftsListCreateContainer'
import DraftsListCreateForm from '../../../components/entities/draftsList/DraftsListCreateForm'
const DraftsListCreatePage: React.FC = () => {
    return <DraftsListCreateContainer View={(props) => <DraftsListCreateForm onSubmit={props?.onSubmit} data={undefined} />} />
}
export default DraftsListCreatePage
