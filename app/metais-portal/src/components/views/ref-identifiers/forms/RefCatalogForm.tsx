import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Button, ButtonGroupRow, IOption, Input, MultiSelect, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import React from 'react'
import { createPortal } from 'react-dom'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'

import { REF_PORTAL_SUBMIT_ID } from '../RefIdentifierCreateView'

import { RefCatalogFormType, RefCatalogFormTypeEnum, refIdentifierCreateCatalogSchema } from './refCreateSchema'

import { getDescriptionByAttribute, getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

interface RefCatalogFormPropsType<T extends FieldValues> {
    onSubmit: SubmitHandler<T>
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    ownerOptions: IOption<string>[]
    datasetOptions: IOption<string>[]
    defaultDatasets?: string[]
    defaultPo?: string
}

export const RefCatalogForm: React.FC<RefCatalogFormPropsType<RefCatalogFormType>> = ({
    onSubmit,
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

    const navigate = useNavigate()

    const attributeList = [
        ATTRIBUTE_NAME.Gen_Profil_nazov,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_popis,
        ATTRIBUTE_NAME.Profil_URIKatalog_uri,
        ATTRIBUTE_NAME.Profil_URIKatalog_platne_od,
        ATTRIBUTE_NAME.Profil_URIKatalog_platne_do,
    ]
    console.log('bugi', defaultDatasets)
    const attributesDefaultValues = attributeList.map((item) => [item, ciItemData?.attributes?.[item]])
    const methods = useForm<RefCatalogFormType>({
        defaultValues: {
            [RefCatalogFormTypeEnum.OWNER]: ownerOptions?.at(0)?.value,
            [RefCatalogFormTypeEnum.DATASET]: defaultDatasets,
            attributes: Object.fromEntries(attributesDefaultValues),
        },
        mode: 'onChange',
        resolver: yupResolver(refIdentifierCreateCatalogSchema(t)),
    })

    const { register, formState, handleSubmit, watch, getValues, setValue, clearErrors, control } = methods
    const { errors } = formState
    console.log('dodo errors', {
        [RefCatalogFormTypeEnum.OWNER]: ownerOptions?.at(0)?.value,
        [RefCatalogFormTypeEnum.DATASET]: defaultDatasets,
        attributes: Object.fromEntries(attributesDefaultValues),
    })
    const buttonRefId = document.getElementById(REF_PORTAL_SUBMIT_ID)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <SimpleSelect
                label={t('refIdentifiers.create.ownerUser')}
                options={ownerOptions ?? []}
                setValue={setValue}
                name={'owner'}
                isClearable={false}
                clearErrors={clearErrors}
                defaultValue={ownerOptions?.at(0)?.value}
            />

            <Input
                required
                label={getNameByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri),
                )}
                info={getDescriptionByAttribute(
                    language,
                    attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIKatalog_uri),
                )}
                {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_uri}`)}
                error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_URIKatalog_uri]?.message}
            />
            <Input
                required
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
                required
                handleDateChange={(date, name) =>
                    setValue(name as keyof RefCatalogFormType, formatDateForDefaultValue(date?.toISOString() ?? '', 'YYYY-MM-DD'))
                }
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
                handleDateChange={(date, name) =>
                    setValue(name as keyof RefCatalogFormType, formatDateForDefaultValue(date?.toISOString() ?? '', 'YYYY-MM-DD'))
                }
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
                label={t('refIdentifiers.create.catalogDataset')}
                name={RefCatalogFormTypeEnum.DATASET}
                options={datasetOptions || {}}
                setValue={setValue}
                value={watch()?.[RefCatalogFormTypeEnum.DATASET]?.map((item) => item ?? '')}
                clearErrors={clearErrors}
                error={errors?.[RefCatalogFormTypeEnum.DATASET]?.message}
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
                        {/* <Button onClick={handleSubmit(onSubmit)} label={t('refRegisters.create.save')} /> */}
                        <Button onClick={handleSubmit(onSubmit)} label={t('refRegisters.create.save')} />
                        <Button variant="secondary" label={t('refRegisters.detail.items.cancel')} onClick={() => navigate(-1)} />
                    </ButtonGroupRow>,
                    buttonRefId,
                )}
        </form>
    )
}
