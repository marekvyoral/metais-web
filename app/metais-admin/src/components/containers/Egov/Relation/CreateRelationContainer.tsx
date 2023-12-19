import React from 'react'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { RelationshipType, getGetRelationshipTypeQueryKey, useStoreAdminEntity } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SortType } from '@isdd/idsk-ui-kit/types'
import { useQueryClient } from '@tanstack/react-query'
import { ADMIN_EGOV_RELATION_LIST_QKEY } from '@isdd/metais-common/constants'

import { DisabledInputs, HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutate: (formData: RelationshipType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
    disabledInputs?: Partial<DisabledInputs>
    isLoading: boolean
    isError: boolean
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
    entityName?: string
}

export const CreateRelationContainer: React.FC<ICreateEntity> = ({ View, entityName }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })
    const { mutateAsync } = useStoreAdminEntity({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EGOV_RELATION_LIST_QKEY])
                entityName && queryClient.invalidateQueries(getGetRelationshipTypeQueryKey(entityName))
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
            disabledInputs={entityName ? { TECHNICAL_NAME: true, ROLE_LIST: true } : {}}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
