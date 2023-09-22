import { EnumType, useGetValidEnum } from '@isdd/metais-common/api'
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'

export interface UserManagementData {
    roleGroupsData: EnumType | undefined
    allRolesData: FindAll11200 | undefined
}

export interface IUserManagementContainerView {
    data?: UserManagementData
    isLoading: boolean
    isError: boolean
}
interface IUserManagementContainer {
    View: React.FC<IUserManagementContainerView>
}

export const UserManagementContainer: React.FC<IUserManagementContainer> = ({ View }) => {
    const SKUPINA_ROL = 'SKUPINA_ROL'
    const { data: roleGroupsData, isLoading: isRoleGroupsLoading, isError: isRoleGroupsError } = useGetValidEnum(SKUPINA_ROL)
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()

    const isLoading = [isAllRolesLoading, isRoleGroupsLoading].some((item) => item)
    const isError = [isAllRolesError, isRoleGroupsError].some((item) => item)

    return <View data={{ roleGroupsData, allRolesData }} isLoading={isLoading} isError={isError} />
}
