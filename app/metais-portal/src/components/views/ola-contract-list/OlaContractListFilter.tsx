import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Input, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { IFilter, MetaAttributesState, SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { ConfigurationItemUi, useReadCiList1, useReadCiList1Hook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ISVSSelect } from './ISVSSelect'
import styles from './olaContract.module.scss'

import { IAdditionalFilterField } from '@/components/containers/OlaContractListContainer'

type Props = {
    defaultFilterValues: IAdditionalFilterField & IFilter
}

export const OlaContractListFilter: React.FC<Props> = ({ defaultFilterValues }) => {
    const { t } = useTranslation()
    const { filter } = useFilterParams<IFilter & IAdditionalFilterField>(defaultFilterValues)
    const loadServices = useReadCiList1Hook()
    const [seed, setSeed] = useState(1)
    const [selectedLiableEntities, setSelectedLiableEntities] = useState<ConfigurationItemUi[]>([])

    const { refetch } = useReadCiList1(
        {
            filter: { type: ['PO'], uuid: filter.liableEntities },
        },
        { query: { enabled: filter.liableEntities && filter.liableEntities?.length > 0 } },
    )

    useEffect(() => {
        if (selectedLiableEntities.length === 0 && (filter.liableEntities?.length || 0) !== 0) {
            refetch().then((res) => setSelectedLiableEntities(res.data?.configurationItemSet || []))
        }
    }, [filter.liableEntities, refetch, selectedLiableEntities])

    const loadOptionsPO = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1
        const response = await loadServices({
            filter: {
                fullTextSearch: searchQuery,
                type: ['PO'],
                uuid: [],
                searchFields: ['Gen_Profil_nazov', 'Gen_Profil_kod_metais'],
                metaAttributes: {
                    state: [MetaAttributesState.DRAFT],
                },
            },
            page: page,
            perpage: 50,
            sortBy: SortBy.GEN_PROFIL_NAZOV,
            sortType: SortType.ASC,
        })

        const options = response.configurationItemSet
        return {
            options: options || [],
            hasMore: page < (response.pagination?.totalPages ?? 0),
            additional: {
                page: page,
            },
        }
    }
    useEffect(() => {
        setSeed(Math.random())
    }, [selectedLiableEntities])

    return (
        <Filter
            defaultFilterValues={defaultFilterValues}
            onlyForm
            heading={<></>}
            form={({ register, setValue, control }) => {
                return (
                    <div>
                        <Input {...register('name')} label={t('olaContracts.filter.name')} />
                        <Input {...register('contractCode')} label={t('olaContracts.filter.contractCode')} />
                        <Input {...register('metaIsCode')} label={t('olaContracts.filter.metaIsCode')} />
                        <div className={styles.flexBox}>
                            <div className={styles.fullWidth}>
                                <DateInput
                                    setValue={setValue}
                                    name={'validityStart'}
                                    control={control}
                                    label={t('olaContracts.filter.intervalStart')}
                                />
                            </div>
                            <div className={styles.fullWidth}>
                                <DateInput setValue={setValue} name={'validityEnd'} control={control} label={t('olaContracts.filter.intervalEnd')} />
                            </div>
                        </div>
                        <ISVSSelect setValue={setValue} name="contractorIsvsUuid" errors={{}} filterUuid={filter.contractorIsvsUuid} />
                        <SelectLazyLoading
                            key={seed}
                            isMulti
                            id="liableEntities"
                            getOptionLabel={(item: ConfigurationItemUi) => item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                            getOptionValue={(item: ConfigurationItemUi) => item.uuid ?? ''}
                            loadOptions={(searchTerm, _, additional) => loadOptionsPO(searchTerm, additional)}
                            label={t('olaContracts.filter.liableEntities')}
                            name="liableEntities"
                            setValue={setValue}
                            defaultValue={selectedLiableEntities}
                        />
                    </div>
                )
            }}
        />
    )
}
