import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { IFilterParams, OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { ENTITY_KRIS } from '@isdd/metais-common/constants'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { KrisListView } from '@/components/views/ci/kris/KrisListView'

interface Props {
    importantEntityName?: string
    noSideMenu?: boolean
}

export interface KRISFilterType extends IFilterParams {
    owner?: string
    Profil_KRIS_stav_kris?: string
}

const KRISListPage: React.FC<Props> = ({ importantEntityName, noSideMenu }) => {
    const ciType = ENTITY_KRIS
    const { t } = useTranslation()
    document.title = `${t('titles.ciList', { ci: ciType })} | MetaIS`

    const defaultFilterValues: KRISFilterType = { owner: '', Profil_KRIS_stav_kris: '' }
    const defaultFilterOperators: KRISFilterType = { Profil_KRIS_stav_kris: OPERATOR_OPTIONS.EQUAL, owner: OPERATOR_OPTIONS.EQUAL }

    const entityName = importantEntityName ? importantEntityName : ciType ?? ''

    return (
        <>
            {!importantEntityName && (
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                        { label: ciType ?? '', href: `/ci/${ciType}` },
                    ]}
                />
            )}
            <MainContentWrapper noSideMenu={noSideMenu}>
                <AttributesContainer
                    entityName={entityName}
                    View={({
                        data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes },
                        isError: attError,
                        isLoading: attLoading,
                    }) => {
                        return (
                            <CiListContainer<KRISFilterType>
                                entityName={entityName}
                                defaultFilterValues={defaultFilterValues}
                                defaultFilterOperators={defaultFilterOperators}
                                ListComponent={({
                                    data: { columnListData, tableData, gestorsData },
                                    handleFilterChange,
                                    storeUserSelectedColumns,
                                    resetUserSelectedColumns,
                                    refetch,
                                    pagination,
                                    sort,
                                    isError: ciListError,
                                    isLoading: ciListLoading,
                                }) => (
                                    <KrisListView
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
                                        refetch={refetch}
                                        isLoading={[ciListLoading, attLoading].some((item) => item)}
                                        isError={[ciListError, attError].some((item) => item)}
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

export default KRISListPage
