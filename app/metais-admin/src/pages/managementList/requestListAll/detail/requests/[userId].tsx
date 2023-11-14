import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

import { RequestDetailContainer } from '@/components/containers/ManagementList/RequestList/RequestDetailContainer'
import { RefuseTextModal } from '@/components/views/userManagement/request-list-view/request-detail/RefuseTextModal'
import { RequestDetailView } from '@/components/views/userManagement/request-list-view/request-detail/RequestDetailView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DetailRequest: React.FC = () => {
    const { t } = useTranslation()
    const { userId } = useParams()
    const [modalTextOpen, setModalTextOpen] = useState(false)

    const handleRefuseClick = () => {
        setModalTextOpen(true)
    }

    return (
        <RequestDetailContainer
            userId={userId ?? ''}
            View={({ data, roleData, errorMessage, isError, isLoading, handleRefuseModalClick, handleApproveClick, isSuccess }) => {
                return (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('requestList.title'), href: AdminRouteNames.REQUEST_LIST_ALL },
                                {
                                    label: data?.identityFirstName + ' ' + data?.identityLastName ?? '',
                                    href: AdminRouteNames.REQUEST_LIST_ALL + '/detail/requests/' + userId,
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
                                    successesMutation={isSuccess}
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
                )
            }}
        />
    )
}

export default DetailRequest
