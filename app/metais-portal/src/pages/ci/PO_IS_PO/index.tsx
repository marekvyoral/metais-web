import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const POIsPOListPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_IS_PO')}`
    const PO = 'PO'
    const PO_IS_PO = 'PO_IS_PO'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: ['c_kategoria_osoba.1'],
        EA_Profil_PO_typ_osoby: [],
        EA_Profil_PO_je_kapitola: undefined,
        evidence_status: ['DRAFT'],
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('ciType.PO_IS_PO_Heading') ?? '', href: `/ci/${PO_IS_PO}` },
                ]}
            />
            <MainContentWrapper>
                <AttributesContainer
                    entityName={PO}
                    View={({ data: attributesData, isLoading: isAttLoading, isError: isAttError }) => {
                        return (
                            <CiListContainer<POFilterData>
                                entityName={PO}
                                defaultFilterValues={defaultFilterValues}
                                ListComponent={({
                                    data: ciListData,
                                    handleFilterChange,
                                    storeUserSelectedColumns,
                                    resetUserSelectedColumns,
                                    pagination,
                                    sort,
                                    isError,
                                    isLoading,
                                }) => (
                                    <POView
                                        attributesData={attributesData}
                                        ciListData={ciListData}
                                        handleFilterChange={handleFilterChange}
                                        storeUserSelectedColumns={storeUserSelectedColumns}
                                        resetUserSelectedColumns={resetUserSelectedColumns}
                                        pagination={pagination}
                                        sort={sort}
                                        isError={[isError, isAttError].some((item) => item)}
                                        isLoading={[isLoading, isAttLoading].some((item) => item)}
                                        entityName={PO}
                                        defaultFilterValues={defaultFilterValues}
                                        POType={PO_IS_PO}
                                    />
                                )}
                            />
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default POIsPOListPage
