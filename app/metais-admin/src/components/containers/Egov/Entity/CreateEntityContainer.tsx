import React from 'react'
import { useFindByNameUsingGET1 } from '@isdd/metais-common/api/generated/iam-swagger'
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
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const defaultOptions = {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, isLoading, isError } = useFindByNameUsingGET1(defaultOptions as any) // API obsahuje iba vyhladavanie podla name, ale v pripade ak sa neposle ziadne meno tak sa dotiahnu vsetky role(takto sa to pouziva aj na starom systeme).
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
