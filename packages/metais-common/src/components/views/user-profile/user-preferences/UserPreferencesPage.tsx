import { CheckBox } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import styles from './userPreferences.module.scss'

import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import {
    IUserPreferences,
    UpdatePreferencesReturnEnum,
    useUserPreferences,
} from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { MutationFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'

enum UserPreferencesFormNamesEnum {
    SHOW_INVALIDATED = 'showInvalidatedItems',
}

export const UserPreferencesPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()
    const location = useLocation()
    const { currentPreferences, updateUserPreferences } = useUserPreferences()
    const [hasError, setHasError] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, isValidating },
    } = useForm<IUserPreferences>({ defaultValues: currentPreferences })

    const onSubmit = (formData: IUserPreferences) => {
        setHasError(false)
        const update = updateUserPreferences(formData)
        if (update === UpdatePreferencesReturnEnum.SUCCESS) {
            setIsActionSuccess({ value: true, path: location.pathname })
            return
        } else if (update === UpdatePreferencesReturnEnum.ERROR) {
            setHasError(true)
            return
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <MutationFeedback success={isActionSuccess.value} error={hasError} successMessage={t('userProfile.userPreferencesSuccess')} />
            <div className={styles.marginBottom}>
                <CheckBox
                    label={t('userProfile.showInvalidated')}
                    id="show-invalidated"
                    {...register(UserPreferencesFormNamesEnum.SHOW_INVALIDATED)}
                />
            </div>
            <SubmitWithFeedback submitButtonLabel={t('userProfile.savePreferences')} loading={isSubmitting || isValidating} />
        </form>
    )
}
