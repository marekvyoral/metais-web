import { SortType } from '@isdd/idsk-ui-kit/types'
import { QueryFeedback } from '@isdd/metais-common'
import { CiType, Role, useStoreAdminEntity } from '@isdd/metais-common/api'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
        existingEntityData?: CiType
    }
    mutate: (formData: CiType) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200

    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })

    const { mutateAsync } = useStoreAdminEntity()

    const storeEntity = async (formData: CiType) => {
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
                    roles: data ?? [],
                }}
                mutate={storeEntity}
                hiddenInputs={{ SOURCES: true, TARGETS: true, ENG_DESCRIPTION: true }}
            />
        </QueryFeedback>
    )
}

export default CreateEntityContainer
