import { RelatedIdentityWithPo, useFindRelatedIdentitiesWithPO } from '@isdd/metais-common/api/generated/iam-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useParams } from 'react-router-dom'

export interface IRelatedIdentitiesTableData {
    name?: string
    login?: string
    email?: string
    obligedPerson?: string
}

export interface FilterData extends IFilterParams {
    fullTextSearch: string
    obligedPerson: string
}

export interface IRoleUsersViewParams {
    roleId: string | undefined
    data: RelatedIdentityWithPo[] | undefined
    isLoading: boolean
    isError: boolean
}

interface IEditEntity {
    id: string | undefined
    View: React.FC<IRoleUsersViewParams>
}

const RoleUsersContainer: React.FC<IEditEntity> = ({ View }: IEditEntity) => {
    const { id } = useParams()
    const { data, isLoading, isError } = useFindRelatedIdentitiesWithPO(id ?? '')

    return <View roleId={id} data={data} isError={isError} isLoading={isLoading} />
}

export default RoleUsersContainer
