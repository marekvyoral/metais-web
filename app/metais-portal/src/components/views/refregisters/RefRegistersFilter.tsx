import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import style from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { GetFOPReferenceRegisters1Muk, GetFOPReferenceRegisters1State } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { DynamicFilterAttributes, ExtendedAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import {
    SelectFilterOrganization,
    SelectFilterOrganizationOptionType,
} from '@isdd/metais-common/components/select-organization/SelectFilterOrganization'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { OptionProps } from 'react-select'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { PO } from '@isdd/metais-common/constants'

import { RefRegisterFilter, RefRegisterFilterItems } from '@/types/filters'

interface IRefRegistersFilter {
    defaultFilterValues: RefRegisterFilter
}

export const RefRegistersFilter = ({ defaultFilterValues }: IRefRegistersFilter) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const states: IOption<string>[] = Object.keys(GetFOPReferenceRegisters1State)?.map((val) => ({
        label: t(`refRegisters.table.state.${val}`),
        value: val,
    }))

    const mukOptions: IOption<string>[] = Object.keys(GetFOPReferenceRegisters1Muk)?.map((val) => ({
        label: t(`refRegisters.table.muk.${val}`),
        value: val,
    }))

    const registryNameOption = (optionProps: OptionProps<SelectFilterOrganizationOptionType>) => {
        return (
            <Option {...optionProps} className={style.selectOption}>
                <div>
                    <strong>{t('refRegisters.option.name')}: </strong> {optionProps.data.name}
                </div>
                <span>
                    <small>
                        <strong>{t('refRegisters.option.code')}: </strong>
                        {optionProps.data.code}
                    </small>
                </span>
            </Option>
        )
    }
    const filterAttributes = (): ExtendedAttribute[] | undefined => {
        return [
            {
                name: t('refRegisters.table.isvsName'),
                engName: t('refRegisters.table.isvsName'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: RefRegisterFilterItems.ISVS_UUID,
                invisible: !user,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectFilterOrganization<RefRegisterFilter>
                            onChange={(val) => {
                                val && val[0]?.uuid != '' && onChange({ ...value, value: val[0].uuid })
                            }}
                            filter={{ [RefRegisterFilterItems.ISVS_UUID]: '82f730eb-4c5b-447f-9314-4464843f38bd' }}
                            option={(row) => registryNameOption(row)}
                            name={RefRegisterFilterItems.ISVS_UUID}
                            label={t('refRegisters.table.isvsName')}
                            additionalData={{
                                metaAttributes: { state: ['DRAFT', 'APPROVED_BY_OWNER', 'AWAITING_APPROVAL'] },
                                type: ['ISVS'],
                                searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov, ATTRIBUTE_NAME.Gen_Profil_kod_metais],
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('refRegisters.table.state.heading'),
                engName: t('refRegisters.table.state.heading'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: RefRegisterFilterItems.STATE_CUSTOM,
                invisible: !user,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SimpleSelect
                            label={t('refRegisters.table.state.heading')}
                            name={RefRegisterFilterItems.STATE}
                            options={states}
                            defaultValue={value?.value}
                            onChange={(val) => {
                                onChange({ ...value, value: val })
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('refRegisters.table.muk.heading'),
                engName: t('refRegisters.table.muk.heading'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: RefRegisterFilterItems.MUK,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SimpleSelect
                            label={t('refRegisters.table.muk.heading')}
                            name={RefRegisterFilterItems.MUK}
                            options={mukOptions}
                            defaultValue={value?.value}
                            onChange={(val) => {
                                onChange({ ...value, value: val })
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('refRegisters.table.manager'),
                engName: t('refRegisters.table.manager'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: RefRegisterFilterItems.MANAGER_UUID,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectPOForFilter
                            ciType={PO}
                            label={t('refRegisters.table.manager')}
                            name={RefRegisterFilterItems.MANAGER_UUID}
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
                name: t('refRegisters.table.registrator'),
                engName: t('refRegisters.table.registrator'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: RefRegisterFilterItems.REGISTRATOR_UUID,
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectPOForFilter
                            ciType={PO}
                            label={t('refRegisters.table.registrator')}
                            name={RefRegisterFilterItems.REGISTRATOR_UUID}
                            valuesAsUuids={Array.isArray(value) ? [value?.[0]?.value] ?? [] : value?.value ? [value?.value] : []}
                            onChange={(val) => {
                                if (val && val.length && val.every((v) => v && v.uuid != '')) {
                                    onChange({ ...value, value: val?.[0]?.uuid })
                                }
                            }}
                            isMulti={false}
                            additionalData={{
                                metaAttributes: { state: ['DRAFT'] },
                                searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov],
                                attributes: [
                                    {
                                        name: ATTRIBUTE_NAME.EA_Profil_PO_kategoria_osoby,
                                        filterValue: [
                                            {
                                                value: 'c_kategoria_osoba.2',
                                                equality: OPERATOR_OPTIONS.EQUAL,
                                            },
                                        ],
                                    },
                                ],
                            }}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
        ]
    }

    return (
        <Filter<RefRegisterFilter>
            defaultFilterValues={defaultFilterValues}
            heading={<React.Fragment />}
            form={({ filter, setValue, register }) => (
                <div>
                    <Input {...register(RefRegisterFilterItems.NAME)} type="text" label={t('refRegisters.table.name')} />
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
            )}
        />
    )
}
