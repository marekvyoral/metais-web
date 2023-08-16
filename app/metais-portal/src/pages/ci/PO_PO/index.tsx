import React, { useState } from 'react'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { CreateEntityButton, ExportButton, ImportButton } from '@isdd/metais-common/components/actions-over-table'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { CiTable } from '@/components/ci-table/CiTable'
import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { FilterPO, POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'

const ProjektListPage = () => {
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})

    const PO = 'PO'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: ['c_kategoria_osoba.2'],
        EA_Profil_PO_typ_osoby: [
            'c_typ_osoby.b',
            'c_typ_osoby.c1',
            'c_typ_osoby.c2',
            'c_typ_osoby.d1',
            'c_typ_osoby.d2',
            'c_typ_osoby.d3',
            'c_typ_osoby.d4',
            'c_typ_osoby.e',
            'c_typ_osoby.f',
            'c_typ_osoby.g',
        ],
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
                                data: { columnListData, tableData },
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
                                        handleFilterChange={handleFilterChange}
                                        storeUserSelectedColumns={storeUserSelectedColumns}
                                        resetUserSelectedColumns={resetUserSelectedColumns}
                                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                                        entityName={ciTypeData?.name ?? ''}
                                        attributeProfiles={attributeProfiles ?? []}
                                        attributes={attributes ?? []}
                                        columnListData={columnListData}
                                        createButton={<CreateEntityButton path={`/ci/${PO}/create`} />}
                                        exportButton={<ExportButton />}
                                        importButton={<ImportButton ciType={PO} />}
                                    />
                                    <CiTable
                                        data={{ columnListData, tableData, constraintsData, unitsData, entityStructure: ciTypeData }}
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

export default ProjektListPage
