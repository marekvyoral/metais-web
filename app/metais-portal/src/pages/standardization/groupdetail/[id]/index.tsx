import { useParams } from 'react-router-dom'
import React from 'react'

import KSIVSContainer from '@/components/containers/KSIVSVContainer'
import KSIVSView from '@/components/views/standartization/KSIVSView'

const KSIVSPage = () => {
    const { id } = useParams()

    return (
        <KSIVSContainer
            id={id}
            View={(props) => (
                <KSIVSView
                    id={props.id}
                    isAdmin={props.isAdmin}
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
                />
            )}
        />
    )
}

export default KSIVSPage
