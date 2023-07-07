import React from 'react'
import { FindByNameUsingGET1Params, useFindByNameUsingGET1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType, Role, useStoreAdminEntityUsingPOST } from '@isdd/metais-common/api'
import { UseMutateFunction } from '@tanstack/react-query'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: UseMutateFunction<
        void,
        unknown,
        {
            data: CiType
        },
        unknown
    >
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const defaultOptions = {} as FindByNameUsingGET1Params
    const { data, isLoading, isError } = useFindByNameUsingGET1(defaultOptions)
    const mutationObject = useStoreAdminEntityUsingPOST()

    return (
        <View
            data={{
                roles: (data as Role[]) ?? [],
            }}
            mutate={mutationObject?.mutate}
        />
    )
}

export default CreateEntityContainer
