import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import MeetingDetailBaseInfo from './MeetingDetailBaseInfo'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { MeetingDetailViewProps } from '@/components/containers/standardization/meetings/MeetingDetailContainer'

const MeetingDetailView: React.FC<MeetingDetailViewProps> = ({ meetingDetailData, meetingId }) => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { href: RouteNames.HOME, label: t('notifications.home'), icon: HomeIcon },
                    { href: RouteNames.HOW_TO_STANDARDIZATION, label: t('navMenu.standardization') },
                    { href: NavigationSubRoutes.ZOZNAM_ZASADNUTI, label: t('navMenu.lists.meetings') },
                    { href: `${NavigationSubRoutes.ZOZNAM_ZASADNUTI_DETAIL}/${meetingId}`, label: `${meetingDetailData?.name}` },
                ]}
            />
            <MainContentWrapper>
                <MeetingDetailBaseInfo infoData={meetingDetailData} />
            </MainContentWrapper>
        </>
    )
}
export default MeetingDetailView
