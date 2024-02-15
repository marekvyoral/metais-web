import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, ButtonGroupRow, IOption, Input, MultiSelect, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { DateTime } from 'luxon'
import React from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { REF_PORTAL_SUBMIT_ID } from '../RefIdentifierCreateView'

import { RefDataItemFormType, RefDataItemFormTypeEnum, refIdentifierCreateDataItemSchema } from './refCreateSchema'

import { getDescriptionByAttribute, getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

type RefDataItemFormPropsType = {
    onSubmit: (data: RefDataItemFormType, isSend: boolean) => void
    isUpdate: boolean
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    ownerOptions: IOption<string>[]
    datasetOptions: IOption<string>[]
    templateUriOptions: IOption<string>[]
    dataItemTypeOptions: IOption<string>[]
    defaultDatasets?: string[]
    defaultDataItemTemplateUriUuids?: string[]
    defaultPo?: string
    isDisabled?: boolean
}

export const RefDataItemForm: React.FC<RefDataItemFormPropsType> = ({
    onSubmit,
    isUpdate,
    ciItemData,
    attributes,
    ownerOptions,
    dataItemTypeOptions,
    templateUriOptions,
    defaultDataItemTemplateUriUuids,
    defaultPo,
    isDisabled,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const navigate = useNavigate()

    const attributeList = [
        ATTRIBUTE_NAME.Gen_Profil_nazov,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_popis,
        ATTRIBUTE_NAME.Profil_URIKatalog_uri,
        ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku,
        ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku,
        ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod,
        ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti,
        ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti,
        ATTRIBUTE_NAME.Gen_Profil_kod_metais,
        ATTRIBUTE_NAME.Gen_Profil_ref_id,
    ]

    const attributesDefaultValues = Object.fromEntries(attributeList.map((item) => [item, ciItemData?.attributes?.[item]]))

    const methods = useForm<RefDataItemFormType>({
        defaultValues: {
            [RefDataItemFormTypeEnum.OWNER]: ownerOptions?.at(0)?.value,
            [RefDataItemFormTypeEnum.DATA_ITEM]: defaultDataItemTemplateUriUuids,
            [RefDataItemFormTypeEnum.PO]: defaultPo,
            attributes: attributesDefaultValues,
        },
        mode: 'onChange',
        resolver: yupResolver(refIdentifierCreateDataItemSchema(t)),
    })

    const { register, formState, setValue, watch, handleSubmit, clearErrors, control } = methods
    const { errors } = formState

    const buttonRefId = document.getElementById(REF_PORTAL_SUBMIT_ID)

    return (
        <>
            <form>
                {!isUpdate && (
                    <SimpleSelect
                        label={t('refIdentifiers.create.ownerUser')}
                        options={ownerOptions ?? []}
                        setValue={setValue}
                        name={RefDataItemFormTypeEnum.OWNER}
                        isClearable={false}
                        clearErrors={clearErrors}
                        defaultValue={ownerOptions?.at(0)?.value}
                        error={errors?.[RefDataItemFormTypeEnum.OWNER]?.message}
                    />
                )}
                <Input
                    required
                    disabled={isDisabled}
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
                    required
                    disabled={isDisabled}
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

                <Input
                    required
                    disabled={isDisabled}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku]?.message}
                />

                <SimpleSelect
                    disabled={isDisabled}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku),
                    )}
                    options={dataItemTypeOptions ?? []}
                    setValue={setValue}
                    name={`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku}`}
                    isClearable={false}
                    clearErrors={clearErrors}
                    defaultValue={attributesDefaultValues?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku]?.message}
                />

                <Input
                    required
                    disabled={isDisabled}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod]?.message}
                />

                <CiLazySelect
                    ciType="PO"
                    label={t('refIdentifiers.create.poGestor')}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    name={RefDataItemFormTypeEnum.PO}
                    defaultValue={defaultPo}
                    metaAttributes={{
                        state: ['DRAFT'],
                    }}
                    required
                    error={errors?.[RefDataItemFormTypeEnum.PO]?.message}
                />

                <MultiSelect
                    label={t('refIdentifiers.create.dataElementType')}
                    name={RefDataItemFormTypeEnum.DATA_ITEM}
                    options={templateUriOptions || {}}
                    setValue={setValue}
                    value={watch()?.[RefDataItemFormTypeEnum.DATA_ITEM]?.map((item) => item ?? '')}
                    defaultValue={defaultDataItemTemplateUriUuids}
                    clearErrors={clearErrors}
                    error={errors?.[RefDataItemFormTypeEnum.DATA_ITEM]?.message}
                />

                <DateInput
                    required
                    handleDateChange={(date, name) => date && setValue(name as keyof RefDataItemFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti}`)}
                    control={control}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti),
                    )}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_zaciatok_ucinnosti]?.message}
                />

                <DateInput
                    handleDateChange={(date, name) => date && setValue(name as keyof RefDataItemFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti}`)}
                    control={control}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti),
                    )}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_DatovyPrvok_koniec_ucinnosti]?.message}
                />

                <TextArea
                    rows={3}
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
                            <Button variant="secondary" label={t('refRegisters.detail.items.cancel')} onClick={() => navigate(-1)} />
                        </ButtonGroupRow>,
                        buttonRefId,
                    )}
            </form>
        </>
    )
}
