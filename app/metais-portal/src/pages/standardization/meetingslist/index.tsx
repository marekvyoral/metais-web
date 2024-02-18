import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { MeetingsListContainer } from '@/components/containers/standardization/meetings/MeetingsListContainer'

const MeetingsListPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.meetings')} ${META_IS_TITLE}`

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('navMenu.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('navMenu.lists.meetings'), href: NavigationSubRoutes.ZOZNAM_ZASADNUTI },
                ]}
            />
            <MainContentWrapper>
                <TextHeading size="XL">{t('navMenu.lists.meetings')}</TextHeading>
                <MeetingsListContainer />
            </MainContentWrapper>
        </>
    )
}

export default MeetingsListPage
