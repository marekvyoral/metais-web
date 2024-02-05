import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { OperationResult, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { ROLES_GROUP } from '@isdd/metais-common/constants'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { MutateOptions } from '@tanstack/react-query'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

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
    const { setIsActionSuccess } = useActionSuccess()
    const {
        mutate: createRole,
        isLoading,
        isError,
    } = useUpdateOrCreate({
        mutation: {
            onSuccess() {
                setIsActionSuccess({ value: true, path: `${AdminRouteNames.ROLES}`, additionalInfo: { type: 'create' } })
                navigate(AdminRouteNames.ROLES, { state: { from: location } })
            },
        },
    })

    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    return <View roleGroups={roleGroups} createRole={createRole} isLoading={isLoading} isError={isError} />
}

export default CreateRoleContainer
