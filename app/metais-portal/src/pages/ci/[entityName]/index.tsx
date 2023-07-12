import React from 'react'
import { useParams } from 'react-router-dom'
import { Filter } from '@isdd/idsk-ui-kit/filter/Filter'
import { Input } from '@isdd/idsk-ui-kit/input/Input'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { DynamicFilterAttributes } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { useTranslation } from 'react-i18next'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ActionsOverTable } from '@/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@/components/constants'

interface KSFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const ProjektListPage = () => {
    const { entityName } = useParams()
    const { t } = useTranslation()
    const defaultFilterValues: KSFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: { constraintsData, unitsData, ciTypeData } }) => {
                return (
                    <CiListContainer<KSFilterData>
                        entityName={entityName ?? ''}
                        defaultFilterValues={defaultFilterValues}
                        ListComponent={({ data: { columnListData, tableData }, handleFilterChange, pagination, sort }) => (
                            <>
                                <Filter<KSFilterData>
                                    defaultFilterValues={defaultFilterValues}
                                    form={(register, control, filter, setValue) => (
                                        <div>
                                            <Input
                                                id="name"
                                                label={t(`filter.${entityName}.name`)}
                                                placeholder={t(`filter.namePlaceholder`)}
                                                {...register('Gen_Profil_nazov')}
                                            />
                                            <Input
                                                id="metais-code"
                                                label={t('filter.metaisCode.label')}
                                                placeholder={t('filter.metaisCode.placeholder')}
                                                {...register('Gen_Profil_kod_metais')}
                                            />
                                            <DynamicFilterAttributes
                                                setValue={setValue}
                                                data={filter.attributeFilters}
                                                availableAttributes={columnListData?.attributes}
                                            />
                                        </div>
                                    )}
                                />
                                <ActionsOverTable
                                    handleFilterChange={handleFilterChange}
                                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    //storeUserSelectedColumns={storeUserSelectedColumns}
                                    // resetUserSelectedColumns={resetUserSelectedColumns}
                                    //  pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                    entityName={entityName ?? ''}
                                />
                                <CiTable
                                    data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
                                    handleFilterChange={handleFilterChange}
                                    pagination={pagination}
                                    sort={sort}
                                />
                            </>
                        )}
                    />
                )
            }}
        />
    )
}

export default ProjektListPage
