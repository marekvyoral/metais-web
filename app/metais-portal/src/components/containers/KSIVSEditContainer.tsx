import { Group, useFindByUuid3, useUpdateOrCreate2 } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { FieldValues } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { KSIVSEditView } from '@/components/views/standartization/KSIVSEditView'

export interface KSIVSEditViewParams {
    onSubmit: (formData: FieldValues) => void
    goBack: () => void
    infoData: Group | undefined
}

interface IKSIVSEditContainer {
    id?: string
    View: React.FC<KSIVSEditViewParams>
}

export const KSIVSEditContainer: React.FC<IKSIVSEditContainer> = ({ id }) => {
    const navigate = useNavigate()
    const { data: infoData, isLoading, isError } = useFindByUuid3(id ?? '')

    const goBack = () => {
        navigate(NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU)
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
                shortName: formData['shortName'],
                name: formData['fullName'],
                description: formData['description'],
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <KSIVSEditView onSubmit={onSubmit} goBack={goBack} infoData={infoData} />
        </QueryFeedback>
    )
}
