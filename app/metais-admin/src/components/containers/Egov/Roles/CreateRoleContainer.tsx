import { EnumType, Role, useGetValidEnum } from '@isdd/metais-common/api'
import { OperationResult, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { ROLES_GROUP } from '@isdd/metais-common/constants'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { MutateOptions } from '@tanstack/react-query'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface ICreateRoleViewParams {
    roleGroups: EnumType | undefined
    createRole: (
        variables: {
            data: Role
        },
        options?:
            | MutateOptions<
                  OperationResult,
                  unknown,
                  {
                      data: Role
                  },
                  unknown
              >
            | undefined,
    ) => void
    isLoading: boolean
    isError: boolean
}

interface ICreateRole {
    View: React.FC<ICreateRoleViewParams>
}

const CreateRoleContainer: React.FC<ICreateRole> = ({ View }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        mutate: createRole,
        isLoading,
        isError,
    } = useUpdateOrCreate({
        mutation: {
            onSuccess() {
                navigate(AdminRouteNames.ROLES + '?system=all&group=all', { state: { from: location } })
            },
        },
    })

    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    return <View roleGroups={roleGroups} createRole={createRole} isLoading={isLoading} isError={isError} />
}

export default CreateRoleContainer
