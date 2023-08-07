import { Filter, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/src/index'
import { Identity, useFind1Hook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/src/api'
import React, { useCallback, useState } from 'react'

import { DEFAULT_ROLES } from './defaultRoles'

import { FilterParams } from '@/pages/standardization/groupdetail/[id]'

interface filterProps {
    listFilter: FilterParams
    setListFilter: React.Dispatch<React.SetStateAction<FilterParams>>
    defaultFilterValues: FilterParams
}

const KSIVSFilter: React.FC<filterProps> = ({ listFilter, setListFilter, defaultFilterValues }) => {
    // const { t } = useTranslation()

    const [selectedMember, setSelectedMember] = useState<Identity>()
    const [selectedOrganization, setSelectedOrganization] = useState<ConfigurationItemUi>()
    const [selectedRole, setSelectedRole] = useState<string>()
    const loadOrgs = useReadCiList1Hook()
    // const { filter, handleFilterChange } = useFilterParams<FilterParams>(defaultFilterValues)
    // const { onSubmit } = useFilter(defaultFilterValues)
    const loadMembers = useFind1Hook()
    const loadMembersOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<Identity>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const queryParams = {
                limit: 50,
                page: page,
            }
            const identities = await loadMembers(queryParams.page, queryParams.limit, { expression: searchQuery })
            return {
                options: identities || [],
                hasMore: identities?.length ? true : false,
                additional: {
                    page,
                },
            }
        },
        [loadMembers],
    )

    const loadOrgOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<ConfigurationItemUi>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const queryParams: CiListFilterContainerUi = {
                sortBy: 'Gen_Profil_nazov',
                sortType: 'ASC',
                perpage: 20,
                page: page,
                filter: {
                    fullTextSearch: searchQuery,
                    type: ['PO'],
                    metaAttributes: {
                        state: ['DRAFT'],
                    },
                },
            }
            const hierarchyData = (await loadOrgs(queryParams)).configurationItemSet
            return {
                options: hierarchyData || [],
                hasMore: hierarchyData?.length ? true : false,
                additional: {
                    page,
                },
            }
        },
        [loadOrgs],
    )

    return (
        <>
            <Filter
                form={(register) => (
                    <>
                        <SelectLazyLoading<Identity>
                            value={selectedMember}
                            // control={control}
                            placeholder="Vyber..."
                            onChange={(newValue) => {
                                setListFilter({ ...listFilter, memberUuid: (newValue as Identity).uuid ?? '' })
                                setSelectedMember(newValue as Identity)
                            }}
                            label={'Člen (povinné)'}
                            name={'memberUuid'}
                            getOptionValue={(item) => item.uuid ?? ''}
                            getOptionLabel={(item) => item.firstName + ' ' + item.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SelectLazyLoading<ConfigurationItemUi>
                            placeholder="Vyber..."
                            value={selectedOrganization}
                            onChange={(newValue) => {
                                setListFilter({ ...listFilter, poUuid: (newValue as ConfigurationItemUi).uuid ?? '' })
                                setSelectedOrganization(newValue as ConfigurationItemUi)
                            }}
                            label={'Organization (povinné)'}
                            // control={control}
                            name={'poUuid'}
                            getOptionLabel={(item) => (item.attributes ?? {})['Gen_Profil_nazov']}
                            getOptionValue={(item) => item.uuid ?? ''}
                            loadOptions={(searchTerm, _, additional) => loadOrgOptions(searchTerm, additional)}
                        />
                        <SimpleSelect
                            {...register('defaultFilterValues.role')}
                            label="Rola"
                            value={selectedRole}
                            options={DEFAULT_ROLES.map((item) => ({ value: item.code, label: item.value }))}
                            onChange={(newValue) => {
                                setListFilter({ ...listFilter, role: newValue.target.value })
                                setSelectedRole(newValue.target.value)
                            }}
                        />
                    </>
                )}
                defaultFilterValues={{ defaultFilterValues }}
            />
        </>
    )
}

export default KSIVSFilter
