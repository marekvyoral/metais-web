import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const POPOListPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_PO')}`
    const PO = 'PO'
    const PO_PO = 'PO_PO'
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
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('ciType.PO_PO_Heading') ?? '', href: `/ci/${PO_PO}` },
                ]}
            />
            <MainContentWrapper>
                <AttributesContainer
                    entityName={PO}
                    View={({ data: attributesData, isError: isAttError, isLoading: isAttLoading }) => {
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
                                        POType={PO_PO}
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

export default POPOListPage
