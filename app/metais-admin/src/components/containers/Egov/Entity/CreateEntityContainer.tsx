import React from 'react'
import { useFindAllUsingGET14 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType, Role, useStoreAdminEntityUsingPOST } from '@isdd/metais-common/api'
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
            data: CiType
        },
        unknown
    >
    hiddenInputs?: Partial<HiddenInputs>
    existingEntityData?: CiType
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const page = 1
    const limit = 200

    const { data, isLoading, isError } = useFindAllUsingGET14(page, limit, { direction: 'ASC', orderBy: 'name' })

    const mutationObject = useStoreAdminEntityUsingPOST()

    if (isLoading) return <div>isLoading</div>
    if (isError) return <div>error</div>

    return (
        <View
            data={{
                roles: (data as Role[]) ?? [],
            }}
            mutate={mutationObject?.mutateAsync}
            hiddenInputs={{ SOURCES: true, TARGETS: true, ENG_DESCRIPTION: true }}
        />
    )
}

export default CreateEntityContainer
