import { yupResolver } from '@hookform/resolvers/yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { IOption, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/kris-swagger'
import { Attribute, AttributeProfile, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { PublicAuthoritySelect } from '../../public-authorities-hierarchy/PublicAuthoritySelect'

import { RefCatalogCreateFormEnum } from './refCreateSchema'

import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { getFilteredAttributeProfilesBasedOnRole } from '@/components/create-entity/createEntityHelpers'
import { getDescriptionByAttribute, getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'
import { PublicAuthorityState } from '@/hooks/usePublicAuthorityAndRole.hook'

type RefDataItemFormPropsType = {
    onSubmit: () => void
    attributes: Attribute[] | undefined
    constraintsData: (EnumType | undefined)[]
    ciTypeData: CiType | undefined
    generatedEntityId: CiCode | undefined
    attributeProfiles: AttributeProfile[] | undefined
    unitsData: EnumType | undefined
    defaultItemAttributeValues?: ConfigurationItemUiAttributes
    publicAuthorityState: PublicAuthorityState
    ownerOptions: IOption<string>[] | undefined
}

export const RefDataItemForm: React.FC<RefDataItemFormPropsType> = ({
    onSubmit,
    publicAuthorityState,
    attributes,
    ciTypeData,
    attributeProfiles,
    ownerOptions,
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
        ATTRIBUTE_NAME.Gen_Profil_RefID_stav_registracie,
        ATTRIBUTE_NAME.Gen_Profil_kod_metais,
        ATTRIBUTE_NAME.Gen_Profil_ref_id,
    ]

    const combinedProfiles = [ciTypeData as AttributeProfile, ...(attributeProfiles ?? [])]
    // const fromDefaultValues = formatForFormDefaultValues(isUpdate ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes)
    const methods = useForm({
        defaultValues: {},
        mode: 'onChange',
        resolver: yupResolver(generateFormSchema(getFilteredAttributeProfilesBasedOnRole(combinedProfiles, ''), t, language)),
    })

    const { register, formState, setValue, clearErrors, control } = methods
    const { errors } = formState

    return (
        <>
            {/* <form onSubmit={handleSubmit(onSubmit)}> */}
            <form>
                <SimpleSelect
                    label={t('refIdentifiers.create.ownerUser')}
                    name={'CodelistEnum.CATEGORY'}
                    options={ownerOptions || []}
                    // setValue={setValue}
                    isClearable={false}
                    clearErrors={clearErrors}
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
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIKatalog_uri}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
                />
                <Input
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod),
                    )}
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_historicky_kod}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
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
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_nazov}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
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
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
                />

                <Input
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku),
                    )}
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_kod_datoveho_prvku}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
                />

                <Input
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku),
                    )}
                    id={RefCatalogCreateFormEnum.URI}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_DatovyPrvok_typ_datoveho_prvku}`)}
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
                />

                <PublicAuthoritySelect
                    onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                    selectedOrg={publicAuthorityState.selectedPublicAuthority}
                    // ciRoles={['REFID_URI_DEF']}
                />

                <DateInput
                    required
                    handleDateChange={(date) => setValue('validityEndDate', date)}
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
                />
                <SimpleSelect
                    label={t('refIdentifiers.create.catalogDataset')}
                    name={'CodelistEnum.CATEGORY'}
                    options={[
                        { label: '-', value: '' },
                        { label: 'LICENSE', value: 'LICENSE' },
                    ]}
                    // setValue={setValue}
                    clearErrors={clearErrors}
                />

                <DateInput
                    handleDateChange={(date) => setValue('validityEndDate', date)}
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
                />

                <TextArea
                    required
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
                    error={errors[RefCatalogCreateFormEnum.URI]?.message}
                />
            </form>
        </>
    )
}
