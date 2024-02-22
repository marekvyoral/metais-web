import { SortType } from '@isdd/idsk-ui-kit/types'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFindAll1 } from '@isdd/metais-common/api/generated/iam-swagger'
import { Attribute, CiType, useStoreAdminEntity1 } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ADMIN_EGOV_ENTITY_LIST_QKEY } from '@isdd/metais-common/constants'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

import { DisabledInputs, HiddenInputs } from '@/types/inputs'
import { EntityType } from '@/components/views/egov/entity-detail-views/CreateEntityView'

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
    type?: EntityType
    refetch?: () => void
    entityId?: string
    disabledInputs?: Partial<DisabledInputs>
    saveExistingAttribute?: (attributeTechnicalName?: string, attribute?: Attribute) => void
    resetExistingAttribute?: (attributeTechnicalName?: string) => void
    attributesOverridesData?: Attribute[] | undefined
    setVisibilityOfAttributeProfile?: (attributeTechnicalName?: string, oldAttributeVisibility?: boolean) => void
}

interface ICreateEntity {
    View: React.FC<ICreateEntityView>
    entityId?: string
}

const CreateEntityContainer: React.FC<ICreateEntity> = ({ View, entityId }: ICreateEntity) => {
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

    // const { mutateAsync: setProfileAttributeAsVisible } = useStoreVisible()
    // const { mutateAsync: setProfileAttributeAsInvisible } = useStoreInvisible()
    const setVisibilityOfAttributeProfile = (attributeTechnicalName?: string, oldAttributeInvisibility?: boolean) => {
        //     if (!oldAttributeInvisibility) {
        //         setProfileAttributeAsInvisible({
        //             technicalName: attributeTechnicalName ?? '',
        //             attrProfileTechnicalName: profileData?.technicalName ?? '',
        //         }).then(() => {
        //             refetch()
        //         })
        //     } else {
        //         setProfileAttributeAsVisible({
        //             technicalName: attributeTechnicalName ?? '',
        //             attrProfileTechnicalName: profileData?.technicalName ?? '',
        //         }).then(() => {
        //             refetch()
        //         })
        //     }
    }

    return (
        <View
            data={{
                roles: data ?? [],
            }}
            mutate={storeEntity}
            hiddenInputs={{ SOURCES: true, TARGETS: true, ENG_DESCRIPTION: true }}
            disabledInputs={entityId ? { TECHNICAL_NAME: true, CODE_PREFIX: true } : {}}
            isLoading={isLoading}
            isError={isError}
            entityId={entityId}
            setVisibilityOfAttributeProfile={setVisibilityOfAttributeProfile}
        />
    )
}

export default CreateEntityContainer
