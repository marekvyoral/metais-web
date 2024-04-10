import { BaseModal, GridCol, GridRow, Input, LoadingIndicator, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ModalButtons, MutationFeedback } from '@isdd/metais-common/index'
import React, { FC } from 'react'
import { UseFormRegister, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DOT_SIGN, JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { GetAllLocale, GetAllUserInterface } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'

import styles from './local.module.scss'

import { DataRecord, isObjectWithSkAndEn } from '@/componentHelpers/localization'
import { useTransUpdate } from '@/hooks/useTransUpdate'

type Props = {
    isOpen: boolean
    close: () => void
    defaultFormData: DataRecord
    firstLanguage: GetAllLocale
    secondLanguage: 'EN' | null
    userInterface: GetAllUserInterface
}

type LocFormInputProps = {
    label: string
    info: string
    name: string
    register: UseFormRegister<DataRecord>
    valueLength: number
}

const LocalizationFormInput: FC<LocFormInputProps> = ({ label, info, register, name, valueLength }) => {
    const TEXTAREA_LENGTH_BOTTOM_LIMIT = 200

    if (valueLength > TEXTAREA_LENGTH_BOTTOM_LIMIT) {
        return <TextArea rows={3} label={label} info={info} {...register(name)} type="text" />
    }

    return <Input label={label} info={info} {...register(name)} type="text" />
}

export const UpdateLocalizationForm: React.FC<Props> = ({ isOpen, close, defaultFormData, firstLanguage, secondLanguage, userInterface }) => {
    const { t } = useTranslation()
    const LOC_VARIABLE_REGEX = /[{}]/
    const hasSecondLanguage = secondLanguage != null

    const getFormattedKey = (str: string) => {
        return str.split(DOT_SIGN).join(JOIN_OPERATOR)
    }
    const reverseFormattedKey = (str: string) => {
        return str.split(JOIN_OPERATOR).join(DOT_SIGN)
    }
    const reduceDataWithCustomKey = (data: DataRecord, getKey: (k: string) => string): DataRecord => {
        return Object.keys(data).reduce((acc, key) => {
            const formattedKey = getKey(key)
            return {
                ...acc,
                [formattedKey]: data[key],
            }
        }, {})
    }

    const formattedDefaultValues: DataRecord = reduceDataWithCustomKey(defaultFormData, getFormattedKey)

    const { register, handleSubmit } = useForm<DataRecord>({
        defaultValues: formattedDefaultValues,
    })

    const { isError, isLoading, isMultipleSuccess, isSuccess, updateMultiple, updateForm } = useTransUpdate(firstLanguage, userInterface)

    const onSubmit = (formData: DataRecord) => {
        const formattedFormData = reduceDataWithCustomKey(formData, reverseFormattedKey)
        if (hasSecondLanguage) {
            const skObject: Record<string, string> = {}
            const enObject: Record<string, string> = {}
            for (const fKey in formattedFormData) {
                const currentItem = formattedFormData[fKey]
                if (isObjectWithSkAndEn(currentItem)) {
                    skObject[fKey] = currentItem.sk
                    enObject[fKey] = currentItem.en
                }
            }

            updateMultiple({
                data: [
                    { locale: firstLanguage, userInterface, map: skObject },
                    { locale: secondLanguage, userInterface, map: enObject },
                ],
            })
        } else {
            updateForm({ data: formattedFormData as Record<string, string>, params: { locale: firstLanguage, userInterface } })
        }
    }

    return (
        <BaseModal isOpen={isOpen} close={close}>
            {isLoading && <LoadingIndicator />}
            <ElementToScrollTo trigger={isSuccess || isError || isMultipleSuccess}>
                <MutationFeedback success={isSuccess || isMultipleSuccess} error={isError} />
            </ElementToScrollTo>
            <div className={styles.modalHeading}>
                <TextHeading size="L">{t('localization.updateFormHeading')}</TextHeading>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {Object.keys(defaultFormData).map((key) => {
                    if (secondLanguage && typeof defaultFormData[key] == 'object') {
                        return (
                            <GridRow key={key}>
                                <GridCol setWidth="one-half">
                                    <LocalizationFormInput
                                        key={key}
                                        label={`${key} (sk)`}
                                        info={LOC_VARIABLE_REGEX.test(`${defaultFormData[key]}.sk`) ? t('localization.locVariableTooltip') : ''}
                                        register={register}
                                        name={`${getFormattedKey(key)}.sk`}
                                        valueLength={(defaultFormData[key] as { sk: string; en: string }).sk.length}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <LocalizationFormInput
                                        key={key}
                                        label={`${key} (en)`}
                                        info={LOC_VARIABLE_REGEX.test(`${defaultFormData[key]}.en`) ? t('localization.locVariableTooltip') : ''}
                                        register={register}
                                        name={`${getFormattedKey(key)}.en`}
                                        valueLength={(defaultFormData[key] as { sk: string; en: string }).en.length}
                                    />
                                </GridCol>
                            </GridRow>
                        )
                    } else {
                        return (
                            <LocalizationFormInput
                                key={key}
                                label={key}
                                info={LOC_VARIABLE_REGEX.test(defaultFormData[key].toString()) ? t('localization.locVariableTooltip') : ''}
                                name={getFormattedKey(key)}
                                register={register}
                                valueLength={(defaultFormData[key] as string).length}
                            />
                        )
                    }
                })}

                <ModalButtons onClose={close} submitButtonLabel={t('localization.submit')} />
            </form>
        </BaseModal>
    )
}
