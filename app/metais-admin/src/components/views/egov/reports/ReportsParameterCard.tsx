import { CheckBox, Input, SimpleSelect, TransparentButtonWrapper } from '@isdd/idsk-ui-kit/index'
import { ParameterType } from '@isdd/metais-common/api/generated/report-swagger'
import { CloseIcon } from '@isdd/metais-common/assets/images'
import classNames from 'classnames'
import React from 'react'
import { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { IReportFormData } from './ReportsDetail'
import styles from './reportsParameterCard.module.scss'

export interface IReportCardFormData {
    id?: number
    identificator?: string
    parameterType?: ParameterType
    name?: string
    defaultValue?: string
    required?: boolean
    additionalParams?: string
}
interface IReportsParameterCardProps {
    data?: IReportCardFormData
    index: number
    formStateErrors: FieldErrors<IReportFormData>
    register: UseFormRegister<IReportFormData>
    removeParameter: (index: number) => void
    setValue: UseFormSetValue<IReportFormData>
    clearErrors: UseFormClearErrors<IReportFormData>
}
const parameterTypes = Object.values(ParameterType).map((parameterType) => {
    return { value: parameterType, label: parameterType }
})

export const ReportsParameterCard: React.FC<IReportsParameterCardProps> = ({
    data,
    index,
    formStateErrors,
    register,
    removeParameter,
    setValue,
    clearErrors,
}) => {
    const { t } = useTranslation()

    const onClick = () => {
        removeParameter(index)
    }

    return (
        <div className={classNames([styles.itemBox], { [styles.errorItemBox]: status === 'INVALIDATED' })}>
            <div className={styles.closeButton}>
                <TransparentButtonWrapper onClick={onClick} aria-label={t('report.cards.close')}>
                    <img src={CloseIcon} alt="" />
                </TransparentButtonWrapper>
            </div>
            <Input
                label={t('report.cards.identificator')}
                id={`report.cards.${index}.identificator`}
                {...register(`report.cards.${index}.identificator`)}
                error={formStateErrors.report?.cards?.[index]?.identificator?.message}
            />
            <SimpleSelect
                id={`report.cards.${index}.parameterType`}
                name={`report.cards.${index}.parameterType`}
                label={t('report.cards.parameterType')}
                options={parameterTypes}
                defaultValue={data?.parameterType}
                setValue={setValue}
                error={formStateErrors.report?.cards?.[index]?.parameterType?.message}
                clearErrors={clearErrors}
            />
            <Input
                label={t('report.cards.name')}
                id={`report.cards.${index}.name`}
                {...register(`report.cards.${index}.name`)}
                error={formStateErrors.report?.cards?.[index]?.name?.message}
            />
            <Input
                label={t('report.cards.defaultValue')}
                id={`report.cards.${index}.defaultValue`}
                {...register(`report.cards.${index}.defaultValue`)}
            />
            <div className="govuk-form-group">
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label={t('report.cards.required')}
                        id={`report.cards.${index}.required`}
                        {...register(`report.cards.${index}.required`)}
                        checked={data?.required}
                    />
                </div>
            </div>
            <Input label={t('report.cards.additionalParams')} {...register(`report.cards.${index}.additionalParams`)} />
        </div>
    )
}
