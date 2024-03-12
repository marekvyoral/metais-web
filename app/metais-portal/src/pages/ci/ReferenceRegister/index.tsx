import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const ReferenceRegisterDetail: React.FC = () => {
    const navigate = useNavigate()
    const { entityId } = useGetEntityParamsFromUrl()

    useEffect(() => {
        navigate(`/refregisters/${entityId}/`)
    }, [navigate, entityId])

    return <></>
}

export default ReferenceRegisterDetail
