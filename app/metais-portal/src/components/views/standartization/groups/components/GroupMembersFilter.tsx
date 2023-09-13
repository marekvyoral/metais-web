import { Filter, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/src/index'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/src/api'
import { Identity, useFind1Hook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { FilterParams } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standartization/groups/defaultRoles'

interface FilterProps {
    defaultFilterValues: FilterParams
    isKsisvs: boolean
}

const GroupMembersFilter: React.FC<FilterProps> = ({ defaultFilterValues, isKsisvs }) => {
    const { t } = useTranslation()
    const loadOrgs = useReadCiList1Hook()
    const loadMembers = useFind1Hook()
    const loadedIdentities = useRef<Identity[]>([])
    const loadMembersOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<Identity>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const queryParams = {
                limit: 10,
                page: page,
            }
            const identities = await loadMembers(queryParams.page, queryParams.limit, { expression: searchQuery })
            loadedIdentities.current?.push(...identities)

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
                defaultFilterValues={defaultFilterValues}
                form={({ setValue }) => (
                    <>
                        <SelectLazyLoading<Identity>
                            placeholder={t('groups.select')}
                            setValue={setValue}
                            label={t('groups.member')}
                            name={'memberUuid'}
                            getOptionValue={(item) => item.uuid ?? ''}
                            getOptionLabel={(item) => item.firstName + ' ' + item.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SelectLazyLoading<ConfigurationItemUi>
                            placeholder={t('groups.select')}
                            label={t('groups.organization')}
                            setValue={setValue}
                            name={'poUuid'}
                            getOptionLabel={(item) => (item.attributes ?? {})['Gen_Profil_nazov']}
                            getOptionValue={(item) => item.uuid ?? ''}
                            loadOptions={(searchTerm, _, additional) => loadOrgOptions(searchTerm, additional)}
                        />
                        <SimpleSelect
                            placeholder={t('groups.select')}
                            name="role"
                            setValue={setValue}
                            label={t('groups.role')}
                            defaultValue={'all'}
                            options={(isKsisvs ? DEFAULT_KSISVS_ROLES : DEFAULT_ROLES).map((item) => ({ value: item.code, label: item.value }))}
                            onChange={(val) => {
                                setValue('role', val ?? '')
                            }}
                        />
                    </>
                )}
            />
        </>
    )
}

export default GroupMembersFilter
