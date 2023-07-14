import React from 'react'
import { useFindAllUsingGET14 } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfileBody, CiType, Role, useStoreNewAttrProfileUsingPOST } from '@isdd/metais-common/api'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (data: AttributeProfileBody) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateProfileContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const page = 1
    const limit = 200

    const { data, isLoading, isError } = useFindAllUsingGET14(page, limit, { direction: 'ASC', orderBy: 'name' })
    const { mutateAsync } = useStoreNewAttrProfileUsingPOST()

    if (isLoading) return <div>isLoading</div>
    if (isError) return <div>error</div>

    const storeProfile = async (formData: AttributeProfileBody) => {
        await mutateAsync({
            data: {
                ...formData,
            },
        })
    }

    return (
        <View
            data={{
                roles: (data as Role[]) ?? [],
            }}
            mutate={storeProfile}
            hiddenInputs={{ ENG_NAME: true, CODE_PREFIX: true, URI_PREFIX: true, ATTRIBUTE_PROFILES: true, SOURCES: true, TARGETS: true }}
        />
    )
}
