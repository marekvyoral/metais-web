import React from 'react'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, MultiSelect, RadioButton, RadioGroupWithLabel } from '@isdd/idsk-ui-kit/index'
import { ColumnAttribute, DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, Attribute, AttributeProfile, EnumType, GET_ENUM, useGetEnum } from '@isdd/metais-common/api'

export interface POFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
    EA_Profil_PO_kategoria_osoby?: (string | undefined)[]
    EA_Profil_PO_typ_osoby?: (string | undefined)[]
    EA_Profil_PO_je_kapitola?: boolean
}

interface FilterPOOption {
    value: string | undefined
    label: string | undefined
    disabled?: boolean
}

interface Props {
    entityName: string
    availableAttributes?: ColumnAttribute[] | undefined
    defaultFilterValues: POFilterData
    attributes: Attribute[] | undefined
    attributeProfiles: AttributeProfile[] | undefined
    constraintsData: (EnumType | undefined)[]
}

export const FilterPO = ({ entityName: PO, availableAttributes, defaultFilterValues, attributes, attributeProfiles, constraintsData }: Props) => {
    const { t } = useTranslation()
    const { data: personCategories } = useGetEnum(GET_ENUM.KATEGORIA_OSOBA)
    const optionsPersonCategories = personCategories?.enumItems?.map((enumItem) => ({
        value: enumItem.code,
        label: `${enumItem.value} - ${enumItem.description}`,
    }))

    const { data: personTypesCategories } = useGetEnum(GET_ENUM.TYP_OSOBY)
    const optionsPersonType = personTypesCategories?.enumItems?.map((enumItem) => ({
        value: enumItem.code,
        label: `${enumItem.value} - ${enumItem.description}`,
    }))
    const evidenceStatus = [
        { value: 'created', label: t('metaAttributes.state.DRAFT') },
        { value: 'invalidated', label: t('metaAttributes.state.INVALIDATED'), disabled: true },
    ]

    return (
        <Filter<POFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, control, filter, setValue }) => (
                <div>
                    <Input label={t(`filter.${PO}.name`)} placeholder={t(`filter.namePlaceholder`)} {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)} />
                    <Input
                        label={t('filter.metaisCode.label')}
                        placeholder={t('filter.metaisCode.placeholder')}
                        {...register('Gen_Profil_kod_metais')}
                    />
                    <RadioGroupWithLabel label={t('filter.PO.itIsChapter')} className="govuk-radios--small" inline>
                        <RadioButton
                            id={'itIsChapter.yes'}
                            value={'true'}
                            label={t('radioButton.yes')}
                            {...register(ATTRIBUTE_NAME.EA_Profil_PO_je_kapitola)}
                        />
                        <RadioButton
                            id={'itIsChapter.no'}
                            value={'false'}
                            label={t('radioButton.no')}
                            {...register(ATTRIBUTE_NAME.EA_Profil_PO_je_kapitola)}
                        />
                        <RadioButton
                            id={'itIsChapter.nothing'}
                            value={''}
                            label={t('radioButton.nothing')}
                            {...register(ATTRIBUTE_NAME.EA_Profil_PO_je_kapitola)}
                        />
                    </RadioGroupWithLabel>
                    <Controller
                        control={control}
                        name={ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby}
                        render={({ field: { onChange, value } }) => (
                            <MultiSelect<FilterPOOption>
                                name={ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby}
                                id="persons-category"
                                label={t('filter.PO.personsCategory')}
                                placeholder={t('filter.chooseValue')}
                                options={optionsPersonCategories ?? []}
                                value={optionsPersonCategories?.filter((option) => option.value && value?.includes(option.value))}
                                onChange={(categories) => onChange(categories.map((category) => category.value))}
                            />
                        )}
                    />
                    <MultiSelect<FilterPOOption>
                        label="Evidence status"
                        placeholder={t('filter.chooseState')}
                        options={evidenceStatus}
                        isOptionDisabled={(option) => !!option.disabled}
                        name="evidence-status"
                    />
                    <Controller
                        control={control}
                        name={ATTRIBUTE_NAME.EA_Profil_PO_typ_osoby}
                        render={({ field: { onChange, value } }) => (
                            <MultiSelect<FilterPOOption>
                                name={ATTRIBUTE_NAME.EA_Profil_PO_typ_osoby}
                                label={t('filter.PO.publicAuthorityType')}
                                placeholder={t('filter.chooseValue')}
                                options={optionsPersonType ?? []}
                                value={optionsPersonType?.filter((option) => option.value && value?.includes(option.value))}
                                onChange={(personTypes) => onChange(personTypes.map((personType) => personType.value))}
                            />
                        )}
                    />
                    <DynamicFilterAttributes
                        defaults={defaultFilterValues}
                        attributes={attributes}
                        attributeProfiles={attributeProfiles}
                        constraintsData={constraintsData}
                        setValue={setValue}
                        data={filter.attributeFilters}
                        availableAttributes={availableAttributes}
                    />
                </div>
            )}
        />
    )
}
