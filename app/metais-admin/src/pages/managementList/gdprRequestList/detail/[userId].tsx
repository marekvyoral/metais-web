import { LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { ClaimUi } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import { GdprRequestDetailContainer } from '@/components/containers/ManagementList/GdprRequestList/GdprRequestDetailContainer'
import { RefuseTextModal } from '@/components/views/userManagement/request-list-view/request-detail/RefuseTextModal'
import { RequestDetailView } from '@/components/views/userManagement/request-list-view/request-detail/RequestDetailView'
import { RoleItem } from '@/components/views/userManagement/request-list-view/request-detail/RequestRolesForm'

const DetailRequest: React.FC = () => {
    const { userId } = useParams()
    const [modalTextOpen, setModalTextOpen] = useState(false)

    const handleRefuseClick = () => {
        setModalTextOpen(true)
    }
    return (
        <GdprRequestDetailContainer
            userId={userId ?? ''}
            View={({ data, roleData, isLoading, isSuccess, handleApproveClick, handleDeleteClick, errorMessage, handleRefuseModalClick }) => (
                <>
                    {isLoading && <LoadingIndicator fullscreen />}
                    <RequestDetailView
                        root={AdminRouteNames.GDPR_REQUEST_LIST}
                        request={data}
                        roleData={roleData}
                        handleApproveClick={handleApproveClick}
                        handleRefuseClick={handleRefuseClick}
                        handleDeleteClick={handleDeleteClick}
                        successedMutation={isSuccess}
                        handleAnonymizeClick={(selectedRoles: RoleItem[], request?: ClaimUi | undefined) =>
                            handleApproveClick(selectedRoles, request, true)
                        }
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
