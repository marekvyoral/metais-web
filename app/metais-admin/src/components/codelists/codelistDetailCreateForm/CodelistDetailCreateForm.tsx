import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { MutationFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
    const order = (data?.enumItems?.length || 0) + 1
    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm({
        resolver: yupResolver(codeListDetailCreateSchema(t, data?.enumItems?.map((item) => item.code) || [])),
        defaultValues: { [CodelistDetailEnum.ORDER]: order },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.center}>
                <TextHeading size="L">{t('codelists.addNewCodelistDetail')}</TextHeading>
            </div>
            <MutationFeedback success={false} error={resultCreateEnum.message} />
            <Input error={errors[CodelistDetailEnum.ORDER]?.message} label={t('codelists.order')} {...register(CodelistDetailEnum.ORDER)} disabled />
            <Input
                error={errors[CodelistDetailEnum.CODE]?.message || resultCreateEnum.message}
                label={t('codelists.code')}
                {...register(CodelistDetailEnum.CODE)}
            />

            <Input error={errors[CodelistDetailEnum.VALUE]?.message} label={t('codelists.value')} {...register(CodelistDetailEnum.VALUE)} />
            <Input
                error={errors[CodelistDetailEnum.ENG_VALUE]?.message}
                label={t('codelists.engValue')}
                {...register(CodelistDetailEnum.ENG_VALUE)}
            />
            <TextArea
                error={errors[CodelistDetailEnum.DESCRIPTION]?.message}
                rows={3}
                label={t('codelists.description')}
                {...register(CodelistDetailEnum.DESCRIPTION)}
            />
            <TextArea
                error={errors[CodelistDetailEnum.ENG_DESCRIPTION]?.message}
                rows={3}
                label={t('codelists.engDescription')}
                {...register(CodelistDetailEnum.ENG_DESCRIPTION)}
            />
            <SubmitWithFeedback
                submitButtonLabel={t('codelists.save')}
                loading={isLoading}
                additionalButtons={[
                    <Button
                        key={1}
                        variant="secondary"
                        label={t('codelists.cancel')}
                        onClick={() => {
                            clearErrors()
                            setResultCreateEnum({ isError: false, isSuccess: false, message: '' })
                            closeModal()
                        }}
                    />,
                ]}
            />
        </form>
    )
}
