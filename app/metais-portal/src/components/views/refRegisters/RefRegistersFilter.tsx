import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IOption, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import style from '@isdd/idsk-ui-kit/select-lazy-loading/selectLazyLoading.module.scss'
import { GetFOPReferenceRegisters1Muk, GetFOPReferenceRegisters1State } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { useTranslation } from 'react-i18next'
import { OptionProps } from 'react-select'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import {
    SelectFilterOrganization,
    SelectFilterOrganizationOptionType,
} from '@isdd/metais-common/components/select-organization/SelectFilterOrganization'

import { RefRegisterFilter, RefRegisterFilterItems } from '@/types/filters'

interface IRefRegistersFilter {
    defaultFilterValues: RefRegisterFilter
}

export const RefRegistersFilter = ({ defaultFilterValues }: IRefRegistersFilter) => {
    const { t } = useTranslation()

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

    return (
        <Filter<RefRegisterFilter>
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ filter, setValue }) => (
                <div>
                    <SelectFilterOrganization<RefRegisterFilter>
                        filter={filter}
                        setValue={setValue}
                        option={(row) => registryNameOption(row)}
                        name={RefRegisterFilterItems.ISVS_UUID}
                        label={t('refRegisters.table.name')}
                        additionalData={{
                            metaAttributes: { state: ['DRAFT', 'APPROVED_BY_OWNER', 'AWAITING_APPROVAL'] },
                            type: ['ISVS'],
                            searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov, ATTRIBUTE_NAME.Gen_Profil_kod_metais],
                        }}
                    />

                    <SelectFilterOrganization<RefRegisterFilter>
                        filter={filter}
                        setValue={setValue}
                        name={RefRegisterFilterItems.MANAGER_UUID}
                        label={t('refRegisters.table.manager')}
                        additionalData={{
                            metaAttributes: { state: ['DRAFT'] },
                            searchFields: [ATTRIBUTE_NAME.Gen_Profil_nazov],
                        }}
                    />
                    <SelectFilterOrganization<RefRegisterFilter>
                        filter={filter}
                        setValue={setValue}
                        name={RefRegisterFilterItems.REGISTRATOR_UUID}
                        label={t('refRegisters.table.registrator')}
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

                    <SimpleSelect
                        label={t('refRegisters.table.state.heading')}
                        name={RefRegisterFilterItems.STATE}
                        options={states}
                        setValue={setValue}
                        defaultValue={filter.state}
                    />
                    <SimpleSelect
                        label={t('refRegisters.table.muk.heading')}
                        name={RefRegisterFilterItems.MUK}
                        options={mukOptions}
                        setValue={setValue}
                        defaultValue={filter.muk}
                    />
                </div>
            )}
        />
    )
}
