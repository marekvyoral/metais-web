import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { UserDetailContainer } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserManagementForm } from '@/components/views/egov/management-list-views/UserManagementForm'
import { UserManagementContainer } from '@/components/containers/ManagementList/UserManagementContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const EditUserManagement: React.FC = () => {
    const { userId } = useParams()
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('userManagement.title'), href: AdminRouteNames.USER_MANAGEMENT },
                    { label: t('managementList.detailHeading'), href: `${AdminRouteNames.USER_MANAGEMENT}/detail/${userId}` },
                    { label: t('managementList.detailEditHeading'), href: `${AdminRouteNames.USER_MANAGEMENT}/edit/${userId}` },
                ]}
            />
            <MainContentWrapper>
                <UserManagementContainer
                    View={({ data: managementData, isError: isMngDataError, isLoading: isMngDataLoading }) => (
                        <UserDetailContainer
                            userId={userId ?? ''}
                            View={({ data: detailData, isError, isLoading }) => (
                                <UserManagementForm
                                    detailData={detailData}
                                    managementData={managementData}
                                    isError={isError || isMngDataError}
                                    isLoading={isLoading || isMngDataLoading}
                                />
                            )}
                        />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default EditUserManagement
