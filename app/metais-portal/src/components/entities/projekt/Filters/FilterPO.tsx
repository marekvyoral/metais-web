import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, MultiSelect, RadioButton, RadioGroupWithLabel } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { SelectPersonCategory } from '@isdd/metais-common/components/select-person-category/SelectPersonCategory'
import { SelectPersonType } from '@isdd/metais-common/components/select-person-type/SelectPersonType'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'

export interface POFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
    EA_Profil_PO_kategoria_osoby?: string[]
    EA_Profil_PO_typ_osoby?: string[]
    EA_Profil_PO_je_kapitola?: boolean
    evidence_status?: string[]
}

interface Props {
    entityName: string
    defaultFilterValues: POFilterData
    attributes: Attribute[] | undefined
    attributeProfiles: AttributeProfile[] | undefined
    constraintsData: (EnumType | undefined)[] | undefined
    codePrefix?: string
}

export const FilterPO = ({ entityName: PO, defaultFilterValues, attributes, attributeProfiles, constraintsData, codePrefix }: Props) => {
    const { t } = useTranslation()
    const { currentPreferences } = useUserPreferences()
    const showInvalidatedItems = currentPreferences.showInvalidatedItems
    const evidenceStatus = [
        { value: 'DRAFT', label: t('metaAttributes.state.DRAFT') },
        { value: 'INVALIDATED', label: t('metaAttributes.state.INVALIDATED'), disabled: !showInvalidatedItems },
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
                    </RadioGroupWithLabel>
                    <SelectPersonCategory filter={filter} setValue={setValue} />
                    <MultiSelect
                        label={t('filter.PO.evidenceStatus')}
                        placeholder={t('filter.chooseState')}
                        options={evidenceStatus}
                        id="evidence_status"
                        name="evidence_status"
                        setValue={setValue}
                        defaultValue={showInvalidatedItems ? filter?.evidence_status : defaultFilterValues.evidence_status}
                    />
                    <SelectPersonType filter={filter} setValue={setValue} />
                    <DynamicFilterAttributes
                        defaults={defaultFilterValues}
                        attributes={attributes}
                        attributeProfiles={attributeProfiles}
                        constraintsData={constraintsData}
                        setValue={setValue}
                        filterData={{ attributeFilters: filter.attributeFilters ?? {}, metaAttributeFilters: filter.metaAttributeFilters ?? {} }}
                    />
                </div>
            )}
        />
    )
}
