import { Filter } from '@isdd/idsk-ui-kit/filter'
import { IOption, Input, SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { ENTITY_ISVS, ENTITY_PROJECT, PO } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ListSlaContractsParams } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { SelectPoNeighbours } from '@isdd/metais-common/src/components/select-po-neighbours/SelectPoNeighbours'

import styles from './slaContract.module.scss'

import { StatusFilterOptions } from '@/components/containers/SlaContractListContainer'

type Props = {
    defaultFilterValues: ListSlaContractsParams
    contractPhaseData: EnumType | undefined
}
const MULTI_SELECT_INPUTS_CONSUMER: { code: keyof ListSlaContractsParams; entity: string }[] = [
    {
        code: 'consumerProjectUuid',
        entity: ENTITY_PROJECT,
    },
    {
        code: 'consumerServiceUuid',
        entity: ENTITY_ISVS,
    },
]

const MULTI_SELECT_INPUTS_PROVIDER: { code: keyof ListSlaContractsParams; entity: string }[] = [
    {
        code: 'providerProjectUuid',
        entity: ENTITY_PROJECT,
    },
    {
        code: 'providerServiceUuid',
        entity: ENTITY_ISVS,
    },
]

const NEIGHBOUR_SELECT_PROVIDER = {
    code: 'providerMainPersonUuid',
    entity: PO,
}

const NEIGHBOUR_SELECT_CONSUMER = {
    code: 'consumerMainPersonUuid',
    entity: PO,
}

export const SlaContractListFilter: React.FC<Props> = ({ defaultFilterValues, contractPhaseData }) => {
    const { t } = useTranslation()

    const statusFilterOptions: IOption<string>[] = [
        {
            value: StatusFilterOptions.ALL,
            label: t('slaContracts.view.all'),
        },
        {
            value: StatusFilterOptions.ACTIVE,
            label: t('slaContracts.view.active'),
        },
        {
            value: StatusFilterOptions.INACTIVE,
            label: t('slaContracts.view.inactive'),
        },
    ]

    const contractPhaseOptions: IOption<string>[] =
        contractPhaseData?.enumItems?.map((item) => ({ value: item.code ?? '', label: item.description ?? '', disabled: !item.valid })) ?? []

    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            heading={<></>}
            form={({ register, setValue, filter, control, watch }) => {
                const handleDateChange = (date: Date | null, name: string) => {
                    setValue(name as keyof ListSlaContractsParams, date ? formatDateForDefaultValue(date.toISOString()) : undefined)
                }

                return (
                    <div>
                        <Input {...register('name')} label={t('slaContracts.filter.name')} />
                        <div className={styles.flexBox}>
                            <div className={styles.fullWidth}>
                                <SimpleSelect
                                    label={t('slaContracts.filter.contractPhase')}
                                    name={'phase'}
                                    options={contractPhaseOptions}
                                    setValue={setValue}
                                    defaultValue={filter.phase}
                                />

                                <DateInput
                                    handleDateChange={handleDateChange}
                                    name={'intervalStart'}
                                    control={control}
                                    label={t('slaContracts.filter.intervalStart')}
                                />

                                {MULTI_SELECT_INPUTS_PROVIDER.map((multiSelect) => (
                                    <SelectPOForFilter
                                        isMulti={false}
                                        key={multiSelect.code}
                                        name={multiSelect.code}
                                        ciType={multiSelect.entity}
                                        label={t(`slaContracts.filter.${multiSelect.code}`)}
                                        valuesAsUuids={[filter[multiSelect.code]?.toString() ?? '']}
                                        onChange={(val) => setValue(multiSelect.code, val[0]?.uuid)}
                                    />
                                ))}
                                <SelectPoNeighbours
                                    type="toCiSet"
                                    setValue={setValue}
                                    label={t(`slaContracts.filter.${NEIGHBOUR_SELECT_PROVIDER.code}`)}
                                    name={NEIGHBOUR_SELECT_PROVIDER.code}
                                    nodeType={NEIGHBOUR_SELECT_PROVIDER.entity}
                                    relationshipType="PO_je_spravca_ISVS"
                                    relatedPoUuid={watch('providerServiceUuid') ?? ''}
                                    defaultValue={filter.providerMainPersonUuid ?? ''}
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <SimpleSelect
                                    label={t('slaContracts.filter.statusFilter')}
                                    name={'statusFilter'}
                                    options={statusFilterOptions}
                                    setValue={setValue}
                                    defaultValue={filter.statusFilter}
                                />

                                <DateInput
                                    handleDateChange={handleDateChange}
                                    name={'intervalEnd'}
                                    control={control}
                                    label={t('slaContracts.filter.intervalEnd')}
                                />

                                {MULTI_SELECT_INPUTS_CONSUMER.map((multiSelect) => (
                                    <SelectPOForFilter
                                        isMulti={false}
                                        key={multiSelect.code}
                                        name={multiSelect.code}
                                        ciType={multiSelect.entity}
                                        label={t(`slaContracts.filter.${multiSelect.code}`)}
                                        valuesAsUuids={[filter[multiSelect.code]?.toString() ?? '']}
                                        onChange={(val) => setValue(multiSelect.code, val[0]?.uuid)}
                                    />
                                ))}
                                <SelectPoNeighbours
                                    type="toCiSet"
                                    setValue={setValue}
                                    label={t(`slaContracts.filter.${NEIGHBOUR_SELECT_CONSUMER.code}`)}
                                    name={NEIGHBOUR_SELECT_CONSUMER.code}
                                    nodeType={NEIGHBOUR_SELECT_CONSUMER.entity}
                                    relationshipType="PO_je_spravca_ISVS"
                                    relatedPoUuid={watch('consumerServiceUuid') ?? ''}
                                    defaultValue={filter.consumerMainPersonUuid ?? ''}
                                />
                            </div>
                        </div>
                    </div>
                )
            }}
        />
    )
}
