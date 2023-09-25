import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ClaimUi } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

import { GdprRequestDetailContainer } from '@/components/containers/ManagementList/GdprRequestList/GdprRequestDetailContainer'
import { RefuseTextModal } from '@/components/views/userManagement/request-list-view/request-detail/RefuseTextModal'
import { RequestDetailView } from '@/components/views/userManagement/request-list-view/request-detail/RequestDetailView'
import { RoleItem } from '@/components/views/userManagement/request-list-view/request-detail/RequestRolesForm'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DetailRequest: React.FC = () => {
    const { userId } = useParams()
    const { t } = useTranslation()
    const [modalTextOpen, setModalTextOpen] = useState(false)

    const handleRefuseClick = () => {
        setModalTextOpen(true)
    }
    return (
        <GdprRequestDetailContainer
            userId={userId ?? ''}
            View={({
                data,
                roleData,
                isLoading,
                isSuccess,
                isError,
                handleApproveClick,
                handleDeleteClick,
                errorMessage,
                handleRefuseModalClick,
            }) => (
                <>
                    <BreadCrumbs
                        withWidthContainer
                        links={[
                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                            { label: t('requestList.title'), href: AdminRouteNames.REQUEST_LIST_ALL },
                            {
                                label: data?.identityFirstName + ' ' + data?.identityLastName ?? '',
                                href: AdminRouteNames.REQUEST_LIST_ALL + '/detail/gdpr/' + userId,
                            },
                        ]}
                    />
                    <MainContentWrapper>
                        <QueryFeedback
                            loading={isLoading}
                            error={isError}
                            errorProps={{ errorMessage: t('managementList.containerQueryError') }}
                            withChildren
                        >
                            <RequestDetailView
                                root={AdminRouteNames.REQUEST_LIST_ALL}
                                request={data}
                                roleData={roleData}
                                handleApproveClick={handleApproveClick}
                                handleRefuseClick={handleRefuseClick}
                                handleDeleteClick={handleDeleteClick}
                                successesMutation={isSuccess}
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
                        </QueryFeedback>
                    </MainContentWrapper>
                </>
            )}
        />
    )
}

export default DetailRequest
