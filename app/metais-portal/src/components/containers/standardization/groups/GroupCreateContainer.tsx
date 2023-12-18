import { useAddGroupOrgRoleIdentityRelationHook, useFindAll11, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes, RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GROUP_ROLES } from '@isdd/metais-common/constants'
import { FieldValues } from 'react-hook-form'
import { useInvalidateGroupsListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'
import { GroupFormEnum } from '@/components/views/standardization/groups/groupSchema'

interface INewGroupRelationRequest {
    uuid: string
    groupUuid: string
    roleUuid: string
    orgId: string
}

export const GroupCreateContainer: React.FC = () => {
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()

    const goBack = () => {
        navigate(NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE)
    }

    const createNewGroupRelationsHook = useAddGroupOrgRoleIdentityRelationHook()

    const { data: chairmanRoleData } = useFindAll11({ name: GROUP_ROLES.STD_PSPRE })

    const [newGroupRelationRequest, setNewGroupRelationRequest] = useState<INewGroupRelationRequest>({
        uuid: '',
        groupUuid: '',
        roleUuid: '',
        orgId: '',
    })
    const [creatingRelation, setCreatingRelation] = useState(false)
    const invalidateCache = useInvalidateGroupsListCache({ sortBy: 'name', ascending: false })
    const { mutateAsync: createGroup, isLoading: creatingGroupLoading } = useUpdateOrCreate2({
        mutation: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async onSuccess(res: any) {
                setCreatingRelation(true)
                await createNewGroupRelationsHook(
                    newGroupRelationRequest.uuid,
                    res.uuid,
                    newGroupRelationRequest.roleUuid,
                    newGroupRelationRequest.orgId,
                )
                setCreatingRelation(false)
                invalidateCache.invalidate()
                setIsActionSuccess({
                    value: true,
                    path: `${RouterRoutes.STANDARDIZATION_GROUPS_LIST}/${res?.uuid}`,
                    additionalInfo: { entity: 'group', type: 'create' },
                })
                navigate(`${RouterRoutes.STANDARDIZATION_GROUPS_LIST}/${res?.uuid}`)
            },
        },
    })

    const onSubmit = (formData: FieldValues) => {
        setNewGroupRelationRequest((prevState) => {
            return {
                ...prevState,
                uuid: formData[GroupFormEnum.USER],
                roleUuid: (Array.isArray(chairmanRoleData) ? chairmanRoleData[0].uuid : chairmanRoleData?.uuid) as string,
                orgId: formData[GroupFormEnum.ORGANIZATION],
            }
        })
        createGroup({
            data: {
                name: formData[GroupFormEnum.NAME],
                shortName: formData[GroupFormEnum.SHORT_NAME],
                description: formData[GroupFormEnum.DESCRIPTION],
            },
        })
    }

    return (
        <GroupCreateEditView
            onSubmit={onSubmit}
            goBack={goBack}
            infoData={undefined}
            isEdit={false}
            isLoading={[creatingGroupLoading, creatingRelation].some((item) => item)}
        />
    )
}
