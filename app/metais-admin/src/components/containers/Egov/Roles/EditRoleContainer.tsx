import { EnumType, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { OperationResult, useFindByUuid, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { ROLES_GROUP } from '@isdd/metais-common/constants'
import { UseMutateFunction } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

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
    const { mutate: updateRole } = useUpdateOrCreate({
        mutation: {
            onSuccess() {
                navigate(-1)
            },
            onError(error) {
                setUpdateError(error)
            },
        },
    })
    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    return (
        <View currentRole={currentRole} roleId={id} updateRole={updateRole} isLoading={isLoading} roleGroups={roleGroups} isError={!!updateError} />
    )
}

export default EditRoleContainer
