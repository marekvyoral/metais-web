import { Group, useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ApiError } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useInvalidateGroupsDetailCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'

import { GroupCreateEditView } from '@/components/views/standardization/groups/GroupCreateEditView'
import { GroupFormEnum } from '@/components/views/standardization/groups/groupSchema'

export interface IGroupForm {
    name: string
    shortName: string
    description: string
    selectUser: string
    orgSelect: string
}

interface IResultApiCall {
    isSuccess: boolean
    isError: boolean
    message: React.ReactNode
}
export interface IGroupEditViewParams {
    onSubmit: (formData: FieldValues) => void
    goBack: () => void
    infoData: Group | undefined
    isEdit?: boolean
    id?: string
    resultApiCall?: IResultApiCall
}

export interface IGroupEditContainer {
    id?: string
    View: React.FC<IGroupEditViewParams>
}

export const GroupEditContainer: React.FC<IGroupEditContainer> = ({ id }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [resultApiCall, setResultApiCall] = useState<IResultApiCall>({
        isError: false,
        isSuccess: false,
        message: undefined,
    })

    const { data: infoData, isLoading, isError } = useFindByUuid3(id ?? '')

    const invalidateGroupDetailCache = useInvalidateGroupsDetailCache(id ?? '')

    const goBack = () => {
        navigate(-1)
    }
    const { mutate: updateGroup, isLoading: isUpdating } = useUpdateOrCreate2({
        mutation: {
            onSuccess() {
                goBack()
                invalidateGroupDetailCache.invalidate()
            },
            onError(error: ApiError) {
                setResultApiCall({
                    isError: true,
                    isSuccess: false,
                    message: error?.type === 'NoChangesDetected' ? t(`errors.${ReponseErrorCodeEnum.DEFAULT}`) : t(`errors.NoChangesDetected`),
                })
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
        <QueryFeedback loading={isLoading || isUpdating} error={isError} withChildren>
            <GroupCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={{ ...infoData }} isEdit resultApiCall={resultApiCall} />
        </QueryFeedback>
    )
}
