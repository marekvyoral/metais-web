import React from 'react'
import { useFindAllUsingGET14 } from '@isdd/metais-common/api/generated/iam-swagger'
import { RelationshipType, Role, useStoreAdminEntityUsingPOST1 } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (formData: RelationshipType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateRelationContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const { data, isLoading, isError } = useFindAllUsingGET14(pageNumber, pageSize, { direction: 'ASC', orderBy: 'name' })
    const { mutateAsync } = useStoreAdminEntityUsingPOST1()

    const storeRelation = async (formData: RelationshipType) => {
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
                mutate={storeRelation}
                hiddenInputs={{ CODE_PREFIX: true, URI_PREFIX: true }}
            />
        </QueryFeedback>
    )
}
