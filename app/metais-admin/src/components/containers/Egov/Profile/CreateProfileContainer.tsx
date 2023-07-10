import React from 'react'
import { useFindByNameUsingGET1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfileBody, Role, useStoreNewAttrProfileUsingPOST } from '@isdd/metais-common/api'
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
            data: AttributeProfileBody
        },
        unknown
    >
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateProfileContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const defaultOptions = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, isLoading, isError } = useFindByNameUsingGET1(defaultOptions as any)
    const mutationObject = useStoreNewAttrProfileUsingPOST()

    if (isLoading) return <div>isLoading</div>
    if (isError) return <div>error</div>

    return (
        <View
            data={{
                roles: (data as Role[]) ?? [],
            }}
            mutate={mutationObject?.mutateAsync}
            hiddenInputs={{ ENG_NAME: true, CODE_PREFIX: true, URI_PREFIX: true, ATTRIBUTE_PROFILES: true, SOURCES: true, TARGETS: true }}
        />
    )
}
