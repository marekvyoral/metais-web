import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ListOlaContractListParams } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DynamicFilterAttributes, ExtendedAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { ENTITY_ISVS, PO } from '@isdd/metais-common/constants'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
    defaultFilterValues: ListOlaContractListParams & IFilter
}

export const OlaContractListFilter: React.FC<Props> = ({ defaultFilterValues }) => {
    const { t } = useTranslation()

    const filterAttributes = (): ExtendedAttribute[] | undefined => {
        return [
            {
                name: t('olaContracts.filter.contractCode'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'contractCode',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('olaContracts.filter.metaIsCode'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'metaIsCode',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('olaContracts.filter.intervalStart'),
                attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
                technicalName: 'validityStart',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL_OR_LOWER],
            },
            {
                name: t('olaContracts.filter.intervalEnd'),
                attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
                technicalName: 'validityEnd',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL_OR_GREATER],
            },
            {
                name: t('olaContracts.filter.selectService'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'contractorIsvsUuid',
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectPOForFilter
                            ciType={ENTITY_ISVS}
                            label={t('olaContracts.filter.selectService')}
                            name="contractorIsvsUuid"
                            valuesAsUuids={Array.isArray(value) ? [value?.[0]?.value] ?? [] : value?.value ? [value?.value] : []}
                            onChange={(val) => {
                                if (val && val.length && val.every((v) => v && v.uuid != '')) {
                                    onChange({ ...value, value: val?.[0]?.uuid })
                                }
                            }}
                            isMulti={false}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('olaContracts.filter.liableEntities'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'liableEntities',
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectPOForFilter
                            ciType={PO}
                            label={t('olaContracts.filter.liableEntities')}
                            name="liableEntities"
                            valuesAsUuids={Array.isArray(value.value) ? value.value ?? [] : [value.value as string]}
                            onChange={(val) => {
                                if (val && val.length && val.every((v) => v && v.uuid != '')) {
                                    onChange({ ...value, value: val?.map((v) => v?.uuid ?? '') ?? [] })
                                }
                            }}
                            isMulti
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
        ]
    }

    return (
        <Filter<IFilter & ListOlaContractListParams>
            defaultFilterValues={defaultFilterValues}
            onlyForm
            heading={<></>}
            form={({ register, setValue, filter }) => {
                return (
                    <div>
                        <Input {...register('name')} label={t('olaContracts.filter.name')} />

                        <DynamicFilterAttributes
                            setValue={setValue}
                            defaults={defaultFilterValues}
                            attributes={filterAttributes()}
                            attributeProfiles={[]}
                            constraintsData={[]}
                            filterData={{
                                attributeFilters: filter.attributeFilters ?? {},
                                metaAttributeFilters: {},
                            }}
                            ignoreInputNames={['lastModifiedAt', 'createdAt', 'owner', 'state']}
                        />
                    </div>
                )
            }}
        />
    )
}
