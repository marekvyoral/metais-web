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

import { RefCatalogFormTypeEnum } from './refCreateSchema'

import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { getFilteredAttributeProfilesBasedOnRole } from '@/components/create-entity/createEntityHelpers'
import { getDescriptionByAttribute, getNameByAttribute } from '@/components/views/codeLists/CodeListDetailUtils'
import { PublicAuthorityState } from '@/hooks/usePublicAuthorityAndRole.hook'

type RefDatasetFormPropsType = {
    onSubmit: () => void
    attributes: Attribute[] | undefined
    constraintsData: (EnumType | undefined)[]
    ciTypeData: CiType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    unitsData: EnumType | undefined
    defaultItemAttributeValues?: ConfigurationItemUiAttributes
    publicAuthorityState: PublicAuthorityState
    ownerOptions: IOption<string>[] | undefined
}

export const RefDatasetForm: React.FC<RefDatasetFormPropsType> = ({
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

    const { register, formState, setValue, handleSubmit, clearErrors, control } = methods
    const { errors } = formState

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <Input
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_poznamka),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_poznamka),
                    )}
                    id={RefCatalogFormTypeEnum.OWNER}
                    {...register(`attributes.${ATTRIBUTE_NAME.Gen_Profil_poznamka}`)}
                    error={errors[RefCatalogFormTypeEnum.OWNER]?.message}
                />

                <Input
                    required
                    label={getNameByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod),
                    )}
                    info={getDescriptionByAttribute(
                        language,
                        attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod),
                    )}
                    id={RefCatalogFormTypeEnum.OWNER}
                    {...register(`attributes.${ATTRIBUTE_NAME.Profil_URIDataset_historicky_kod}`)}
                    error={errors[RefCatalogFormTypeEnum.OWNER]?.message}
                />
            </form>
        </>
    )
}
