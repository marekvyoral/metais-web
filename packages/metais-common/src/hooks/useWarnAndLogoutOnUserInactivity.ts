import { useEffect } from 'react'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type Props = {
    handleLogout: () => void
    warn: () => void
    warnTime: number
    logoutTime: number
}

export const useWarnAndLogoutOnUserInactivity = ({ handleLogout, warn, warnTime, logoutTime }: Props) => {
    const {
        state: { user },
    } = useAuth()

    useEffect(() => {
        if (user?.uuid) {
            const events = [
                'click',
                'mousemove',
                'keypress',
                'scroll',
                'touchstart',
                'touchmove',
                'keydown',
                'keyup',
                'mousedown',
                'mouseup',
                'mouseenter',
                'mouseleave',
                'focus',
                'blur',
                'visibilitychange',
                'resize',
                'contextmenu',
                'wheel',
            ]

            let warnTimeout: NodeJS.Timeout
            let logoutTimeout: NodeJS.Timeout

            const clearTimeouts = () => {
                if (warnTimeout) clearTimeout(warnTimeout)
                if (logoutTimeout) clearTimeout(logoutTimeout)
            }

            const setTimeouts = () => {
                clearTimeouts()
                warnTimeout = setTimeout(warn, logoutTime - warnTime)
                logoutTimeout = setTimeout(handleLogout, logoutTime)
            }

            const resetTimeout = () => {
                clearTimeouts()
                setTimeouts()
            }

            setTimeouts()
            events.forEach((event) => {
                window.addEventListener(event, resetTimeout)
            })

            return () => {
                clearTimeouts()
                events.forEach((event) => {
                    window.removeEventListener(event, resetTimeout)
                })
            }
        }
    }, [handleLogout, logoutTime, user?.uuid, warn, warnTime])
}
