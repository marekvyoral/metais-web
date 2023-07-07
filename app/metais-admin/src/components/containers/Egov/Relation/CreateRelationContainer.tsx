import React from 'react'
import { useFindByNameUsingGET1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { RelationshipType, Role, useStoreAdminEntityUsingPOST1 } from '@isdd/metais-common/api'
import { UseMutateAsyncFunction } from '@tanstack/react-query'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: UseMutateAsyncFunction<
        void,
        unknown,
        {
            data: RelationshipType
        },
        unknown
    >
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateRelationContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const defaultOptions = {
        name: '',
    }
    const { data, isLoading, isError } = useFindByNameUsingGET1(defaultOptions)
    const mutationObject = useStoreAdminEntityUsingPOST1()

    return (
        <View
            data={{
                roles: (data as Role[]) ?? [],
            }}
            mutate={mutationObject?.mutateAsync}
            hiddenInputs={{ CODE_PREFIX: true, URI_PREFIX: true }}
        />
    )
}
