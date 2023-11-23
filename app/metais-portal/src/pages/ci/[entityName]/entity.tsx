import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { Languages } from '@isdd/metais-common/localization/languages'

import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

interface Props {
    importantEntityName?: string
    noSideMenu?: boolean
}
export interface CIFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const CiListPage: React.FC<Props> = ({ importantEntityName, noSideMenu }) => {
    const { entityName: ciType } = useGetEntityParamsFromUrl()
    const { t, i18n } = useTranslation()
    document.title = `${t('titles.ciList', { ci: ciType })} | MetaIS`
    const defaultFilterValues: CIFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

    const entityName = importantEntityName ? importantEntityName : ciType ?? ''
    return (
        <AttributesContainer
            entityName={entityName}
            View={({ data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes }, isError: attError, isLoading: attLoading }) => {
                return (
                    <CiListContainer<CIFilterData>
                        entityName={entityName}
                        defaultFilterValues={defaultFilterValues}
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
                            <>
                                {!importantEntityName && (
                                    <BreadCrumbs
                                        withWidthContainer
                                        links={[
                                            { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                            {
                                                label: `${i18n.language == Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName}`,
                                                href: `/ci/${ciType}`,
                                            },
                                        ]}
                                    />
                                )}
                                <MainContentWrapper noSideMenu={noSideMenu}>
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
                                        refetch={refetch}
                                        isLoading={[ciListLoading, attLoading].some((item) => item)}
                                        isError={[ciListError, attError].some((item) => item)}
                                    />
                                </MainContentWrapper>
                            </>
                        )}
                    />
                )
            }}
        />
    )
}

export default CiListPage
