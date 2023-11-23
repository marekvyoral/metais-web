import { Filter, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/src/index'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/src/api/generated/cmdb-swagger'
import { Identity, useFind1Hook, useFindByUuid2 } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { FilterParams } from '@/components/containers/standardization/groups/GroupDetailContainer'
import { DEFAULT_KSISVS_ROLES, DEFAULT_ROLES } from '@/components/views/standardization/groups/defaultRoles'

interface FilterProps {
    defaultFilterValues: FilterParams
    isKsisvs: boolean
    filter: FilterParams
}

const GroupMembersFilter: React.FC<FilterProps> = ({ defaultFilterValues, isKsisvs, filter }) => {
    const { t } = useTranslation()
    const { currentPreferences } = useUserPreferences()
    const loadOrgs = useReadCiList1Hook()
    const loadMembers = useFind1Hook()
    const { refetch } = useFindByUuid2(filter.memberUuid ?? '')
    const [selectedIdentity, setSelectedIdentity] = useState<Identity>()
    const loadedIdentities = useRef<Identity[]>([])
    const [selectedOrganization, setSelectedOrganization] = useState<ConfigurationItemUi>()
    const [seed1, setSeed1] = useState(1)
    const [seed2, setSeed2] = useState(2)
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

    const {
        state: { user },
    } = useAuth()
    const isLoggedIn = !!user

    const loadOrgOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<ConfigurationItemUi>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1

            const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
            const queryParams: CiListFilterContainerUi = {
                sortBy: 'Gen_Profil_nazov',
                sortType: 'ASC',
                perpage: 20,
                page: page,
                filter: {
                    fullTextSearch: searchQuery,
                    type: ['PO'],
                    metaAttributes,
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
        [currentPreferences.showInvalidatedItems, loadOrgs],
    )

    useEffect(() => {
        if (!selectedIdentity && filter.memberUuid) {
            refetch().then((res) => setSelectedIdentity(res.data))
        }
    }, [filter.memberUuid, refetch, selectedIdentity])

    useEffect(() => {
        if (!selectedOrganization && filter.poUuid) {
            const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }
            loadOrgs({
                sortBy: 'Gen_Profil_nazov',
                sortType: 'ASC',
                perpage: 1,
                page: 1,
                filter: {
                    fullTextSearch: '',
                    type: ['PO'],
                    uuid: [filter.poUuid ?? ''],
                    metaAttributes,
                },
            }).then((res) => setSelectedOrganization(res.configurationItemSet?.at(0) ?? undefined))
        }
    }, [currentPreferences.showInvalidatedItems, filter.poUuid, loadOrgs, selectedOrganization])
    useEffect(() => {
        setSeed1(Math.random())
    }, [selectedIdentity])
    useEffect(() => {
        setSeed2(Math.random())
    }, [selectedOrganization])
    return (
        <>
            <Filter<FilterParams>
                defaultFilterValues={defaultFilterValues}
                form={({ setValue }) => (
                    <>
                        <SelectLazyLoading<Identity>
                            disabled={!isLoggedIn}
                            key={seed1}
                            defaultValue={selectedIdentity}
                            placeholder={t('groups.select')}
                            setValue={setValue}
                            label={t('groups.member')}
                            name={'memberUuid'}
                            getOptionValue={(item) => item.uuid ?? ''}
                            getOptionLabel={(item) => item.firstName + ' ' + item.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />

                        <SelectLazyLoading<ConfigurationItemUi>
                            key={seed2}
                            defaultValue={selectedOrganization}
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
                            defaultValue={filter.role ?? 'all'}
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
