import { EnumType, Role, useGetValidEnum } from '@isdd/metais-common/api'
import { OperationResult, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import { ROLES_GROUP } from '@isdd/metais-common/components/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { MutateOptions } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export interface CreateRoleViewParams {
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
}

interface ICreateRole {
    View: React.FC<CreateRoleViewParams>
}

const CreateRoleContainer: React.FC<ICreateRole> = ({ View }) => {
    const navigate = useNavigate()
    const {
        mutate: createRole,
        isLoading,
        isError,
    } = useUpdateOrCreate({
        mutation: {
            onSuccess() {
                navigate(AdminRouteNames.ROLES + '?system=all&group=all')
            },
        },
    })

    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View roleGroups={roleGroups} createRole={createRole} />
        </QueryFeedback>
    )
}

export default CreateRoleContainer
