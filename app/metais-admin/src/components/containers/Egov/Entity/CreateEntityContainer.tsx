import React from 'react'
import { useFindAllUsingGET14 } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiType, Role, useStoreAdminEntityUsingPOST } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common'

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

    const { data, isLoading, isError } = useFindAllUsingGET14(pageNumber, pageSize, { direction: 'ASC', orderBy: 'name' })

    const { mutateAsync } = useStoreAdminEntityUsingPOST()

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
