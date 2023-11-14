import { BreadCrumbs, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { GroupsListContainer } from '@/components/containers/standardization/groups/GroupsListContainer'
import { MembershipHistoryContainer } from '@/components/containers/standardization/groups/MembershipHistoryContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const GroupsListPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.groupsOfCommission')} | MetaIS`

    const tabsList: Tab[] = [
        {
            id: 'groupslist',
            title: t('groups.groupList'),
            content: <GroupsListContainer />,
        },
        {
            id: 'history',

            title: t('groups.groupMembersHistory'),
            content: <MembershipHistoryContainer />,
        },
    ]

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('navMenu.lists.groups'), href: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('navMenu.lists.groups')}</TextHeading>
                <GroupsPermissionsWrapper>
                    <Tabs tabList={tabsList} />
                </GroupsPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default GroupsListPage
