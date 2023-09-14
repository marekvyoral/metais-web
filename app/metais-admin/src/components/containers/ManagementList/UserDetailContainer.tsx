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
}

export const UserDetailContainer: React.FC<IUserDetailContainer> = ({ userId, View }) => {
    const { t } = useTranslation()
    const { data: userData, isLoading: isUserDataLoading, isError: isUserDataError } = useFindByUuid2(userId)
    const { data: userRelatedRoles, isLoading: isRolesLoading, isError: isRolesError } = useFindRelatedRoles1(userId)
    const { data: userOrganizations, isLoading: isUserOrganizationsLoading, isError: isUserOrganizationsError } = useFindRoleOrgRelations(userId)

    const isLoading = [isUserDataLoading, isRolesLoading, isUserOrganizationsLoading].some((item) => item)
    const isError = [isUserDataError, isRolesError, isUserOrganizationsError].some((item) => item)

    if (!userId) return <QueryFeedback loading={false} error errorProps={{ errorMessage: t('managementList.noUserId') }} />

    return <View data={{ userData, userRelatedRoles, userOrganizations }} isLoading={isLoading} isError={isError} />
}
