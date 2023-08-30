import { TextHeading } from '@isdd/idsk-ui-kit'
import { ConfigurationItemUi } from '@isdd/metais-common/api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { OrganizationsAssignedContainer } from '@/components/containers/organizations/OrganizationsAssignedContainer'
import { OrganizationsDetailContainer } from '@/components/containers/organizations/OrganizationsDetailContainer'
import { OrganizationAssignedFilter } from '@/components/filters/OrganizationAssignedFilter'
import { OrganizationsAssignedTable } from '@/components/table/OrganizationAssingedTable'
import { getIcoFromPO, getNameFromPo } from '@/components/views/organizations/helpers/formatting'
import { OrganizationFilterData } from '@/pages/organizations/organizations'

const Assigned = () => {
    const entityName = 'PO'
    const { entityId } = useParams()
    const { t } = useTranslation()
    const [onlyFreePOChecked, setOnlyFreePOChecked] = useState<boolean>(true)
    const [selectedRows, setSelectedRows] = useState<ConfigurationItemUi[]>([])
    const defaultFilterValues: OrganizationFilterData = {
        Gen_Profil_nazov: '',
        EA_Profil_PO_kategoria_osoby: [],
        EA_Profil_PO_ico: '',
    }
    return (
        <OrganizationsDetailContainer
            entityId={entityId ?? ''}
            View={(props) => (
                <OrganizationsAssignedContainer
                    entityId={entityId ?? ''}
                    entityName={entityName}
                    onlyFreePO={!onlyFreePOChecked}
                    icoOfDetailOrg={getIcoFromPO(props?.data?.configurationItem) ?? ''}
                    defaultFilterValues={defaultFilterValues}
                    View={({ handleFilterChange, data, pagination, sort, isLoading, isError, onSubmit }) => (
                        <>
                            <TextHeading size="M">{`${t('organizations.assigned.heading')} - ${getNameFromPo(
                                props?.data?.configurationItem,
                            )}`}</TextHeading>
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
                        </>
                    )}
                />
            )}
        />
    )
}

export default Assigned
