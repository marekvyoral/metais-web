import { QueryFeedback } from '@isdd/metais-common'
import { EnumType, Role, useGetValidEnum } from '@isdd/metais-common/api'
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
        <QueryFeedback loading={isLoading} error={!!updateError}>
            <View currentRole={currentRole} roleId={id} updateRole={updateRole} isLoading={isLoading} roleGroups={roleGroups} />
        </QueryFeedback>
    )
}

export default EditRoleContainer
