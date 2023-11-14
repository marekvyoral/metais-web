import React, { PropsWithChildren, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { AutoLogoutWarningModal } from './AutoLogoutWarningModal'

import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useHandleLogout } from '@isdd/metais-common/hooks/useHandleLogout'
import { useCountdown } from '@isdd/metais-common/hooks/useCountdown'
import { useWarnAndLogoutOnUserInactivity } from '@isdd/metais-common/hooks/useWarnAndLogoutOnUserInactivity'
import { INACTIVE_LOGOUT_TIME, INACTIVE_WARNING_TIME } from '@isdd/metais-common/constants'

export const AutoLogout: React.FC<PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation()
    const { logoutUser, isLoading } = useHandleLogout()

    const warnTime = INACTIVE_WARNING_TIME
    const logoutTime = INACTIVE_LOGOUT_TIME

    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
    const handleLogout = useCallback(() => {
        logoutUser()
        setIsWarningModalOpen(false)
    }, [logoutUser])

    const warn = useCallback(() => {
        setIsWarningModalOpen(true)
    }, [])

    useWarnAndLogoutOnUserInactivity({ handleLogout, warn, warnTime, logoutTime })
    const { countDown } = useCountdown({
        shouldCount: isWarningModalOpen,
        onCountDownEnd: handleLogout,
        timeCountInSeconds: warnTime / 1000,
    })

    return (
        <QueryFeedback loading={isLoading} indicatorProps={{ label: t('autoLogout.loading') }} withChildren>
            {children}
            <AutoLogoutWarningModal isOpen={isWarningModalOpen} countDown={countDown} onClose={() => setIsWarningModalOpen(false)} />
        </QueryFeedback>
    )
}
