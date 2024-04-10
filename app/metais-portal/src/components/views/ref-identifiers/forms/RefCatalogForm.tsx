import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, ButtonGroupRow, IOption, Input, MultiSelect, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { getDescriptionByAttribute, getNameByAttribute, getRequiredByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'
import { REF_PORTAL_SUBMIT_ID } from '@/components/views/ref-identifiers/RefIdentifierCreateView'
import {
    RefCatalogFormType,
    RefCatalogFormTypeEnum,
    refIdentifierCreateCatalogSchema,
} from '@/components/views/ref-identifiers/forms/refCreateSchema'

interface RefCatalogFormPropsType {
    onSubmit: (data: RefCatalogFormType, send: boolean) => void
    onCancel: () => void
    clearUriExist: () => void
    isUpdate?: boolean
    isUriExist: boolean
    isDisabled?: boolean
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    ownerOptions: IOption<string>[]
    datasetOptions: IOption<string>[]
    defaultDatasets?: string[]
    defaultPo?: string
}

export const RefCatalogForm: React.FC<RefCatalogFormPropsType> = ({
    onSubmit,
    onCancel,
    clearUriExist,
    isUriExist,
    isUpdate,
    isDisabled,
    ciItemData,
    attributes,
    ownerOptions,
    datasetOptions,
    defaultDatasets,
    defaultPo,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation()

    const attributeList = [
        ATTRIBUTE_NAME.Gen_Profil_nazov,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_popis,
        ATTRIBUTE_NAME.Profil_URIKatalog_uri,
        ATTRIBUTE_NAME.Profil_URIKatalog_platne_od,
        ATTRIBUTE_NAME.Profil_URIKatalog_platne_do,
    ]

    const attributesDefaultValues = Object.fromEntries(attributeList.map((item) => [item, ciItemData?.attributes?.[item]]))

    const methods = useForm<RefCatalogFormType>({
        defaultValues: {
            [RefCatalogFormTypeEnum.OWNER]: ownerOptions?.at(0)?.value,
            [RefCatalogFormTypeEnum.DATASET]: defaultDatasets,
            [RefCatalogFormTypeEnum.PO]: defaultPo,
            attributes: attributesDefaultValues,
        },
        mode: 'onChange',
        resolver: yupResolver(refIdentifierCreateCatalogSchema(t, language, attributesDefaultValues, attributes)),
    })

    const { register, formState, handleSubmit, watch, setError, setValue, clearErrors, control } = methods
    const { errors } = formState

    const buttonRefId = document.getElementById(REF_PORTAL_SUBMIT_ID)

    useEffect(() => {
        if (isUriExist) {
            setError(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_uri}`, { message: t('refIdentifiers.create.uriAlreadyExist') })
        }
    }, [isUriExist, setError, t])

    return (
        <form noValidate>
            {!isUpdate && (
                <SimpleSelect
                    label={t('refIdentifiers.create.ownerUser')}
                    options={ownerOptions ?? []}
                    setValue={setValue}
                    name={RefCatalogFormTypeEnum.OWNER}
                    isClearable={false}
                    clearErrors={clearErrors}
                    defaultValue={ownerOptions?.at(0)?.value}
                    error={errors?.[RefCatalogFormTypeEnum.OWNER]?.message}
                />
            )}

            <Input
                required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri))}
                disabled={isDisabled}
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri),
                )}
                info={getDescriptionByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri),
                )}
                {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_uri}`)}
                onBlur={clearUriExist}
                error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_uri]?.message}
            />
            <Input
                required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov))}
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
                required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov))}
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

            <CiLazySelect
                disabled={isDisabled}
                ciType="PO"
                label={t('refIdentifiers.create.poGestor')}
                setValue={setValue}
                clearErrors={clearErrors}
                name={RefCatalogFormTypeEnum.PO}
                defaultValue={defaultPo}
                metaAttributes={{
                    state: ['DRAFT'],
                }}
                required
                error={errors?.[RefCatalogFormTypeEnum.PO]?.message}
            />

            <DateInput
                required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od))}
                setValue={setValue}
                handleDateChange={(date, name) => date && setValue(name as keyof RefCatalogFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_platne_od}`)}
                control={control}
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od),
                )}
                info={getDescriptionByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_od),
                )}
                error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_od]?.message}
            />

            <DateInput
                required={getRequiredByAttribute(attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_do))}
                handleDateChange={(date, name) => date && setValue(name as keyof RefCatalogFormType, DateTime.fromJSDate(date).toISO() ?? '')}
                setValue={setValue}
                {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_platne_do}`)}
                control={control}
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_do),
                )}
                info={getDescriptionByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_platne_do),
                )}
                error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_platne_do]?.message}
            />

            <MultiSelect
                required
                label={t('refIdentifiers.create.catalogDataset')}
                name={RefCatalogFormTypeEnum.DATASET}
                options={datasetOptions || {}}
                setValue={setValue}
                value={watch()?.[RefCatalogFormTypeEnum.DATASET]?.map((item) => item ?? '')}
                clearErrors={clearErrors}
                defaultValue={defaultDatasets}
                error={errors?.[RefCatalogFormTypeEnum.DATASET]?.message}
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
    )
}
