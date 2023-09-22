import { SortType } from '@isdd/idsk-ui-kit/types'
import { AttributeProfile, CiType, Role, useStoreNewAttrProfile } from '@isdd/metais-common/api'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (data: CiType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
    isLoading: boolean
    isError: boolean
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateProfileContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })
    const { mutateAsync } = useStoreNewAttrProfile()

    const storeProfile = async (formData: AttributeProfile) => {
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
            isLoading={isLoading}
            isError={isError}
        />
    )
}
