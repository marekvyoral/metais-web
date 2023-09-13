import { Tab, Tabs } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { GroupsListContainer } from '@/components/containers/standardization/groups/GroupsListContainer'
import { MembershipHistoryContainer } from '@/components/containers/standardization/groups/MembershipHistoryContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'

const GroupsListPage: React.FC = () => {
    const { t } = useTranslation()

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
        <GroupsPermissionsWrapper>
            <Tabs tabList={tabsList} />
        </GroupsPermissionsWrapper>
    )
}

export default GroupsListPage
