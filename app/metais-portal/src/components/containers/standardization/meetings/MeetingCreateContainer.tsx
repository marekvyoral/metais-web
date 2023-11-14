import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FieldValues } from 'react-hook-form'

import { MeetingCreateEditView } from '@/components/views/standardization/meetings/MeetingCreateEditView'

export const MeetingCreateContainer: React.FC = () => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(NavigationSubRoutes.ZOZNAM_ZASADNUTI)
    }

    // const { data } = useCreateVote1() // create new meeting

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = (formData: FieldValues) => {
        //console.log('data', formData)
    }
    return <MeetingCreateEditView onSubmit={onSubmit} goBack={goBack} infoData={undefined} isEdit={false} />
}
