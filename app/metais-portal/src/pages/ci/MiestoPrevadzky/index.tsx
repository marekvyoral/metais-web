import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const MiestoPrevadzkyEntityDetailPage: React.FC = () => {
    const navigate = useNavigate()
    const { entityId } = useGetEntityParamsFromUrl()

    useEffect(() => {
        navigate(RouterRoutes.HOME)
    }, [navigate, entityId])

    return <></>
}

export default MiestoPrevadzkyEntityDetailPage
