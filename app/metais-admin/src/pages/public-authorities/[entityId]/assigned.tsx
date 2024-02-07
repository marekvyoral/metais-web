import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { PublicAuthoritiesAssignedContainer } from '@/components/containers/public-authorities/PublicAuthoritiesAssignedContainer'
import { PublicAuthoritiesDetailContainer } from '@/components/containers/public-authorities/PublicAuthoritiesDetailContainer'
import { PublicAuthoritiesAssignedFilter } from '@/components/filters/PublicAuthoritiesAssignedFilter'
import { PublicAuthoritiesAssignedTable } from '@/components/table/PublicAuthoritiesAssignedTable'
import { getIcoFromPO, getNameFromPo } from '@/components/views/public-authorities/helpers/formatting'
import { PublicAuthoritiesFilterData } from '@/pages/public-authorities/list'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Assigned = () => {
    const entityName = 'PO'
    const { entityId } = useParams()
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const [selectedRows, setSelectedRows] = useState<ConfigurationItemUi[]>([])
    const defaultFilterValues: PublicAuthoritiesFilterData = {
        Gen_Profil_nazov: '',
        EA_Profil_PO_kategoria_osoby: '',
        EA_Profil_PO_ico: '',
        onlyFreePO: true,
    }
    const defaultFilterOperators: PublicAuthoritiesFilterData = {
        EA_Profil_PO_kategoria_osoby: OPERATOR_OPTIONS.EQUAL,
    }

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <>
            <PublicAuthoritiesDetailContainer
                entityId={entityId ?? ''}
                View={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('navMenu.publicAuthorities.publicAuthorities'), href: AdminRouteNames.PUBLIC_AUTHORITIES_LIST },
                                {
                                    label: `${t('publicAuthorities.assigned.heading')} - ${getNameFromPo(props?.data?.configurationItem)}`,
                                    href: `${AdminRouteNames.PUBLIC_AUTHORITIES}/${entityId}/assigned}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <PublicAuthoritiesAssignedContainer
                                entityId={entityId ?? ''}
                                entityName={entityName}
                                icoOfDetailOrg={getIcoFromPO(props?.data?.configurationItem) ?? ''}
                                defaultFilterValues={defaultFilterValues}
                                defaultFilterOperators={defaultFilterOperators}
                                View={({ handleFilterChange, data, pagination, sort, isLoading, isError, onSubmit }) => (
                                    <QueryFeedback loading={isLoading || props.isLoading} error={props.isError} withChildren>
                                        <FlexColumnReverseWrapper>
                                            <TextHeading size="XL">{`${t('publicAuthorities.assigned.heading')} - ${getNameFromPo(
                                                props?.data?.configurationItem,
                                            )}`}</TextHeading>
                                            <div ref={wrapperRef}>
                                                {isActionSuccess.value && (
                                                    <MutationFeedback
                                                        error={false}
                                                        success={isActionSuccess.value}
                                                        successMessage={t('publicAuthorities.assigned.successFeedback')}
                                                    />
                                                )}

                                                {!isActionSuccess.value && isActionSuccess.additionalInfo?.type === 'error' && (
                                                    <QueryFeedback
                                                        error
                                                        errorProps={{ errorMessage: t('publicAuthorities.assigned.unsuccessFeedback') }}
                                                        loading={false}
                                                    />
                                                )}
                                            </div>
                                        </FlexColumnReverseWrapper>
                                        <PublicAuthoritiesAssignedFilter defaultFilterValues={defaultFilterValues} />
                                        <PublicAuthoritiesAssignedTable
                                            data={data?.tableData}
                                            assignedOrganizations={data?.assignedOrganizations}
                                            handleFilterChange={handleFilterChange}
                                            pagination={pagination}
                                            sort={sort}
                                            isLoading={isLoading}
                                            error={isError}
                                            setSelectedRows={setSelectedRows}
                                            selectedRows={selectedRows}
                                            onSubmit={onSubmit}
                                        />
                                    </QueryFeedback>
                                )}
                            />
                        </MainContentWrapper>
                    </>
                )}
            />
        </>
    )
}

export default Assigned
