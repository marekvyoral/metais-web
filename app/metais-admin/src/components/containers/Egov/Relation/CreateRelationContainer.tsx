import React from 'react'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { RelationshipType, Role, useStoreAdminEntity } from '@isdd/metais-common/api'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { useQueryClient } from '@tanstack/react-query'
import { ADMIN_EGOV_RELATION_LIST_QKEY } from '@isdd/metais-common/constants'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (formData: RelationshipType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
    isLoading: boolean
    isError: boolean
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

export const CreateRelationContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })
    const { mutateAsync } = useStoreAdminEntity({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EGOV_RELATION_LIST_QKEY])
            },
        },
    })

    const storeRelation = async (formData: RelationshipType) => {
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
            mutate={storeRelation}
            hiddenInputs={{ CODE_PREFIX: true, URI_PREFIX: true }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
