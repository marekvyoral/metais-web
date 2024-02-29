import { DEFAULT_LAZY_LOAD_PER_PAGE, ILoadOptionsResponse, SelectLazyLoading } from '@isdd/idsk-ui-kit/index'
import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import React, { useCallback, useState } from 'react'
import { UseFormClearErrors, UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { OptionProps } from 'react-select'
import { Option } from '@isdd/idsk-ui-kit/common/SelectCommon'

import { RequestFormFields, UserRequestRightsForm } from './UserProfileRequestRightsModal'

import { QueryFeedback } from '@isdd/metais-common/index'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { AddressObjectUi, HierarchyPOFilterUi, HierarchyRightsResultUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'

export type SelectFilterOrganizationHierarchyOptionType = {
    poUUID: string
    poName: string
    address: AddressObjectUi
}

interface SelectFilterOrganizationHierarchyProps {
    setValue: UseFormSetValue<UserRequestRightsForm>
    error?: string
    clearErrors?: UseFormClearErrors<UserRequestRightsForm>
    requiredString?: string
}

const formatOption = (props: OptionProps<SelectFilterOrganizationHierarchyOptionType>) => {
    const { street, number, zipCode, village } = props.data.address
    const addressString = [street, number, zipCode, village].join(' ')

    return (
        <Option {...props}>
            <div>{props.data.poName}</div>
            <span>
                <small>{addressString}</small>
            </span>
        </Option>
    )
}
const mapHierarchyRightsToOptions = (data: HierarchyRightsResultUi): SelectFilterOrganizationHierarchyOptionType[] => {
    return (
        data.rights
            ?.map(({ poUUID, poName, address }) => ({
                poUUID: poUUID ?? '',
                poName: poName ?? '',
                address: address ?? {},
            }))
            .filter((item) => !!item.poUUID) ?? []
    )
}
export const SelectImplicitHierarchy: React.FC<SelectFilterOrganizationHierarchyProps> = ({ setValue, error, clearErrors, requiredString }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    const { mutateAsync, isError } = useReadCiList()
    const [defaultValue, setDefaultValue] = useState<SelectFilterOrganizationHierarchyOptionType | undefined>(undefined)

    const loadOptions = useCallback(
        async (
            searchQuery: string,
            additional: { page: number } | undefined,
        ): Promise<ILoadOptionsResponse<SelectFilterOrganizationHierarchyOptionType>> => {
            const page = !additional?.page ? 1 : (additional?.page || 0) + 1
            const userDataGroups = user?.groupData || []
            const params: HierarchyPOFilterUi = {
                page,
                perpage: DEFAULT_LAZY_LOAD_PER_PAGE,
                sortBy: SortBy.HIERARCHY_FROM_ROOT,
                sortType: SortType.ASC,
                fullTextSearch: searchQuery ?? '',
                rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
            }
            const response = await mutateAsync({ data: params })
            const options = mapHierarchyRightsToOptions(response)
            setDefaultValue(options[0])
            return {
                options: options,
                hasMore: page < (response.pagination?.totalPages ?? 0),
                additional: {
                    page,
                },
            }
        },
        [user?.groupData, mutateAsync],
    )

    return (
        <>
            <SelectLazyLoading
                key={RequestFormFields.PO}
                placeholder={t('userProfile.requests.placeholderPO')}
                getOptionLabel={(item) => item.poName}
                getOptionValue={(item) => item.poUUID}
                loadOptions={(searchQuery, _prevOptions, additional) => loadOptions(searchQuery, additional)}
                label={t('userProfile.requests.po') + requiredString}
                name={RequestFormFields.PO}
                option={(ctx) => formatOption(ctx)}
                setValue={setValue}
                defaultValue={defaultValue}
                error={error}
                clearErrors={clearErrors}
                isClearable={false}
            />
            <QueryFeedback loading={false} error={isError} errorProps={{ errorMessage: t('userManagement.error.query') }} />
        </>
    )
}
