import { BreadCrumbs, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { META_IS_TITLE } from '@isdd/metais-common/constants'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { GroupsListContainer } from '@/components/containers/standardization/groups/GroupsListContainer'
import { MembershipHistoryContainer } from '@/components/containers/standardization/groups/MembershipHistoryContainer'
import { GroupsPermissionsWrapper } from '@/components/permissions/GroupsPermissionsWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const GroupsListPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    document.title = `${t('titles.groupsOfCommission')} ${META_IS_TITLE}`
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

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

    const getSuccessMsg = (): string => {
        switch (isActionSuccess.additionalInfo?.type) {
            case 'delete':
                return t('groups.successfulGroupDeleted')
            default:
                return ''
        }
    }

    useMemo(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActionSuccess.value])

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
                <div ref={wrapperRef}>
                    <MutationFeedback successMessage={getSuccessMsg()} success={isActionSuccess.value} error={false} />
                </div>
                <TextHeading size="XL">{t('navMenu.lists.groups')}</TextHeading>
                <GroupsPermissionsWrapper>
                    <Tabs tabList={tabsList} />
                </GroupsPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default GroupsListPage
