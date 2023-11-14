import { SortType } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType, useStoreAdminEntity1 } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ADMIN_EGOV_ENTITY_LIST_QKEY } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
        existingEntityData?: CiType
    }
    mutate: (formData: CiType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
    isLoading: boolean
    isError: boolean
    isEdit?: boolean
    type?: 'entity' | 'profile' | 'relation' | 'roles'
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })
    const queryClient = useQueryClient()
    const { mutateAsync } = useStoreAdminEntity1({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([ADMIN_EGOV_ENTITY_LIST_QKEY])
            },
        },
    })

    const storeEntity = async (formData: CiType) => {
        await mutateAsync({
            data: {
                ...formData,
            },
        })
    }

    return (
        <View
            data={{
                roles: data ?? [],
            }}
            mutate={storeEntity}
            hiddenInputs={{ SOURCES: true, TARGETS: true, ENG_DESCRIPTION: true }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}

export default CreateEntityContainer
