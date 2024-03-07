import React from 'react'
import { BaseModal, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { ModalButtons } from '@isdd/metais-common/index'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import * as yup from 'yup'
import { REGEX_EMAIL } from '@isdd/metais-common/constants'
import { yupResolver } from '@hookform/resolvers/yup'
import { TFunction } from 'i18next'

interface iDraftListCreateFormDialog {
    openCreateFormDialog?: FieldValues
    closeCreateFormDialog: () => void
    handleSubmit: (values: FieldValues, name?: string, email?: string, capthcaToken?: string) => Promise<void>
}

const formSchema = (t: TFunction<'translation', undefined, 'translation'>) =>
    yup
        .object({
            name: yup
                .string()
                .trim()
                .test('name', t('validation.invalidFullname'), (val) => val?.includes(' ')),
            email: yup.string().matches(REGEX_EMAIL, t('validation.invalidEmail')).required(t('validation.required')),
        })
        .defined()

export const DraftListCreateFormDialog = ({ openCreateFormDialog, closeCreateFormDialog, handleSubmit }: iDraftListCreateFormDialog) => {
    const { t } = useTranslation()
    const {
        register,
        handleSubmit: handleDialogSubmit,
        formState: { errors },
    } = useForm({ defaultValues: { name: '', email: '' }, resolver: yupResolver(formSchema(t)) })
    const { executeRecaptcha } = useGoogleReCaptcha()

    const onSubmit = async (values: FieldValues) => {
        if (!executeRecaptcha) {
            return
        }

        const capthcaToken = await executeRecaptcha()
        if (capthcaToken) {
            handleSubmit(openCreateFormDialog ?? {}, values['name'], values['email'], capthcaToken)
            closeCreateFormDialog()
        }
    }

    return (
        <BaseModal isOpen={!!openCreateFormDialog} close={closeCreateFormDialog}>
            <form onSubmit={handleDialogSubmit(onSubmit)} noValidate>
                <div className={styles.modalContainer}>
                    <div>
                        <TextHeading size={'L'} className={styles.heading}>
                            {t(`DraftsList.createForm.userHeading`)}
                        </TextHeading>

                        <Input {...register('name')} label={t('DraftsList.createForm.name')} error={errors['name']?.message} required />
                        <Input {...register('email')} label={t('DraftsList.createForm.email')} error={errors['email']?.message} required />
                    </div>
                </div>
                <ModalButtons submitButtonLabel={t('DraftsList.header.changeState.submit')} onClose={closeCreateFormDialog} />
            </form>
        </BaseModal>
    )
}
