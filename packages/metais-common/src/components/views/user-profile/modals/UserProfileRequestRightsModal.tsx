import { yupResolver } from '@hookform/resolvers/yup'
import { BaseModal, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { object, string } from 'yup'

import styles from './modals.module.scss'
import { SelectImplicitHierarchy } from './SelectImplicitHierarchy'

import { ModalButtons } from '@isdd/metais-common/components/modal-buttons/ModalButtons'
import { ClaimEvent } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export enum RequestFormFields {
    PO = 'po',
    MOBILE = 'mobile',
    EMAIL = 'email',
    DESCRIPTION = 'description',
}

export type UserRequestRightsForm = {
    [RequestFormFields.PO]: string
    [RequestFormFields.MOBILE]: string
    [RequestFormFields.EMAIL]: string
    [RequestFormFields.DESCRIPTION]: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    mutateCallback: (data: ClaimEvent) => Promise<boolean>
    isLoading: boolean
}

export const UserProfileRequestRightsModal: React.FC<Props> = ({ isOpen, onClose, mutateCallback, isLoading }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [sendError, setSendError] = useState<string>()
    const requiredString = ` (${t('userProfile.requests.required')})`

    const schema = object().shape({
        [RequestFormFields.PO]: string().required(t('userProfile.requests.poRequired')),
        [RequestFormFields.MOBILE]: string().required(t('userProfile.requests.phoneRequired')),
        [RequestFormFields.EMAIL]: string().required(t('userProfile.requests.emailRequired')),
        [RequestFormFields.DESCRIPTION]: string().required(t('userProfile.requests.descriptionRequired')),
    })

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitting, isValidating },
    } = useForm<UserRequestRightsForm>({
        resolver: yupResolver(schema),
    })

    useEffect(() => {
        if (user?.uuid) {
            setValue(RequestFormFields.EMAIL, user?.email ?? '')
            setValue(RequestFormFields.MOBILE, user?.mobile ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uuid])

    const onSubmit = async (formData: UserRequestRightsForm) => {
        const resp = await mutateCallback({
            type: 'CREATE_EVENT',
            claimUi: {
                createdBy: user?.uuid,
                po: formData?.[RequestFormFields.PO],
                mobile: formData?.[RequestFormFields.MOBILE],
                email: formData?.[RequestFormFields.EMAIL],
                description: formData?.[RequestFormFields.DESCRIPTION],
            },
        })
        if (!resp) {
            setSendError(t('feedback.mutationErrorMessage'))
        }
    }

    return (
        <BaseModal widthInPx={640} isOpen={isOpen} close={onClose}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.div}>
                    <TextHeading size="L">{t('userProfile.requests.rightsSettings')}</TextHeading>

                    <SelectImplicitHierarchy
                        setValue={setValue}
                        error={errors[RequestFormFields.PO]?.message}
                        clearErrors={clearErrors}
                        requiredString={requiredString}
                    />
                    <Input
                        label={t('userProfile.requests.phone') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        defaultValue={user?.mobile}
                        error={errors[RequestFormFields.MOBILE]?.message}
                        {...register(RequestFormFields.MOBILE)}
                        type="tel"
                    />
                    <Input
                        label={t('userProfile.requests.email') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        defaultValue={user?.email}
                        error={errors[RequestFormFields.EMAIL]?.message}
                        {...register(RequestFormFields.EMAIL)}
                        type="email"
                    />
                    <TextArea
                        rows={3}
                        label={t('userProfile.requests.description') + requiredString}
                        placeholder={t('userProfile.requests.placeholder')}
                        error={errors[RequestFormFields.DESCRIPTION]?.message}
                        {...register(RequestFormFields.DESCRIPTION)}
                    />
                    <MutationFeedback error={!!sendError} errorMessage={sendError} onMessageClose={() => setSendError(undefined)} />
                </div>
                <ModalButtons
                    submitButtonLabel={t('userProfile.requests.submit')}
                    isLoading={isSubmitting || isValidating || isLoading}
                    closeButtonLabel={t('userProfile.requests.cancel')}
                    onClose={onClose}
                />
            </form>
        </BaseModal>
    )
}
