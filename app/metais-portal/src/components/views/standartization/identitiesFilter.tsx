import { Filter, ILoadOptionsResponse, SelectLazyLoading, SimpleSelect } from '@isdd/idsk-ui-kit/src/index'
import { CiListFilterContainerUi, ConfigurationItemUi, useReadCiList1Hook } from '@isdd/metais-common/src/api'
import { Identity, useFind1Hook } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_ROLES } from './defaultRoles'

import { FilterParams } from '@/components/containers/KSISVSVContainer'

interface FilterProps {
    defaultFilterValues: FilterParams
}

const KSIVSFilter: React.FC<FilterProps> = ({ defaultFilterValues }) => {
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
                form={(register, __, filter, setValue) => (
                    <>
                        <SelectLazyLoading<Identity>
                            placeholder={t('KSIVSPage.select')}
                            setValue={setValue}
                            register={register}
                            label={t('KSIVSPage.member')}
                            name={'memberUuid'}
                            getOptionValue={(item) => item.uuid ?? ''}
                            getOptionLabel={(item) => item.firstName + ' ' + item.lastName}
                            loadOptions={(searchTerm, _, additional) => loadMembersOptions(searchTerm, additional)}
                        />
                        <SelectLazyLoading<ConfigurationItemUi>
                            placeholder={t('KSIVSPage.select')}
                            label={t('KSIVSPage.organization')}
                            register={register}
                            setValue={setValue}
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
                            options={[
                                { value: 'all', label: t('KSIVSPage.select') },
                                ...DEFAULT_ROLES.map((item) => ({ value: item.code, label: item.value })),
                            ]}
                        />
                    </>
                )}
                defaultFilterValues={defaultFilterValues}
            />
        </>
    )
}

export default KSIVSFilter
