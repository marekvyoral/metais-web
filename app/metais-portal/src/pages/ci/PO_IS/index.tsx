import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, TextHeading } from '@isdd/idsk-ui-kit/index'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { POFilterData } from '@/components/entities/projekt/Filters/FilterPO'
import { POView } from '@/components/views/ci/PO/POView'

const POIsListPage = () => {
    const { t } = useTranslation()
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
            <AttributesContainer
                entityName={PO}
                View={({ data: attributesData }) => {
                    return (
                        <>
                            <BreadCrumbs
                                links={[
                                    { label: t('breadcrumbs.home'), href: '/' },
                                    { label: t('ciType.PO_IS_Heading') ?? '', href: `/ci/${PO_IS}` },
                                ]}
                            />

                            <TextHeading size="XL">{t('ciType.PO_IS_Heading')}</TextHeading>
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
                                        isError={isError}
                                        isLoading={isLoading}
                                        entityName={PO}
                                        defaultFilterValues={defaultFilterValues}
                                    />
                                )}
                            />
                        </>
                    )
                }}
            />
        </>
    )
}

export default POIsListPage
