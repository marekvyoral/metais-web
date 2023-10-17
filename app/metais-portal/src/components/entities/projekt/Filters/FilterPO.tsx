import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, MultiSelect, RadioButton, RadioGroupWithLabel } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, EnumType } from '@isdd/metais-common/api'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ColumnAttribute, DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { SelectPersonCategory } from '@isdd/metais-common/components/select-person-category/SelectPersonCategory'
import { SelectPersonType } from '@isdd/metais-common/components/select-person-type/SelectPersonType'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'

export interface POFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
    EA_Profil_PO_kategoria_osoby?: string[]
    EA_Profil_PO_typ_osoby?: string[]
    EA_Profil_PO_je_kapitola?: boolean
}

interface Props {
    entityName: string
    availableAttributes?: ColumnAttribute[] | undefined
    defaultFilterValues: POFilterData
    attributes: Attribute[] | undefined
    attributeProfiles: AttributeProfile[] | undefined
    constraintsData: (EnumType | undefined)[]
    codePrefix?: string
}

export const FilterPO = ({ entityName: PO, defaultFilterValues, attributes, attributeProfiles, constraintsData, codePrefix }: Props) => {
    const { t } = useTranslation()

    const evidenceStatus = [
        { value: 'created', label: t('metaAttributes.state.DRAFT') },
        { value: 'invalidated', label: t('metaAttributes.state.INVALIDATED'), disabled: true },
    ]

    return (
        <Filter<POFilterData>
            defaultFilterValues={defaultFilterValues}
            form={({ register, filter, setValue }) => (
                <div>
                    <Input label={t(`filter.${PO}.name`)} placeholder={t(`filter.namePlaceholder`)} {...register(ATTRIBUTE_NAME.Gen_Profil_nazov)} />
                    <Input label={t('filter.metaisCode.label')} placeholder={codePrefix} {...register('Gen_Profil_kod_metais')} />
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

                    <SelectPersonCategory filter={filter} setValue={setValue} />
                    <MultiSelect label="Evidence status" placeholder={t('filter.chooseState')} options={evidenceStatus} name="evidence-status" />
                    <SelectPersonType filter={filter} setValue={setValue} />
                    <DynamicFilterAttributes
                        defaults={defaultFilterValues}
                        attributes={attributes}
                        attributeProfiles={attributeProfiles}
                        constraintsData={constraintsData}
                        setValue={setValue}
                        data={filter.attributeFilters}
                    />
                </div>
            )}
        />
    )
}
