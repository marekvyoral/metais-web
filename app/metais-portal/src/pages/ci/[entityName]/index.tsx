import { BreadCrumbs, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'

interface Props {
    importantEntityName?: string
}

export interface KSFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const CiListPage: React.FC<Props> = ({ importantEntityName }) => {
    const { entityName: ciType } = useParams()
    const { i18n, t } = useTranslation()
    const defaultFilterValues: KSFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    const entityName = importantEntityName ? importantEntityName : ciType ?? ''

    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
    return (
        <AttributesContainer
            entityName={entityName}
            View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes } }) => {
                return (
                    <>
                        {!importantEntityName && (
                            <BreadCrumbs
                                links={[
                                    { label: t('breadcrumbs.home'), href: '/' },
                                    { label: ciType ?? '', href: `/ci/${ciType}` },
                                ]}
                            />
                        )}
                        <TextHeading size="XL">{i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}</TextHeading>
                        <CiListContainer<KSFilterData>
                            entityName={entityName}
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
                            }) => (
                                <ListWrapper
                                    isNewRelationModal={!!importantEntityName}
                                    defaultFilterValues={defaultFilterValues}
                                    sort={sort}
                                    columnListData={columnListData}
                                    gestorsData={gestorsData}
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

export default CiListPage
