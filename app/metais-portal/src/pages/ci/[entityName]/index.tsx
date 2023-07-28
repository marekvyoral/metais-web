import React from 'react'
import { useParams } from 'react-router-dom'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/index'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'

export interface KSFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const ProjektListPage = () => {
    const { entityName: ciType } = useParams()
    const { i18n } = useTranslation()
    const defaultFilterValues: KSFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    return (
        <AttributesContainer
            entityName={ciType ?? ''}
            View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes } }) => {
                return (
                    <>
                        <TextHeading size="XL">{i18n.language === 'sk' ? ciTypeData?.name : ciTypeData?.engName}</TextHeading>
                        <CiListContainer<KSFilterData>
                            entityName={ciType ?? ''}
                            defaultFilterValues={defaultFilterValues}
                            ListComponent={({
                                data: { columnListData, tableData },
                                handleFilterChange,
                                storeUserSelectedColumns,
                                resetUserSelectedColumns,
                                pagination,
                                sort,
                                isError,
                                isLoading,
                            }) => (
                                <ListWrapper
                                    defaultFilterValues={defaultFilterValues}
                                    sort={sort}
                                    columnListData={columnListData}
                                    tableData={tableData}
                                    handleFilterChange={handleFilterChange}
                                    storeUserSelectedColumns={storeUserSelectedColumns}
                                    resetUserSelectedColumns={resetUserSelectedColumns}
                                    pagination={pagination}
                                    attributeProfiles={attributeProfiles}
                                    attributes={attributes}
                                    constraintsData={constraintsData}
                                    unitsData={unitsData}
                                    ciTypeData={ciTypeData}
                                    ciType={ciType}
                                    isLoading={isLoading}
                                    isError={isError}
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
