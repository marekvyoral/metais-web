import React from 'react'
import { BreadCrumbs, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { UserInformationsPage } from '@isdd/metais-common/components/views/user-profile/user-informations/UserInformationsPage'
import { UserPreferencesPage } from '@isdd/metais-common/components/views/user-profile/user-preferences/UserPreferencesPage'
import { UserRightsPage } from '@isdd/metais-common/components/views/user-profile/UserRightsPage'
import { UserNotificationsSettings } from '@isdd/metais-common/components/views/user-profile/UserNotificationsSettings'
import { UserPasswordChangePage } from '@isdd/metais-common/components/views/user-profile/UserPasswordChangePage'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const UserProfilePage = () => {
    const { t } = useTranslation()

    const tabList: Tab[] = [
        {
            id: 'informations',
            title: t('userProfile.information.header'),
            content: <UserInformationsPage />,
        },
        {
            id: 'settings',
            title: t('userProfile.settings'),
            content: <UserPreferencesPage />,
        },
        {
            id: 'rights',
            title: t('userProfile.rights'),
            content: <UserRightsPage />,
        },
        {
            id: 'notifications-settings',
            title: t('userProfile.notificationsSettings'),
            content: <UserNotificationsSettings />,
        },
        {
            id: 'password-change',
            title: t('userProfile.passwordChange'),
            content: <UserPasswordChangePage />,
        },
    ]
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('userProfile.heading'), href: RouteNames.USER_PROFILE },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('userProfile.heading')}</TextHeading>
                <Tabs tabList={tabList} />
            </MainContentWrapper>
        </>
    )
}

export default UserProfilePage
