import { useAddGroupOrgRoleIdentityRelationHook, useFindAll11, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GROUP_ROLES } from '@isdd/metais-common/constants'
import { FieldValues } from 'react-hook-form'

import { GroupCreateEditView } from '@/components/views/standartization/groups/GroupCreateEditView'
import { GroupFormEnum } from '@/components/views/standartization/groups/groupSchema'

interface INewGroupRelationRequest {
    uuid: string
    groupUuid: string
    roleUuid: string
    orgId: string
}

export const GroupCreateContainer: React.FC = () => {
    const navigate = useNavigate()

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

    const { mutate: createGroup } = useUpdateOrCreate2({
        mutation: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSuccess(res: any) {
                createNewGroupRelationsHook(newGroupRelationRequest.uuid, res.uuid, newGroupRelationRequest.roleUuid, newGroupRelationRequest.orgId)
                goBack()
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

    return <GroupCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={undefined} isEdit={false} />
}
