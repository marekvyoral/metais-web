import React, { useState } from 'react'
import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { UserPreferencesPage } from '@isdd/metais-common/components/views/user-profile/user-preferences/UserPreferencesPage'
import { UserRightsPage } from '@isdd/metais-common/components/views/user-profile/user-rights/UserRightsPage'
import { UserNotificationsSettings } from '@isdd/metais-common/components/views/user-profile/UserNotificationsSettings'
import { UserPasswordChangePage } from '@isdd/metais-common/components/views/user-profile/UserPasswordChangePage'
import { UserProfileRequestRightsModal } from '@isdd/metais-common/src/components/views/user-profile/modals/UserProfileRequestRightsModal'
import { ClaimEvent, useProcessEvent } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { DeletePersonalInfoModal } from '@isdd/metais-common/src/components/views/user-profile/modals/DeletePersonalInfoModal'
import { MutationFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { ciInformationTab } from '@isdd/metais-common/constants'

import { UserInformationPage } from '../../../../../packages/metais-common/src/components/views/user-profile/user-informations/UserInformationPage'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const UserProfilePage = () => {
    const { t } = useTranslation()
    const [isRightsSettingsModalOpen, setIsRightsSettingsModalOpen] = useState(false)
    const [isDeletePersonalInfoModalOpen, setIsDeletePersonalInfoModalOpen] = useState(false)

    const { mutate: rightsRequestMutate, isLoading, isError, isSuccess } = useProcessEvent()

    const processRequestMutation = (data: ClaimEvent) => {
        rightsRequestMutate({
            data: data,
        })
    }

    const tabList: Tab[] = [
        {
            id: ciInformationTab,
            title: t('userProfile.information.header'),
            content: <UserInformationPage />,
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
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">{t('userProfile.heading')}</TextHeading>
                    <MutationFeedback success={isSuccess} error={isError} />
                </FlexColumnReverseWrapper>
                <ButtonGroupRow>
                    <Button label={t('userProfile.requests.rightsSettings')} onClick={() => setIsRightsSettingsModalOpen(true)} />
                    <Button
                        variant="secondary"
                        label={t('userProfile.requests.deletePersonalInfo')}
                        onClick={() => setIsDeletePersonalInfoModalOpen(true)}
                    />
                </ButtonGroupRow>

                <Tabs tabList={tabList} />
            </MainContentWrapper>
            <UserProfileRequestRightsModal
                isLoading={isLoading}
                mutateCallback={processRequestMutation}
                isOpen={isRightsSettingsModalOpen}
                onClose={() => setIsRightsSettingsModalOpen(false)}
            />
            <DeletePersonalInfoModal
                isLoading={isLoading}
                mutateCallback={processRequestMutation}
                isOpen={isDeletePersonalInfoModalOpen}
                onClose={() => setIsDeletePersonalInfoModalOpen(false)}
            />
        </>
    )
}

export default UserProfilePage
