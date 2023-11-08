import { BaseModal, Button, Input, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './modals.module.scss'

import { SubmitWithFeedback } from '@isdd/metais-common/components/submit-with-feedback/SubmitWithFeedback'
import { ClaimEvent } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type DeletePersonalInfoForm = {
    password: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    mutateCallback: (data: ClaimEvent) => void
    isLoading: boolean
}

export const DeletePersonalInfoModal: React.FC<Props> = ({ isOpen, onClose, mutateCallback, isLoading }) => {
    const { t } = useTranslation()
    const { userInfo: user } = useAuth()
    const {
        handleSubmit,
        register,
        formState: { isValidating, isSubmitting, errors },
    } = useForm<DeletePersonalInfoForm>()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = (formData: DeletePersonalInfoForm) => {
        //PASSWORD waiting for BE
        mutateCallback({
            type: 'CREATE_EVENT',
            claimUi: {
                createdBy: user?.uuid,
                email: user?.email,
                position: user?.position,
                telephone: user?.phone,
                identityFirstName: user?.firstName,
                identityLastName: user?.lastName,
                identityLogin: user?.login,
                name: 'GDPR',
            },
        })
    }

    return (
        <BaseModal widthInPx={640} isOpen={isOpen} close={onClose}>
            <div className={styles.div}>
                <TextHeading size="L">{t('userProfile.deletePersonalInfo.heading')}</TextHeading>
                <TextBody>{t('userProfile.deletePersonalInfo.description')}</TextBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label={t('userProfile.deletePersonalInfo.password')}
                        {...register('password')}
                        error={errors.password?.message}
                        placeholder={t('userProfile.deletePersonalInfo.passwordPlaceholder')}
                        type="password"
                    />
                </form>
                <SubmitWithFeedback
                    className={styles.noMarginButtons}
                    variant="warning"
                    submitButtonLabel={t('userProfile.deletePersonalInfo.submit')}
                    additionalButtons={[
                        <Button key="cancelButton" variant="secondary" type="reset" label={t('userProfile.requests.cancel')} onClick={onClose} />,
                    ]}
                    //PASSWORD waiting for BE
                    disabled
                    loading={isValidating || isSubmitting || isLoading}
                />
            </div>
        </BaseModal>
    )
}
