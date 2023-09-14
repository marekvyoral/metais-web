import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { QueryFeedback } from '@isdd/metais-common/index'

import { UserDetailContainer } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserDetail } from '@/components/views/egov/management-list-views/UserDetail'
import { UserRoles } from '@/components/views/egov/management-list-views/UserRoles'
import { UserAuthetificationItems } from '@/components/views/egov/management-list-views/UserAuthetificationItems'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const DetailUserManagement: React.FC = () => {
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
                ]}
            />
            <MainContentWrapper>
                <UserDetailContainer
                    userId={userId ?? ''}
                    View={({ data, isLoading, isError }) => (
                        <QueryFeedback loading={isLoading} error={isError} withChildren>
                            <UserDetail userData={data?.userData} userId={userId ?? ''} />
                            <UserRoles userOrganizations={data?.userOrganizations} />
                            <UserAuthetificationItems userData={data?.userData} />
                        </QueryFeedback>
                    )}
                />
            </MainContentWrapper>
        </>
    )
}

export default DetailUserManagement
