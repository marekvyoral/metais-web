import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useEffect, useState } from 'react'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { PublicAuthoritiesListContainer } from '@/components/containers/Egov/Entity/PublicAuthoritiesListContainer'
import OrganizationFilter from '@/components/filters/PublicAuthoritiesFilter'
import { PublicAuthoritiesTable } from '@/components/table/PublicAuthoritiesTable'

export interface PublicAuthoritiesFilterData extends IFilterParams {
    Gen_Profil_nazov?: string
    EA_Profil_PO_typ_osoby?: string[]
    EA_Profil_PO_ico?: string
    EA_Profil_PO_kategoria_osoby?: string
    state?: string
    onlyFreePO?: boolean
}

const PublicAuthoritiesPage = () => {
    const entityName = 'PO'
    const defaultFilterValues: PublicAuthoritiesFilterData = {
        Gen_Profil_nazov: '',
        EA_Profil_PO_typ_osoby: [],
        EA_Profil_PO_ico: '',
        state: 'ALL',
        onlyFreePO: true,
    }
    const { t } = useTranslation()
    const { wrapperRef: mutationRef, scrollToMutationFeedback: mutationScroll } = useScroll()
    const { isActionSuccess } = useActionSuccess()
    const [isInvalidateError, setIsInvalidateError] = useState(false)
    useEffect(() => {
        if (isActionSuccess.value || isInvalidateError) {
            mutationScroll()
        }
    }, [isActionSuccess, isInvalidateError, mutationScroll])
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('navMenu.publicAuthorities.publicAuthorities') ?? '', href: AdminRouteNames.PUBLIC_AUTHORITIES_LIST },
                ]}
            />
            <PublicAuthoritiesListContainer<PublicAuthoritiesFilterData>
                entityName={entityName}
                defaultFilterValues={defaultFilterValues}
                setIsInvalidateError={setIsInvalidateError}
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
                    setValid,
                }) => {
                    return (
                        <MainContentWrapper>
                            <QueryFeedback withChildren loading={isLoading} error={false}>
                                <FlexColumnReverseWrapper>
                                    <TextHeading size="XL">{t('navMenu.publicAuthorities.publicAuthorities')}</TextHeading>
                                    {(isInvalidateError || isActionSuccess.value) && (
                                        <div ref={mutationRef}>
                                            <MutationFeedback
                                                error={
                                                    !isActionSuccess.value
                                                        ? isActionSuccess.additionalInfo?.type === 'invalid'
                                                            ? t('mutationFeedback.invalidatePOError')
                                                            : t('mutationFeedback.validatePOError')
                                                        : ''
                                                }
                                                success={isActionSuccess.value}
                                                successMessage={
                                                    isActionSuccess.additionalInfo?.type === 'invalid'
                                                        ? t('mutationFeedback.invalidatePOSuccess')
                                                        : t('mutationFeedback.validatePOSuccess')
                                                }
                                                onMessageClose={() => setIsInvalidateError(false)}
                                            />
                                        </div>
                                    )}
                                </FlexColumnReverseWrapper>
                                <OrganizationFilter defaultFilterValues={defaultFilterValues} />
                                <PublicAuthoritiesTable
                                    data={tableData}
                                    handleFilterChange={handleFilterChange}
                                    storeUserSelectedColumns={storeUserSelectedColumns}
                                    resetUserSelectedColumns={resetUserSelectedColumns}
                                    pagination={pagination}
                                    sort={sort}
                                    isLoading={isLoading}
                                    error={isError}
                                    setInvalid={setInvalid}
                                    setValid={setValid}
                                />
                            </QueryFeedback>
                        </MainContentWrapper>
                    )
                }}
            />
        </>
    )
}

export default PublicAuthoritiesPage
