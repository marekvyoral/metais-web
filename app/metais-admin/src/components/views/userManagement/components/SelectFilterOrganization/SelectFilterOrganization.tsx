import { DEFAULT_LAZY_LOAD_PER_PAGE, ILoadOptionsResponse, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { AddressObjectUi, HierarchyPOFilterUi, useReadCiList } from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OptionProps, components } from 'react-select'

import style from './selectFilterOrganization.module.scss'

import { UserManagementFilterData } from '@/components/containers/ManagementList/UserManagementListUtils'
import { mapHierarchyRightsToOptions } from '@/components/views/userManagement/userManagementUtils'

export type SelectFilterOrganizationOptionType = {
    poUUID: string
    poName: string
    address: AddressObjectUi
}

interface SelectFilterOrganizationProps {
    filter: UserManagementFilterData
    setValue: UseFormSetValue<UserManagementFilterData>
}

const formatOption = (optionProps: OptionProps<SelectFilterOrganizationOptionType>) => {
    const { street, number, zipCode, village } = optionProps.data.address
    const addressString = [street, number, zipCode, village].join(' ')
    return (
        <components.Option {...optionProps} className={style.selectOption}>
            <div>{optionProps.data.poName}</div>
            <span>
                <small>{addressString}</small>
            </span>
        </components.Option>
    )
}

export const SelectFilterOrganization: React.FC<SelectFilterOrganizationProps> = ({ filter, setValue }) => {
    const { t } = useTranslation()
    const auth = useAuth()

    const { mutate, mutateAsync, isError } = useReadCiList()
    const [defaultValue, setDefaultValue] = useState<SelectFilterOrganizationOptionType | undefined>(undefined)
    const [seed, setSeed] = useState(1)

    const loadOptions = useCallback(
        async (searchQuery: string, additional: { page: number } | undefined): Promise<ILoadOptionsResponse<SelectFilterOrganizationOptionType>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const userDataGroups = auth.state.user?.groupData || []
            const params: HierarchyPOFilterUi = {
                page,
                perpage: DEFAULT_LAZY_LOAD_PER_PAGE,
                sortBy: SortBy.HIERARCHY_FROM_ROOT,
                sortType: SortType.ASC,
                fullTextSearch: searchQuery ?? '',
                rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
            }
            const response = await mutateAsync({ data: params })
            return {
                options: mapHierarchyRightsToOptions(response),
                hasMore: page < (response.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [auth.state.user?.groupData, mutateAsync],
    )

    useEffect(() => {
        if (!defaultValue && filter.orgId) {
            const userDataGroups = auth.state.user?.groupData || []
            const queryParams: HierarchyPOFilterUi = {
                poUUID: filter.orgId,
                rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
            }

            mutate(
                { data: queryParams },
                {
                    onSuccess(data) {
                        const organizations = mapHierarchyRightsToOptions(data)
                        if (organizations) {
                            const defaultOrganization = organizations.find((org) => org.poUUID === filter.orgId)
                            if (defaultOrganization) {
                                setDefaultValue(defaultOrganization)
                            }
                        }
                    },
                },
            )
        }
    }, [auth.state.user?.groupData, defaultValue, filter.orgId, mutate])

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

    return (
        <>
            <SelectLazyLoading
                key={seed}
                getOptionLabel={(item) => item.poName}
                getOptionValue={(item) => item.poUUID}
                loadOptions={(searchQuery, _prevOptions, additional) => loadOptions(searchQuery, additional)}
                label={t('userManagement.filter.organization')}
                name="orgId"
                option={(ctx) => formatOption(ctx)}
                setValue={setValue}
                defaultValue={defaultValue}
            />
            <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('userManagement.error.query') }} />
        </>
    )
}
