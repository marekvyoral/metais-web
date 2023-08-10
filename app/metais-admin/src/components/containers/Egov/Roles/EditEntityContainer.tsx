import { QueryFeedback } from '@isdd/metais-common'
import { EnumType, Role, useGetValidEnum } from '@isdd/metais-common/api'
import { OperationResult, useFindByUuid, useUpdateOrCreate } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { ROLES_GROUP } from '@isdd/metais-common/components/constants'
import { UseMutateFunction } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export interface RoleEditViewParams {
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
    View: React.FC<RoleEditViewParams>
}

const EditEntityContainer: React.FC<IEditEntity> = ({ View }: IEditEntity) => {
    const { id } = useParams()

    const { data: currentRole, isLoading, isError } = useFindByUuid(id ?? '')
    const { mutate: updateRole } = useUpdateOrCreate()
    const { data: roleGroups } = useGetValidEnum(ROLES_GROUP)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View currentRole={currentRole} roleId={id} updateRole={updateRole} isLoading={isLoading} roleGroups={roleGroups} />
        </QueryFeedback>
    )
}

export default EditEntityContainer
