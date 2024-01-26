import { Group, useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useInvalidateGroupsDetailCache, useInvalidateGroupsListCache } from '@isdd/metais-common/hooks/invalidate-cache'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

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
    resultApiCall?: IResultApiCall
    isLoading: boolean
    uniqueConstraintError?: { [key: string]: string }
}

export interface IGroupEditContainer {
    id?: string
    View: React.FC<IGroupEditViewParams>
}

export const GroupEditContainer: React.FC<IGroupEditContainer> = ({ id }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { setIsActionSuccess } = useActionSuccess()

    const [resultApiCall, setResultApiCall] = useState<IResultApiCall>({
        isError: false,
        isSuccess: false,
        message: undefined,
    })

    const { data: infoData, isLoading, isError } = useFindByUuid3(id ?? '')
    const [uniqueConstraintError, setUniqueConstraintError] = useState<{ [key: string]: string }>()
    const invalidateGroupDetailCache = useInvalidateGroupsDetailCache(id ?? '')
    const invalidateCache = useInvalidateGroupsListCache({ sortBy: 'name', ascending: false })
    const goBack = () => {
        navigate(`${RouterRoutes.STANDARDIZATION_GROUPS_LIST}/${infoData?.uuid}`)
    }
    const { mutate: updateGroup, isLoading: isUpdating } = useUpdateOrCreate2({
        mutation: {
            onSuccess() {
                setIsActionSuccess({
                    value: true,
                    path: `${RouterRoutes.STANDARDIZATION_GROUPS_LIST}/${infoData?.uuid}`,
                    additionalInfo: { entity: 'group', type: 'edit' },
                })
                goBack()
                invalidateCache.invalidate()
                invalidateGroupDetailCache.invalidate()
            },
            onError(error) {
                if (error instanceof Error && typeof error.message === 'string') {
                    const err: { [key: string]: string } = {}
                    const errorData = JSON.parse(error.message)
                    switch (errorData.type) {
                        case 'UniqueConstraintException':
                            err[errorData.property] =
                                errorData.property === 'name' ? t('groups.errors.uniqueName') : t('groups.errors.uniqueShortName')
                            setUniqueConstraintError(err)
                            break
                        case 'NoChangesDetected':
                            setResultApiCall({
                                isError: true,
                                isSuccess: false,
                                message: t(`errors.NoChangesDetected`),
                            })
                            break
                        default:
                            setResultApiCall({
                                isError: true,
                                isSuccess: false,
                                message: t(`errors.${ReponseErrorCodeEnum.DEFAULT}`),
                            })
                            break
                    }
                }
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
            <GroupCreateEditView
                onSubmit={onSubmit}
                goBack={goBack}
                infoData={{ ...infoData }}
                isEdit
                resultApiCall={resultApiCall}
                isLoading={isUpdating}
                uniqueConstraintError={uniqueConstraintError}
            />
        </QueryFeedback>
    )
}
