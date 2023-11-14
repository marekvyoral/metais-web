import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { UserDetailContainer } from '@/components/containers/ManagementList/UserDetailContainer'
import { ChangePasswordForm } from '@/components/views/egov/management-list-views/ChangePasswordForm'

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
                    { label: t('managementList.passwordChange'), href: `${AdminRouteNames.USER_MANAGEMENT}/password/${userId}` },
                ]}
            />
            <MainContentWrapper>
                <UserDetailContainer
                    passwordChange
                    userId={userId ?? ''}
                    View={({ isError, isLoading }) => <ChangePasswordForm isLoading={isLoading} isError={isError} />}
                />
            </MainContentWrapper>
        </>
    )
}

export default EditUserManagement
