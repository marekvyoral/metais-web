import { SortType } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    AttributeProfile,
    getListAttrProfile1QueryKey,
    useStoreExistAttrProfile,
    useStoreNewAttrProfile,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutateCreate: (formData: AttributeProfile) => Promise<void>
    mutateEdit: (formData: AttributeProfile) => Promise<void>
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

    const queryClient = useQueryClient()
    const profileListQueryKey = getListAttrProfile1QueryKey({})

    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })

    const { mutateAsync: mutateEdit } = useStoreExistAttrProfile({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([profileListQueryKey[0]])
            },
        },
    })

    const { mutateAsync: mutateCreate } = useStoreNewAttrProfile({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([profileListQueryKey[0]])
            },
        },
    })

    const editProfile = async (formData: AttributeProfile) => {
        await mutateEdit({
            data: {
                ...formData,
            },
        })
    }

    const createProfile = async (formData: AttributeProfile) => {
        await mutateCreate({
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
            mutateCreate={createProfile}
            mutateEdit={editProfile}
            hiddenInputs={{ ENG_NAME: true, CODE_PREFIX: true, URI_PREFIX: true, ATTRIBUTE_PROFILES: true, SOURCES: true, TARGETS: true }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
