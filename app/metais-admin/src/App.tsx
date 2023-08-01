import React from 'react'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    useUserInfo()

    return <Router />
}
