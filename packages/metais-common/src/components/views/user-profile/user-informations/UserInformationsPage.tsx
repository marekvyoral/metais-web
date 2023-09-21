import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { EditableUserInformations } from './EditableUserInformations'
import { UserInformations } from './UserInformations'

import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'

export const UserInformationsPage = () => {
    const { t } = useTranslation()
    const [isEditable, setIsEditable] = useState(false)
    const [isChangeSuccess, setIsChangeSuccess] = useState(false)
    return (
        <div>
            <MutationFeedback success={isChangeSuccess} error={false} successMessage={t('userProfile.changedUserInformation')} />
            {isEditable && <EditableUserInformations setIsEditable={setIsEditable} setIsChangeSuccess={setIsChangeSuccess} />}
            {!isEditable && <UserInformations setIsEditable={setIsEditable} setIsChangeSuccess={setIsChangeSuccess} />}
        </div>
    )
}
