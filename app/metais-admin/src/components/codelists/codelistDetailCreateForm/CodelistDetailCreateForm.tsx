import { yupResolver } from '@hookform/resolvers/yup'
import { Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { CodelistDetailEnum, codeListDetailCreateSchema } from './codeListDetailCreateSchema'
import styles from './codelistDetailCreateForm.module.scss'

import { IResultCreateEnum } from '@/components/codelists/codelistsTable/CodeListDetailTable'

interface Props {
    onSubmit: (formData: FieldValues) => void
    closeModal: () => void
    data: EnumType | undefined
    resultCreateEnum: IResultCreateEnum
    isLoading: boolean
    setResultCreateEnum: React.Dispatch<IResultCreateEnum>
}

export const CodelistDetailCreateForm: React.FC<Props> = ({ onSubmit, closeModal, data, resultCreateEnum, isLoading, setResultCreateEnum }) => {
    const { t } = useTranslation()
    const { enumCode } = useParams()
    const order = (data?.enumItems?.length || 0) + 1
    const code = 'c_' + enumCode?.toLowerCase() + '.' + order
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm({
        resolver: yupResolver(codeListDetailCreateSchema(t, data?.enumItems?.map((item) => item.code) || [])),
        defaultValues: { [CodelistDetailEnum.ORDER]: order, [CodelistDetailEnum.CODE]: code },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.center}>
                <TextHeading size="L">{t('codelists.addNewCodelistDetail')}</TextHeading>
            </div>
            <QueryFeedback
                loading={isLoading}
                error={resultCreateEnum.isError}
                {...(!!resultCreateEnum?.message && { errorProps: { errorMessage: resultCreateEnum.message } })}
                withChildren
            >
                <Input
                    error={errors[CodelistDetailEnum.ORDER]?.message}
                    label={t('codelists.order')}
                    {...register(CodelistDetailEnum.ORDER)}
                    disabled
                />
                <Input error={errors[CodelistDetailEnum.CODE]?.message} label={t('codelists.code')} {...register(CodelistDetailEnum.CODE)} required />
                <Input
                    error={errors[CodelistDetailEnum.VALUE]?.message}
                    label={t('codelists.value')}
                    {...register(CodelistDetailEnum.VALUE)}
                    required
                />
                <Input
                    error={errors[CodelistDetailEnum.ENG_VALUE]?.message}
                    label={t('codelists.engValue')}
                    {...register(CodelistDetailEnum.ENG_VALUE)}
                    required
                />
                <TextArea
                    error={errors[CodelistDetailEnum.DESCRIPTION]?.message}
                    rows={3}
                    label={t('codelists.description')}
                    {...register(CodelistDetailEnum.DESCRIPTION)}
                    required
                />
                <TextArea
                    error={errors[CodelistDetailEnum.ENG_DESCRIPTION]?.message}
                    rows={3}
                    label={t('codelists.engDescription')}
                    {...register(CodelistDetailEnum.ENG_DESCRIPTION)}
                    required
                />

                <ModalButtons
                    isLoading={isLoading}
                    submitButtonLabel={t('codelists.save')}
                    closeButtonLabel={t('codelists.cancel')}
                    onClose={() => {
                        clearErrors()
                        setResultCreateEnum({ isError: false, isSuccess: false, message: '' })
                        closeModal()
                    }}
                />
            </QueryFeedback>
        </form>
    )
}
