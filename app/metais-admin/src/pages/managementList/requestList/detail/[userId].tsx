import { LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { RequestDetailContainer } from '@/components/containers/ManagementList/RequestList/RequestDetailContainer'
import { RefuseTextModal } from '@/components/views/userManagement/request-list-view/request-detail/RefuseTextModal'
import { RequestDetailView } from '@/components/views/userManagement/request-list-view/request-detail/RequestDetailView'

const DetailRequest: React.FC = () => {
    const { userId } = useParams()
    const [modalTextOpen, setModalTextOpen] = useState(false)

    const handleRefuseClick = () => {
        setModalTextOpen(true)
    }

    return (
        <RequestDetailContainer
            userId={userId ?? ''}
            View={({ data, roleData, errorMessage, isLoading, handleRefuseModalClick, handleApproveClick, isSuccess }) => (
                <>
                    {isLoading && <LoadingIndicator fullscreen />}
                    <RequestDetailView
                        root={AdminRouteNames.REQUEST_LIST}
                        request={data}
                        roleData={roleData}
                        handleApproveClick={handleApproveClick}
                        handleRefuseClick={handleRefuseClick}
                        successedMutation={isSuccess}
                        errorMessage={errorMessage}
                    />
                    <RefuseTextModal
                        open={modalTextOpen}
                        onClose={() => setModalTextOpen(false)}
                        onSubmit={(text) => {
                            setModalTextOpen(false)
                            handleRefuseModalClick(text)
                        }}
                    />
                </>
            )}
        />
    )
}

export default DetailRequest
