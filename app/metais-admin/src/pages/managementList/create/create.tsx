import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { UserManagementForm } from '@/components/views/egov/management-list-views/UserManagementForm'
import { UserManagementContainer } from '@/components/containers/ManagementList/UserManagementContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const CreateUserManagement: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('userManagement.title'), href: AdminRouteNames.USER_MANAGEMENT },
                    { label: t('managementList.detailCreateHeading'), href: `${AdminRouteNames.USER_MANAGEMENT}/create` },
                ]}
            />
            <MainContentWrapper>
                <UserManagementContainer
                    View={({ data: managementData, isError, isLoading }) => (
                        <UserManagementForm isCreate isError={isError} isLoading={isLoading} detailData={undefined} managementData={managementData} />
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default CreateUserManagement
