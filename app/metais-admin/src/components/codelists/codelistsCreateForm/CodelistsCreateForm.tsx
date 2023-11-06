import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CheckBox, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CodelistEnum, codeListCreateSchema } from './codeListCreateSchema'
import styles from './codelistsCreateForm.module.scss'
interface Props {
    onSubmit: (formData: FieldValues) => void
    isLoading: boolean
    closeModal: () => void
}

export const CodelistsCreateForm: React.FC<Props> = ({ onSubmit, isLoading, closeModal }) => {
    const { t } = useTranslation()
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({ resolver: yupResolver(codeListCreateSchema(t)) })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.center}>
                <TextHeading size="L">{t('codelists.createNewCodelist')}</TextHeading>
            </div>
            <Input error={errors[CodelistEnum.CODE]?.message} label={t('codelists.code')} {...register(CodelistEnum.CODE)} />
            <Input error={errors[CodelistEnum.NAME]?.message} label={t('codelists.name')} {...register(CodelistEnum.NAME)} />
            <TextArea
                error={errors[CodelistEnum.DESCRIPTION]?.message}
                rows={3}
                label={t('codelists.description')}
                {...register(CodelistEnum.DESCRIPTION)}
            />
            <SimpleSelect
                label={t('codelists.category')}
                name={CodelistEnum.CATEGORY}
                options={[
                    { label: '-', value: '' },
                    { label: 'LICENSE', value: 'LICENSE' },
                ]}
                setValue={setValue}
                clearErrors={clearErrors}
            />
            <div className={styles.marginBottom}>
                <CheckBox label={t('codelists.valid')} id="valid" {...register(CodelistEnum.VALIDITY)} />
            </div>
            <SubmitWithFeedback
                submitButtonLabel={t('codelists.createNewCodelist')}
                loading={isLoading}
                additionalButtons={[<Button key={1} variant="secondary" label={t('codelists.cancel')} onClick={closeModal} />]}
            />
        </form>
    )
}
