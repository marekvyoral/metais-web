import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit'
import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { OPERATOR_OPTIONS } from '@isdd/metais-common/hooks/useFilter'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { OrganizationsAssignedContainer } from '@/components/containers/organizations/OrganizationsAssignedContainer'
import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'
import { OrganizationAssignedFilter } from '@/components/filters/OrganizationAssignedFilter'
import { OrganizationsAssignedTable } from '@/components/table/OrganizationAssingedTable'
import { getIcoFromPO, getNameFromPo } from '@/components/views/organizations/helpers/formatting'
import { OrganizationFilterData } from '@/pages/organizations/organizations'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const Assigned = () => {
    const entityName = 'PO'
    const { entityId } = useParams()
    const { t } = useTranslation()
    const [onlyFreePOChecked, setOnlyFreePOChecked] = useState<boolean>(true)
    const [selectedRows, setSelectedRows] = useState<ConfigurationItemUi[]>([])
    const defaultFilterValues: OrganizationFilterData = {
        Gen_Profil_nazov: '',
        EA_Profil_PO_kategoria_osoby: '',
        EA_Profil_PO_ico: '',
    }
    const defaultFilterOperators: OrganizationFilterData = {
        EA_Profil_PO_kategoria_osoby: OPERATOR_OPTIONS.EQUAL,
    }
    return (
        <>
            <OrganizationsDetailContainer
                entityId={entityId ?? ''}
                View={(props) => (
                    <>
                        <BreadCrumbs
                            withWidthContainer
                            links={[
                                { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                                { label: t('navMenu.organizations'), href: AdminRouteNames.ORGANIZATIONS },
                                {
                                    label: `${t('organizations.assigned.heading')} - ${getNameFromPo(props?.data?.configurationItem)}`,
                                    href: `${AdminRouteNames.ORGANIZATIONS}/${entityId}/assigned}`,
                                },
                            ]}
                        />
                        <MainContentWrapper>
                            <OrganizationsAssignedContainer
                                entityId={entityId ?? ''}
                                entityName={entityName}
                                onlyFreePO={!onlyFreePOChecked}
                                icoOfDetailOrg={getIcoFromPO(props?.data?.configurationItem) ?? ''}
                                defaultFilterValues={defaultFilterValues}
                                defaultFilterOperators={defaultFilterOperators}
                                View={({ handleFilterChange, data, pagination, sort, isLoading, isError, onSubmit }) => (
                                    <QueryFeedback loading={isLoading || props.isLoading} error={false} withChildren>
                                        <FlexColumnReverseWrapper>
                                            <TextHeading size="M">{`${t('organizations.assigned.heading')} - ${getNameFromPo(
                                                props?.data?.configurationItem,
                                            )}`}</TextHeading>
                                            {(isError || props.isError) && <QueryFeedback error loading={false} />}
                                        </FlexColumnReverseWrapper>
                                        <OrganizationAssignedFilter
                                            defaultFilterValues={defaultFilterValues}
                                            onlyFreePO={{ onlyFreePOChecked, setOnlyFreePOChecked }}
                                        />
                                        <OrganizationsAssignedTable
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
