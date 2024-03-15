import React from 'react'
import {
    Identity,
    RelatedRole,
    RoleOrgIdentity,
    useFindByUuid2,
    useFindRelatedRoles1,
    useFindRoleOrgRelations,
} from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useTranslation } from 'react-i18next'

export interface UserDetailData {
    userData: Identity | undefined
    userRelatedRoles: RelatedRole[] | undefined
    userOrganizations: RoleOrgIdentity[] | undefined
}

export interface IUserDetailContainerView {
    data?: UserDetailData
    isLoading: boolean
    isError: boolean
}
interface IUserDetailContainer {
    userId: string
    View: React.FC<IUserDetailContainerView>
    passwordChange?: boolean
}

export const UserDetailContainer: React.FC<IUserDetailContainer> = ({ userId, View, passwordChange }) => {
    const { t } = useTranslation()
    const { data: userData, isLoading: isUserDataLoading, isFetching: isUserDataFetching, isError: isUserDataError } = useFindByUuid2(userId)
    const {
        data: userRelatedRoles,
        isLoading: isRolesLoading,
        isFetching: isRolesFetching,
        isError: isRolesError,
    } = useFindRelatedRoles1(userId, { query: { enabled: !passwordChange } })
    const {
        data: userOrganizations,
        isLoading: isUserOrganizationsLoading,
        isError: isUserOrganizationsError,
        isFetching: isUserOrganizationsFetching,
    } = useFindRoleOrgRelations(userId, {}, { query: { enabled: !passwordChange } })

    const isLoading = [isUserDataLoading, isRolesLoading && !passwordChange, isUserOrganizationsLoading && !passwordChange].some((item) => item)
    const isFetching = [isUserDataFetching, isRolesFetching && !passwordChange, isUserOrganizationsFetching && !passwordChange].some((item) => item)
    const isError = [isUserDataError, isRolesError, isUserOrganizationsError].some((item) => item)

    return (
        <QueryFeedback loading={false} error={!userId} errorProps={{ errorMessage: t('managementList.noUserId') }}>
            <View data={{ userData, userRelatedRoles, userOrganizations }} isLoading={isLoading || isFetching} isError={isError} />
        </QueryFeedback>
    )
}
