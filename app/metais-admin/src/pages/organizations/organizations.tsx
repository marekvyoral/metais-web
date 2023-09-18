import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { OraganizationsListContainer } from '@/components/containers/Egov/Entity/OrganizationsListContainer'
import OrganizationFilter from '@/components/filters/OrganizationFilter'
import { OrganizationsTable } from '@/components/table/OrganizationsTable'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export interface OrganizationFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    EA_Profil_PO_typ_osoby?: string[]
    EA_Profil_PO_ico?: string
    EA_Profil_PO_kategoria_osoby?: string
}

const Organizations = () => {
    const entityName = 'PO'
    const defaultFilterValues: OrganizationFilterData = { Gen_Profil_nazov: '', EA_Profil_PO_typ_osoby: [], EA_Profil_PO_ico: '' }
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.organizations') ?? '', href: '/' + AdminRouteNames.ORGANIZATIONS },
                ]}
            />
            <OraganizationsListContainer<OrganizationFilterData>
                entityName={entityName}
                defaultFilterValues={defaultFilterValues}
                ListComponent={({
                    data: { tableData },
                    handleFilterChange,
                    storeUserSelectedColumns,
                    resetUserSelectedColumns,
                    pagination,
                    sort,
                    isError,
                    isLoading,
                    setInvalid,
                }) => (
                    <MainContentWrapper>
                        <QueryFeedback withChildren loading={isLoading} error={false}>
                            <FlexColumnReverseWrapper>
                                <TextHeading size="XL">{t('navMenu.organizations')}</TextHeading>
                                {isError && <QueryFeedback error={isError} loading={false} />}
                            </FlexColumnReverseWrapper>
                            <OrganizationFilter defaultFilterValues={defaultFilterValues} />
                            <OrganizationsTable
                                data={tableData}
                                handleFilterChange={handleFilterChange}
                                storeUserSelectedColumns={storeUserSelectedColumns}
                                resetUserSelectedColumns={resetUserSelectedColumns}
                                pagination={pagination}
                                sort={sort}
                                isLoading={isLoading}
                                error={isError}
                                setInvalid={setInvalid}
                            />
                        </QueryFeedback>
                    </MainContentWrapper>
                )}
            />
        </>
    )
}

export default Organizations
