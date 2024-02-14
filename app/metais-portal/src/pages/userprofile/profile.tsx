import React, { useState } from 'react'
import { BreadCrumbs, Button, ButtonGroupRow, HomeIcon, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { UserPreferencesPage } from '@isdd/metais-common/components/views/user-profile/user-preferences/UserPreferencesPage'
import { UserRightsPage } from '@isdd/metais-common/components/views/user-profile/user-rights/UserRightsPage'
import { UserNotificationsSettings } from '@isdd/metais-common/components/views/user-profile/user-notifications/UserNotificationsSettings'
import { UserPasswordChangePage } from '@isdd/metais-common/components/views/user-profile/UserPasswordChangePage'
import { UserProfileRequestRightsModal } from '@isdd/metais-common/src/components/views/user-profile/modals/UserProfileRequestRightsModal'
import { UserWizards } from '@isdd/metais-common/components/views/user-profile/UserWizards'
import { ClaimEvent, useProcessEvent, useReadList1 } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { DeletePersonalInfoModal } from '@isdd/metais-common/src/components/views/user-profile/modals/DeletePersonalInfoModal'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { ciInformationTab } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { UserInformationPage } from '@isdd/metais-common/components/views/user-profile/user-informations/UserInformationPage'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { UserTrainingsPage } from '@/components/views/trainings/UserTrainingsPage'

const UserProfilePage = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('userProfile.heading'))
    const [isRightsSettingsModalOpen, setIsRightsSettingsModalOpen] = useState(false)
    const [isDeletePersonalInfoModalOpen, setIsDeletePersonalInfoModalOpen] = useState(false)
    const {
        state: { user },
    } = useAuth()
    const { mutateAsync: rightsRequestMutate, isLoading, isError } = useProcessEvent()
    const {
        data: claimsList,
        isLoading: isReadLoading,
        isError: isReadError,
        refetch,
    } = useReadList1({ createdBy: user?.uuid ?? '', name: 'GDPR', state: 'WAITING' })

    const [updateSuccess, setUpdateSuccess] = useState(false)

    const processRequestMutation = async (data: ClaimEvent): Promise<boolean> => {
        return await rightsRequestMutate({
            data: data,
        }).then((resp) => {
            if (resp.resultCode == 0) {
                setIsRightsSettingsModalOpen(false)
                setIsDeletePersonalInfoModalOpen(false)
                setUpdateSuccess(true)
                refetch()
                return true
            } else {
                return false
            }
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
            id: 'trainings',
            title: t('userProfile.trainings'),
            content: <UserTrainingsPage />,
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
        {
            id: 'wizards',
            title: t('userProfile.wizards'),
            content: <UserWizards />,
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
                <QueryFeedback error={isReadError} loading={isReadLoading}>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('userProfile.heading')}</TextHeading>
                        <MutationFeedback
                            success={updateSuccess}
                            error={isError}
                            successMessage={t('mutationFeedback.successfulCreated')}
                            onMessageClose={() => setUpdateSuccess(false)}
                        />
                    </FlexColumnReverseWrapper>
                    <ButtonGroupRow>
                        <Button label={t('userProfile.requests.rightsSettings')} onClick={() => setIsRightsSettingsModalOpen(true)} />
                        <Button
                            disabled={(claimsList?.length ?? 0) > 0}
                            variant="secondary"
                            label={t('userProfile.requests.deletePersonalInfo')}
                            onClick={() => setIsDeletePersonalInfoModalOpen(true)}
                        />
                    </ButtonGroupRow>

                    <Tabs tabList={tabList} />
                </QueryFeedback>
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
