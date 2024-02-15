import { yupResolver } from '@hookform/resolvers/yup'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Button, ButtonGroupRow, IOption, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiLazySelect } from '@isdd/metais-common/components/ci-lazy-select/CiLazySelect'
import React from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { OptionProps } from 'react-select'

import { REF_PORTAL_SUBMIT_ID } from '../RefIdentifierCreateView'

import { RefCatalogFormTypeEnum, RefDatasetFormType, RefDatasetFormTypeEnum, refIdentifierCreateDatasetSchema } from './refCreateSchema'

import { getDescriptionByAttribute, getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'

type RefDatasetFormPropsType = {
    isUpdate: boolean
    isDisabled?: boolean
    onSubmit: (data: RefDatasetFormType, isSend: boolean) => void
    ciItemData?: ConfigurationItemUi
    attributes: Attribute[] | undefined
    ownerOptions: IOption<string>[]
    templateUriOptions: IOption<string>[]
    defaultDatasetZC?: string
    defaultDatasetItem?: string
}

export const RefDatasetForm: React.FC<RefDatasetFormPropsType> = ({
    onSubmit,
    isUpdate,
    ciItemData,
    attributes,
    ownerOptions,
    templateUriOptions,
    isDisabled,
    defaultDatasetItem,
    defaultDatasetZC,
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
        ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie,
        ATTRIBUTE_NAME.Gen_Profil_kod_metais,
        ATTRIBUTE_NAME.Gen_Profil_ref_id,
    ]
    const attributesDefaultValues = attributeList.map((item) => [item, ciItemData?.attributes?.[item]])

    const methods = useForm<RefDatasetFormType>({
        defaultValues: {
            [RefDatasetFormTypeEnum.OWNER]: ciItemData?.metaAttributes?.owner,
            [RefDatasetFormTypeEnum.DATA_ITEM]: defaultDatasetItem,
            [RefDatasetFormTypeEnum.DATA_CODE]: defaultDatasetZC,
            attributes: Object.fromEntries(attributesDefaultValues),
        },
        mode: 'onChange',
        resolver: yupResolver(refIdentifierCreateDatasetSchema(t)),
    })

    const { register, formState, setValue, handleSubmit, clearErrors } = methods
    const { errors } = formState

    const buttonRefId = document.getElementById(REF_PORTAL_SUBMIT_ID)

    const selectLazyLoadingCiOption = (props: OptionProps<ConfigurationItemUi>) => {
        const optionAttributes = props.data.attributes
        return (
            <Option {...props}>
                <div>
                    <span>{`[${optionAttributes?.Gen_Profil_kod_metais}] ${optionAttributes?.Gen_Profil_nazov}`}</span>
                </div>
            </Option>
        )
    }

    return (
        <>
            <form>
                {!isUpdate && (
                    <SimpleSelect
                        label={t('refIdentifiers.create.ownerUser')}
                        options={ownerOptions ?? []}
                        setValue={setValue}
                        name={RefDatasetFormTypeEnum.OWNER}
                        isClearable={false}
                        clearErrors={clearErrors}
                        defaultValue={ownerOptions?.at(0)?.value}
                        error={errors?.[RefDatasetFormTypeEnum.OWNER]?.message}
                    />
                )}
                <Input
                    required
                    disabled={isDisabled}
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu),
                    )}
                    id={RefCatalogFormTypeEnum.OWNER}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIDataset_uri_datasetu}`)}
                    error={errors[RefCatalogFormTypeEnum.OWNER]?.message}
                />
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
                    id={RefCatalogFormTypeEnum.OWNER}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_nazov}`)}
                    error={errors[RefCatalogFormTypeEnum.OWNER]?.message}
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
                    id={RefCatalogFormTypeEnum.OWNER}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov}`)}
                    error={errors[RefCatalogFormTypeEnum.OWNER]?.message}
                />

                <SimpleSelect
                    label={t('refIdentifiers.create.datasetIncludesType')}
                    options={templateUriOptions || {}}
                    setValue={setValue}
                    name={RefDatasetFormTypeEnum.DATA_ITEM}
                    isClearable={false}
                    clearErrors={clearErrors}
                    defaultValue={defaultDatasetItem}
                    error={errors?.[RefDatasetFormTypeEnum.DATA_ITEM]?.message}
                />

                <CiLazySelect
                    disabled={isDisabled}
                    ciType="ZC"
                    label={t('refIdentifiers.create.datasetDefines')}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    name={RefDatasetFormTypeEnum.DATA_CODE}
                    defaultValue={defaultDatasetZC}
                    metaAttributes={{
                        state: ['DRAFT'],
                    }}
                    option={selectLazyLoadingCiOption}
                    required
                    error={errors?.[RefDatasetFormTypeEnum.DATA_CODE]?.message}
                />

                <Input
                    disabled={isDisabled}
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod),
                    )}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod}`)}
                    error={errors?.attributes?.[ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod]?.message}
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
