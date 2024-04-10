import { yupResolver } from '@hookform/resolvers/yup'
import { CheckBox, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ModalButtons, MutationFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'

import { CodelistEnum, codeListCreateSchema } from './codeListCreateSchema'
import styles from './codelistsCreateForm.module.scss'
interface Props {
    onSubmit: (formData: FieldValues) => void
    isLoading: boolean
    closeModal: () => void
    errorType?: string
}

export const CodelistsCreateForm: React.FC<Props> = ({ onSubmit, isLoading, closeModal, errorType }) => {
    const { t } = useTranslation()
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({ resolver: yupResolver(codeListCreateSchema(t)) })
    const [mutationError, setMutationError] = useState<string>()
    useEffect(() => {
        if (errorType == ReponseErrorCodeEnum.GNR500) {
            setError(CodelistEnum.CODE, { message: t('feedback.codeAlreadyExists') })
        } else if (errorType) {
            setMutationError(t('feedback.queryErrorMessage'))
        }
    }, [errorType, setError, t])

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.center}>
                <TextHeading size="L">{t('codelists.createNewCodelist')}</TextHeading>
            </div>
            <MutationFeedback error={!!mutationError} errorMessage={mutationError} onMessageClose={() => setMutationError('')} />
            <Input error={errors[CodelistEnum.CODE]?.message} label={t('codelists.code')} {...register(CodelistEnum.CODE)} required />
            <Input error={errors[CodelistEnum.NAME]?.message} label={t('codelists.name')} {...register(CodelistEnum.NAME)} required />
            <TextArea
                error={errors[CodelistEnum.DESCRIPTION]?.message}
                rows={3}
                label={t('codelists.description')}
                {...register(CodelistEnum.DESCRIPTION)}
                required
            />
            <div className={styles.marginBottom}>
                <CheckBox label={t('codelists.valid')} id="valid" {...register(CodelistEnum.VALIDITY)} />
            </div>

            <ModalButtons
                isLoading={isLoading}
                submitButtonLabel={t('codelists.createNewCodelist')}
                closeButtonLabel={t('codelists.cancel')}
                onClose={closeModal}
            />
        </form>
    )
}
