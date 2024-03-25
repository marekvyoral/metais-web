import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBox, GridCol, GridRow, Input, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiAutoincrementTypeType } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { UseFormRegister, UseFormSetValue, UseFormClearErrors, FormState } from 'react-hook-form'

import styles from './requestList.module.scss'

import { IRequestForm } from '@/componentHelpers/requests'
import { RequestFormEnum } from '@/components/views/requestLists/CreateRequestView'

type AutoIncrementProps = {
    register: UseFormRegister<IRequestForm>
    setValue: UseFormSetValue<IRequestForm>
    clearErrors: UseFormClearErrors<IRequestForm>
    formState: FormState<IRequestForm>
    autoIncrement: string
    isAutoIncremenetValid: boolean
}

export const AutoIncrement: React.FC<AutoIncrementProps> = ({ register, setValue, clearErrors, formState, autoIncrement, isAutoIncremenetValid }) => {
    const { t } = useTranslation()
    const typeOptions = Object.keys(ApiAutoincrementTypeType).map((option) => ({ label: t(`autoincrement.type.${option}`), value: option }))

    return (
        <fieldset className={styles.fieldset}>
            <legend className="govuk-visually-hidden">{t('autoincrement.legend')}</legend>
            <Input
                {...register(RequestFormEnum.PREFIX)}
                error={formState.errors[RequestFormEnum.PREFIX]?.message}
                label={t('autoincrement.prefix')}
                required
            />
            <GridRow className={styles.row}>
                <GridCol setWidth="one-third" className={styles.checkbox}>
                    <CheckBox {...register(RequestFormEnum.AUTOINCREMENT_VALID)} label={t('autoincrement.valid')} />
                </GridCol>

                <GridCol setWidth="one-third">
                    <SimpleSelect
                        setValue={setValue}
                        options={typeOptions}
                        clearErrors={clearErrors}
                        name={RequestFormEnum.AUTOINCREMENT_TYPE}
                        label={t('autoincrement.type.label')}
                        disabled={!isAutoIncremenetValid}
                        defaultValue={formState?.defaultValues?.type}
                        isClearable={false}
                    />
                </GridCol>
                <GridCol setWidth="one-third">
                    <Input
                        {...register(RequestFormEnum.AUTOINCREMENT_CHAR_COUNT)}
                        type="number"
                        label={t('autoincrement.charCount')}
                        //maxLength or min/max does not prevent user to add numbers using keyboard
                        onInput={(e) => (e.currentTarget.value = e.currentTarget.value.slice(0, 1))}
                        disabled={!isAutoIncremenetValid}
                    />
                </GridCol>
            </GridRow>

            <TextBody className={styles.grey}>{t('autoincrement.preview', { autoincrement: autoIncrement })}</TextBody>
        </fieldset>
    )
}
