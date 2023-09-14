import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { EkoCode, EkoCodeEkoCodeState } from '@isdd/metais-common/api'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'

import { useValidationSchemaForm } from './hooks/useValidationSchemaForm'

import { IEkoCreateView, IForm } from '@/components/views/eko/ekoCodes'
import { IResultApiCall } from '@/components/views/eko/ekoHelpers'
import styles from '@/components/views/eko/ekoView.module.scss'

export const EkoCreateView = ({ data, mutate, editData, isError, isLoading }: IEkoCreateView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { schema } = useValidationSchemaForm(data)

    const { register, handleSubmit, formState } = useForm<IForm>({ resolver: yupResolver(schema) })
    const [resultApiCall, setResultApiCall] = useState<IResultApiCall>({
        isError: false,
        isSuccess: false,
        message: undefined,
    })
    const onSubmit = useCallback(
        async (formData: FieldValues) => {
            const ekoCode: EkoCode = { name: formData.name, ekoCode: formData.ekoCode, ekoCodeState: EkoCodeEkoCodeState.ACTIVE }
            await mutate(ekoCode)
                .then(() => {
                    setResultApiCall({ isError: false, isSuccess: true, message: undefined })
                })
                .catch((mutationError) => {
                    const errorResponse = JSON.parse(mutationError.message)
                    setResultApiCall({
                        isError: true,
                        isSuccess: false,
                        message:
                            errorResponse?.type === ReponseErrorCodeEnum.GNR403
                                ? t(`errors.${ReponseErrorCodeEnum.GNR403}`)
                                : t(`errors.${ReponseErrorCodeEnum.DEFAULT}`),
                    })
                })
        },
        [mutate, t],
    )
    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                {editData ? <h2 className="govuk-heading-l">{t('eko.editCode')}</h2> : <h2 className="govuk-heading-l">{t('eko.createdCode')}</h2>}
                {(resultApiCall.isError || resultApiCall.isSuccess) && (
                    <MutationFeedback error={resultApiCall.message} success={resultApiCall.isSuccess} />
                )}
                {isError && <QueryFeedback error loading={false} />}
            </FlexColumnReverseWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
                <>
                    <div>
                        {editData && (
                            <div className={styles.elementGroup}>
                                <h4 className="govuk-heading-m govuk-!-margin-right-8">{t('eko.selectedCode')}</h4>
                                <Link to={`/eko/${editData.ekoCode}`} className="govuk-link govuk-!-font-size-24">
                                    {editData.name}
                                </Link>
                            </div>
                        )}
                        <div>
                            <Input
                                type="text"
                                label={t('eko.name')}
                                defaultValue={editData?.name || ''}
                                required
                                {...register('name')}
                                error={formState.errors.name?.message}
                            />
                        </div>
                        <div>
                            <Input
                                type="number"
                                label={t('eko.ekoCode')}
                                defaultValue={editData?.ekoCode || ''}
                                required
                                {...register('ekoCode')}
                                error={formState.errors.ekoCode?.message}
                            />
                        </div>
                    </div>
                    <div className={styles.elementGroup}>
                        <div className={styles.buttonsGroupItem}>
                            <Button
                                variant="secondary"
                                label={t('eko.cancel')}
                                onClick={() => {
                                    navigate('/eko')
                                }}
                            />
                        </div>
                        <div className={styles.buttonsGroupItem}>
                            <Button type="submit" label={t('eko.save')} />
                        </div>
                    </div>
                </>
            </form>
        </QueryFeedback>
    )
}
