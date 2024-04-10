import React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckBox, GridCol, GridRow, Input, TextBody } from '@isdd/idsk-ui-kit/index'
import { UseFormRegister, FormState } from 'react-hook-form'

import styles from './requestList.module.scss'

import { IRequestForm } from '@/componentHelpers/requests'
import { RequestFormEnum } from '@/components/views/requestLists/CreateRequestView'

type AutoIncrementProps = {
    register: UseFormRegister<IRequestForm>
    formState: FormState<IRequestForm>
    autoIncrement: string
    isAutoIncremenetValid: boolean
}

export const AutoIncrement: React.FC<AutoIncrementProps> = ({ register, formState, autoIncrement, isAutoIncremenetValid }) => {
    const { t } = useTranslation()

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
                <GridCol setWidth="two-thirds">
                    <Input
                        {...register(RequestFormEnum.AUTOINCREMENT_CHAR_COUNT)}
                        type="number"
                        label={t('autoincrement.charCount')}
                        //maxLength or min/max does not prevent user to add numbers using keyboard
                        onInput={(e) => {
                            if (e.currentTarget.value == '0') {
                                e.currentTarget.value = ''
                            } else {
                                e.currentTarget.value = e.currentTarget.value.slice(0, 1)
                            }
                        }}
                        disabled={!isAutoIncremenetValid}
                        min={1}
                        max={9}
                        maxLength={1}
                        hint={t('autoincrement.charCountHint')}
                    />
                </GridCol>
            </GridRow>

            <TextBody className={styles.grey}>{t('autoincrement.preview', { autoincrement: autoIncrement })}</TextBody>
        </fieldset>
    )
}
