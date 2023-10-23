import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const POIsListPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_IS')}`
    const PO = 'PO'
    const PO_IS = 'PO_IS'
    const defaultFilterValues: POFilterData = {
        Gen_Profil_nazov: '',
        Gen_Profil_kod_metais: '',
        EA_Profil_PO_kategoria_osoby: [],
        EA_Profil_PO_typ_osoby: [],
        EA_Profil_PO_je_kapitola: undefined,
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('ciType.PO_IS_Heading') ?? '', href: `/ci/${PO_IS}` },
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
                                        POType={PO_IS}
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

export default POIsListPage
