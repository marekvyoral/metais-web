import { EnumType, useGetValidEnum } from '@isdd/metais-common/api'
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface UserManagementData {
    roleGroupsData: EnumType | undefined
    allRolesData: FindAll11200 | undefined
}

export interface IUserManagementContainerView {
    data?: UserManagementData
}
interface IUserManagementContainer {
    View: React.FC<IUserManagementContainerView>
}

export const UserManagementContainer: React.FC<IUserManagementContainer> = ({ View }) => {
    const { t } = useTranslation()
    const SKUPINA_ROL = 'SKUPINA_ROL'
    const { data: roleGroupsData, isLoading: isRoleGroupsLoading, isError: isRoleGroupsError } = useGetValidEnum(SKUPINA_ROL)
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()

    const isLoading = [isAllRolesLoading, isRoleGroupsLoading].some((item) => item)
    const isError = [isAllRolesError, isRoleGroupsError].some((item) => item)

    if (isLoading || isError) {
        return (
            <QueryFeedback
                loading={isLoading}
                error={isError}
                errorProps={{ errorMessage: t('managementList.containerQueryError') }}
                indicatorProps={{ fullscreen: true, layer: 'parent' }}
            />
        )
    }

    return <View data={{ roleGroupsData, allRolesData }} />
}
