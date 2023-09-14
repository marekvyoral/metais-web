import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiListContainer } from '@/components/containers/CiListContainer'
import { ListWrapper } from '@/components/list-wrapper/ListWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface Props {
    importantEntityName?: string
}
export interface KSFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    Gen_Profil_kod_metais?: string
}
const CiListPage: React.FC<Props> = ({ importantEntityName }) => {
    const { entityName: ciType } = useParams()
    const { t } = useTranslation()
    const defaultFilterValues: KSFilterData = { Gen_Profil_nazov: '', Gen_Profil_kod_metais: '' }

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

            <MainContentWrapper>
                <AttributesContainer
                    entityName={entityName}
                    View={({
                        data: { attributeProfiles, constraintsData, unitsData, ciTypeData, attributes },
                        isError: attError,
                        isLoading: attLoading,
                    }) => {
                        return (
                            <>
                                <CiListContainer<KSFilterData>
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
                                    )}
                                />
                            </>
                        )
                    }}
                />
            </MainContentWrapper>
        </>
    )
}

export default CiListPage
