import React, { Suspense } from 'react'

import { Router } from '@/navigation/Router'
import { useUserInfo } from '@/hooks/useUserInfo'

export const App: React.FC = () => {
    useUserInfo()

    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
