import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, ButtonGroupRow, IOption, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { getDescriptionByAttribute, getNameByAttribute, getRequiredByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'
import { REF_PORTAL_SUBMIT_ID } from '@/components/views/ref-identifiers/RefIdentifierCreateView'
import {
    RefTemplateUriFormType,
    RefTemplateUriFormTypeEnum,
    refIdentifierCreateTemplateUriSchema,
} from '@/components/views/ref-identifiers/forms/refCreateSchema'

type RefTemplateUriFormPropsType = {
    onSubmit: (data: RefTemplateUriFormType, isSend: boolean) => void
    onCancel: () => void
    clearUriExist: () => void
    isUriExist: boolean
    isDisabled?: boolean
    isUpdate: boolean
    ciItemData?: ConfigurationItemUi
    ciCode?: string
    attributes: Attribute[] | undefined
    ownerOptions: IOption<string>[]
    templateUriOptions: IOption<string>[]
    defaultTemplateUri?: string
}

export const RefTemplateUriForm: React.FC<RefTemplateUriFormPropsType> = ({
    onSubmit,
    onCancel,
    clearUriExist,
    isUriExist,
    isUpdate,
    isDisabled,
    ciItemData,
    ciCode,
    attributes,
    ownerOptions,
    templateUriOptions,
    defaultTemplateUri,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const attributeList = [
        ATTRIBUTE_NAME.Gen_Profil_nazov,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_popis,
        ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri,
        ATTRIBUTE_NAME.Profil_Individuum_platne_od,
        ATTRIBUTE_NAME.Profil_Individuum_platne_do,
        ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie,
        ATTRIBUTE_NAME.Profil_Individuum_versions,
        ATTRIBUTE_NAME.Gen_Profil_kod_metais,
        ATTRIBUTE_NAME.Gen_Profil_ref_id,
    ]

    const attributesDefaultValues = Object.fromEntries(attributeList.map((item) => [item, ciItemData?.attributes?.[item]]))

    const methods = useForm<RefTemplateUriFormType>({
        defaultValues: {
            [RefTemplateUriFormTypeEnum.OWNER]: ownerOptions?.at(0)?.value,
            [RefTemplateUriFormTypeEnum.TEMPLATE_URI]: defaultTemplateUri,
            attributes: attributesDefaultValues,
        },
        mode: 'onChange',
        resolver: yupResolver(refIdentifierCreateTemplateUriSchema(t, language, attributesDefaultValues, attributes)),
    })

    const { register, formState, setValue, watch, setError, handleSubmit, clearErrors, control } = methods
    const { errors } = formState

    useEffect(() => {
        if (isUriExist) {
            setError(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri}`, { message: t('refIdentifiers.create.uriAlreadyExist') })
        }
    }, [isUriExist, setError, t])

    const buttonRefId = document.getElementById(REF_PORTAL_SUBMIT_ID)

    const currentUri = watch(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri}`)
    const uriExample = currentUri ? `${currentUri}/${ciCode?.split('_')?.[1]}` : ''

    return (
        <>
            <form>
                {!isUpdate && (
                    <SimpleSelect
                        label={t('refIdentifiers.create.ownerUser')}
                        options={ownerOptions ?? []}
                        setValue={setValue}
                        name={'owner'}
                        isClearable={false}
                        clearErrors={clearErrors}
                        defaultValue={ownerOptions?.at(0)?.value}
                        error={errors?.[RefTemplateUriFormTypeEnum.OWNER]?.message}
                    />
                )}
                <Input
                    disabled={isDisabled}
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri))}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri}`)}
                    onBlur={clearUriExist}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_zaklad_uri]?.message}
                />
                <Input
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_kod))}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_kod),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_kod),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_kod}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_kod]?.message}
                />
                <Input
                    disabled={isDisabled}
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_nazov}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]?.message}
                />

                <Input
                    disabled={isDisabled}
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]?.message}
                />

                <Input name={'uriExample'} label={t('refIdentifiers.create.templateUriExample')} value={uriExample} disabled />

                <SimpleSelect
                    required
                    label={t('refIdentifiers.create.templateUriType')}
                    options={templateUriOptions ?? []}
                    setValue={setValue}
                    name={RefTemplateUriFormTypeEnum.TEMPLATE_URI}
                    isClearable={false}
                    clearErrors={clearErrors}
                    defaultValue={defaultTemplateUri}
                    error={errors?.[RefTemplateUriFormTypeEnum.TEMPLATE_URI]?.message}
                />

                <DateInput
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_od))}
                    handleDateChange={(date, name) => date && setValue(name as keyof RefTemplateUriFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                    setValue={setValue}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_platne_od}`)}
                    control={control}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_od),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_od),
                    )}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_platne_od]?.message}
                />

                <DateInput
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_do))}
                    handleDateChange={(date, name) => date && setValue(name as keyof RefTemplateUriFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                    setValue={setValue}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_Individuum_platne_do}`)}
                    control={control}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_do),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Individuum_platne_do),
                    )}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_Individuum_platne_do]?.message}
                />

                <TextArea
                    rows={3}
                    required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis))}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_popis),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_popis}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_popis]?.message}
                />

                {buttonRefId &&
                    createPortal(
                        <ButtonGroupRow>
                            <Button onClick={handleSubmit((data) => onSubmit(data, true))} label={t('refIdentifiers.create.finishRequest')} />
                            <Button onClick={handleSubmit((data) => onSubmit(data, false))} label={t('refIdentifiers.create.saveRequest')} />
                            <Button variant="secondary" onClick={onCancel} label={t('refIdentifiers.create.cancelRequest')} />
                        </ButtonGroupRow>,
                        buttonRefId,
                    )}
            </form>
        </>
    )
}
