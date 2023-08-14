import { Filter, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/src/index'
import { Identity, useFind1Hook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/src/api'
import React, { useCallback } from 'react'
import { useFilter } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROLES } from './defaultRoles'

import { FilterParams } from '@/components/containers/KSIVSVContainer'

interface FilterProps {
    defaultFilterValues: FilterParams
}

const KSIVSFilter: React.FC<FilterProps> = ({ defaultFilterValues }) => {
    const { t } = useTranslation()
    const loadOrgs = useReadCiList1Hook()
    const { setValue } = useFilter(defaultFilterValues)
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
            <Filter<FilterParams>
                form={(register) => (
                    <>
                        {/* not working select */}
                        <SelectLazyLoading<Identity>
                            // value={selectedMember}
                            placeholder={t('KSIVSPage.select')}
                            // onChange={(newValue) => {
                            //     setListFilter({ ...listFilter, memberUuid: (newValue as Identity).uuid ?? '' })
                            //     setSelectedMember(newValue as Identity)
                            // }}
                            setValue={setValue}
                            register={register}
                            label={t('KSIVSPage.member')}
                            name={'memberUuid'}
                            getOptionValue={(item) => item.uuid ?? ''}
                            getOptionLabel={(item) => item.firstName + ' ' + item.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        {/* not working select */}
                        <SelectLazyLoading<ConfigurationItemUi>
                            placeholder={t('KSIVSPage.select')}
                            // value={selectedOrganization}
                            // onChange={(newValue) => {
                            //     setListFilter({ ...listFilter, poUuid: (newValue as ConfigurationItemUi).uuid ?? '' })
                            //     setSelectedOrganization(newValue as ConfigurationItemUi)
                            // }}
                            label={t('KSIVSPage.organization')}
                            name={'poUuid'}
                            getOptionLabel={(item) => (item.attributes ?? {})['Gen_Profil_nazov']}
                            getOptionValue={(item) => item.uuid ?? ''}
                            loadOptions={(searchTerm, _, additional) => loadOrgOptions(searchTerm, additional)}
                        />
                        <SimpleSelect
                            placeholder={t('KSIVSPage.select')}
                            {...register('role')}
                            label={t('KSIVSPage.role')}
                            defaultValue={'all'}
                            // value={selectedRole}
                            options={[
                                { value: 'all', label: t('KSIVSPage.select') },
                                ...DEFAULT_ROLES.map((item) => ({ value: item.code, label: item.value })),
                            ]}
                            // onChange={(newValue) => {
                            //     setListFilter({ ...listFilter, role: newValue.target.value })
                            //     setSelectedRole(newValue.target.value)
                            // }}
                        />
                    </>
                )}
                defaultFilterValues={defaultFilterValues}
            />
        </>
    )
}

export default KSIVSFilter
