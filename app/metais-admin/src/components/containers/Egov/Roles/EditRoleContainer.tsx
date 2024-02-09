import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { OperationResult, useFindByUuid, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { ROLES_GROUP } from '@isdd/metais-common/constants'
import { UseMutateFunction } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

export interface IRoleEditViewParams {
    currentRole: Role | undefined
    roleId: string | undefined
    updateRole: UseMutateFunction<
        OperationResult,
        unknown,
        {
            data: Role
        },
        unknown
    >
    isLoading: boolean
    roleGroups: EnumType | undefined
    isError: boolean
}

interface IEditEntity {
    id: string | undefined
    View: React.FC<IRoleEditViewParams>
}

const EditRoleContainer: React.FC<IEditEntity> = ({ View }: IEditEntity) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [updateError, setUpdateError] = useState<unknown>()
    const { data: currentRole, isLoading } = useFindByUuid(id ?? '')
    const { setIsActionSuccess } = useActionSuccess()
    const { mutate: updateRole } = useUpdateOrCreate({
        mutation: {
            onSuccess() {
                setIsActionSuccess({ value: true, path: `${AdminRouteNames.ROLES}`, additionalInfo: { type: 'edit' } })
                navigate(`${AdminRouteNames.ROLES}`)
            },
            onError(error) {
                setUpdateError(error)
            },
        },
    })
    const { data: roleGroups, isLoading: isRolesLoading } = useGetValidEnum(ROLES_GROUP)

    return (
        <View
            currentRole={currentRole}
            roleId={id}
            updateRole={updateRole}
            isLoading={isLoading || isRolesLoading}
            roleGroups={roleGroups}
            isError={!!updateError}
        />
    )
}

export default EditRoleContainer
