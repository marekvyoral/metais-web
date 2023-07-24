import React from 'react'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, Role, useStoreNewAttrProfile } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'
import { SortType } from '@isdd/idsk-ui-kit/types'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (data: AttributeProfile) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateProfileContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const page = 1
    const limit = 200

    const { data, isLoading, isError } = useFindAll1(page, limit, { direction: SortType.ASC, orderBy: 'name' })
    const { mutateAsync } = useStoreNewAttrProfile()

    const storeProfile = async (formData: AttributeProfile) => {
        await mutateAsync({
            data: {
                ...formData,
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View
                data={{
                    roles: (data as Role[]) ?? [],
                }}
                mutate={storeProfile}
                hiddenInputs={{ ENG_NAME: true, CODE_PREFIX: true, URI_PREFIX: true, ATTRIBUTE_PROFILES: true, SOURCES: true, TARGETS: true }}
            />
        </QueryFeedback>
    )
}
