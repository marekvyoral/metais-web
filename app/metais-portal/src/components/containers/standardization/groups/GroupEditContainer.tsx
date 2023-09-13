import { Group, useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { GroupCreateEditView } from '@/components/views/standartization/groups/GroupCreateEditView'
import { GroupFormEnum } from '@/components/views/standartization/groups/groupSchema'

export interface IGroupForm {
    name: string
    shortName: string
    description: string
    selectUser: string
    orgSelect: string
}

export interface IGroupEditViewParams {
    onSubmit: (formData: FieldValues) => void
    goBack: () => void
    infoData: Group | undefined
    isEdit?: boolean
}

interface IGroupEditContainer {
    id?: string
    View: React.FC<IGroupEditViewParams>
}

export const GroupEditContainer: React.FC<IGroupEditContainer> = ({ id }) => {
    const navigate = useNavigate()

    const { data: infoData, isLoading, isError } = useFindByUuid3(id ?? '')

    const goBack = () => {
        navigate(-1)
    }
    const { mutate: updateGroup } = useUpdateOrCreate2({
        mutation: {
            onSuccess() {
                goBack()
            },
        },
    })

    const onSubmit = (formData: FieldValues) => {
        updateGroup({
            data: {
                uuid: infoData?.uuid,
                name: formData[GroupFormEnum.NAME],
                shortName: formData[GroupFormEnum.SHORT_NAME],
                description: formData[GroupFormEnum.DESCRIPTION],
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <GroupCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={infoData} isEdit />
        </QueryFeedback>
    )
}
