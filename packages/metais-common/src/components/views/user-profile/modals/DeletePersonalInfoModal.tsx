import { BaseModal, Input, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import styles from './modals.module.scss'

import { ClaimEvent } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type DeletePersonalInfoForm = {
    password: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    mutateCallback: (data: ClaimEvent) => Promise<boolean>
    isLoading: boolean
}

export const DeletePersonalInfoModal: React.FC<Props> = ({ isOpen, onClose, mutateCallback, isLoading }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const {
        handleSubmit,
        register,
        formState: { isValidating, isSubmitting, errors },
        setError,
    } = useForm<DeletePersonalInfoForm>()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (formData: DeletePersonalInfoForm) => {
        const resp = await mutateCallback({
            type: 'CREATE_EVENT',
            claimUi: {
                createdBy: user?.uuid,
                email: user?.email,
                position: user?.position,
                telephone: user?.mobile,
                identityFirstName: user?.firstName,
                identityLastName: user?.lastName,
                identityLogin: user?.login,
                name: 'GDPR',
                password: formData.password,
            },
        })
        if (!resp) {
            setError('password', { message: t('userProfile.deletePersonalInfo.invalidPassword') })
        }
    }

    return (
        <BaseModal widthInPx={640} isOpen={isOpen} close={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.div}>
                    <TextHeading size="L">{t('userProfile.deletePersonalInfo.heading')}</TextHeading>
                    <TextBody>{t('userProfile.deletePersonalInfo.description')}</TextBody>

                    <Input
                        label={t('userProfile.deletePersonalInfo.password')}
                        {...register('password')}
                        error={errors.password?.message}
                        placeholder={t('userProfile.deletePersonalInfo.passwordPlaceholder')}
                        type="password"
                    />
                </div>
                <ModalButtons
                    submitButtonLabel={t('userProfile.deletePersonalInfo.submit')}
                    closeButtonLabel={t('userProfile.requests.cancel')}
                    onClose={onClose}
                    isLoading={isValidating || isSubmitting || isLoading}
                />
            </form>
        </BaseModal>
    )
}
