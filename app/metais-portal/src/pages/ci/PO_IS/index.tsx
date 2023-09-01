import { CreateEntityButton, ExportButton, ImportButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCiDefaultMetaAttributes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { useTranslation } from 'react-i18next'

import { CiTable } from '@/components/ci-table/CiTable'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { FilterPO, POFilterData } from '@/components/entities/projekt/Filters/FilterPO'

const POIsListPage = () => {
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const PO = 'PO'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: [],
        EA_Profil_PO_typ_osoby: [],
        EA_Profil_PO_je_kapitola: undefined,
    }

    return (
        <>
            <AttributesContainer
                entityName={PO}
                View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes } }) => {
                    return (
                        <CiListContainer<POFilterData>
                            entityName={PO}
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
                                <>
                                    <FilterPO
                                        entityName={PO}
                                        availableAttributes={columnListData?.attributes}
                                        defaultFilterValues={defaultFilterValues}
                                        attributeProfiles={attributeProfiles}
                                        attributes={attributes}
                                        constraintsData={constraintsData}
                                    />
                                    <ActionsOverTable
                                        metaAttributesColumnSection={getCiDefaultMetaAttributes(t)}
                                        handleFilterChange={handleFilterChange}
                                        storeUserSelectedColumns={storeUserSelectedColumns}
                                        resetUserSelectedColumns={resetUserSelectedColumns}
                                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                        entityName={ciTypeData?.name ?? ''}
                                        attributeProfiles={attributeProfiles ?? []}
                                        attributes={attributes ?? []}
                                        columnListData={columnListData}
                                        createButton={
                                            <CreateEntityButton onClick={() => navigate(`/ci/${PO}/create`, { state: { from: location } })} />
                                        }
                                        exportButton={<ExportButton />}
                                        importButton={<ImportButton ciType={PO} />}
                                    />
                                    <CiTable
                                        data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData, gestorsData }}
                                        handleFilterChange={handleFilterChange}
                                        pagination={pagination}
                                        sort={sort}
                                        rowSelectionState={{ rowSelection, setRowSelection }}
                                        isLoading={isLoading}
                                        isError={isError}
                                    />
                                </>
                            )}
                        />
                    )
                }}
            />
        </>
    )
}

export default POIsListPage
