import { SortType } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import {
    AttributeProfile,
    getListAttrProfile1QueryKey,
    useStoreExistAttrProfile,
    useStoreNewAttrProfile,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useInvalidateAttributeProfileCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { DisabledInputs, HiddenInputs } from '@/types/inputs'

export interface ICreateEntityView {
    data: {
        roles?: Role[]
    }
    mutateCreate: (formData: AttributeProfile) => Promise<void>
    mutateEdit: (formData: AttributeProfile) => Promise<void>
    hiddenInputs?: Partial<HiddenInputs>
    disabledInputs?: Partial<DisabledInputs>
    isLoading: boolean
    isError: boolean
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
    entityName?: string
}

export const CreateProfileContainer: React.FC<ICreateEntity> = ({ View, entityName }: ICreateEntity) => {
    const pageNumber = 1
    const pageSize = 200
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const profileListQueryKey = getListAttrProfile1QueryKey({})
    const invalidateAttributeProfileCache = useInvalidateAttributeProfileCache(entityName ?? '')

    const { data, isLoading, isError } = useFindAll1(pageNumber, pageSize, { direction: SortType.ASC, orderBy: 'name' })

    const [profileNameFromCreate, setProfileNameFromCreate] = useState('')

    const { mutateAsync: mutateEdit } = useStoreExistAttrProfile({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([profileListQueryKey[0]])
                invalidateAttributeProfileCache.invalidate()
                navigate(`${AdminRouteNames.EGOV_PROFILE}/${entityName}`)
            },
        },
    })

    const { mutateAsync: mutateCreate } = useStoreNewAttrProfile({
        mutation: {
            onSuccess() {
                queryClient.invalidateQueries([profileListQueryKey[0]])
                navigate(`${AdminRouteNames.EGOV_PROFILE}/${profileNameFromCreate}`)
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
        setProfileNameFromCreate(formData.technicalName ?? '')
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
            disabledInputs={entityName ? { TECHNICAL_NAME: true } : {}}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
