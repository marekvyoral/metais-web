import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EditableUserInformation } from './EditableUserInformation'
import { UserInformation } from './UserInformation'

import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'

export const UserInformationPage = () => {
    const { t } = useTranslation()
    const [isEditable, setIsEditable] = useState(false)
    const [isChangeSuccess, setIsChangeSuccess] = useState(false)
    return (
        <div>
            <MutationFeedback
                success={isChangeSuccess}
                successMessage={t('userProfile.changedUserInformation')}
                onMessageClose={() => setIsChangeSuccess(false)}
            />
            {isEditable && <EditableUserInformation setIsEditable={setIsEditable} setIsChangeSuccess={setIsChangeSuccess} />}
            {!isEditable && <UserInformation setIsEditable={setIsEditable} setIsChangeSuccess={setIsChangeSuccess} />}
        </div>
    )
}
