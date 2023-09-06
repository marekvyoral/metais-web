import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'

interface ProjektFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const ProjektListPage: React.FC = () => {
    const { i18n } = useTranslation()
    const ENTITY_NAME = 'Projekt'
    const defaultFilterValues: ProjektFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    return (
        <AttributesContainer
            entityName={ENTITY_NAME}
            View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes } }) => {
                return (
                    <>
                        <TextHeading size="XL">{i18n.language === 'sk' ? ciTypeData?.name : ciTypeData?.engName}</TextHeading>
                        <CiListContainer<ProjektFilterData>
                            entityName={ENTITY_NAME}
                            defaultFilterValues={defaultFilterValues}
                            ListComponent={({
                                data: { columnListData, tableData, gestorsData },
                                handleFilterChange,
                                storeUserSelectedColumns,
                                resetUserSelectedColumns,
                                pagination,
                                sort,
                                isError,
                                isLoading,
                                refetch,
                            }) => (
                                <ListWrapper
                                    gestorsData={gestorsData}
                                    defaultFilterValues={defaultFilterValues}
                                    sort={sort}
                                    columnListData={columnListData}
                                    tableData={tableData}
                                    refetch={refetch}
                                    handleFilterChange={handleFilterChange}
                                    storeUserSelectedColumns={storeUserSelectedColumns}
                                    resetUserSelectedColumns={resetUserSelectedColumns}
                                    pagination={pagination}
                                    attributeProfiles={attributeProfiles}
                                    attributes={attributes}
                                    constraintsData={constraintsData}
                                    unitsData={unitsData}
                                    ciTypeData={ciTypeData}
                                    ciType={ENTITY_NAME}
                                    isLoading={isLoading}
                                    isError={isError}
                                    rowSelectionState={{ rowSelection, setRowSelection }}
                                />
                            )}
                        />
                    </>
                )
            }}
        />
    )
}

export default ProjektListPage
