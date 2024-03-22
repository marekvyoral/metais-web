import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

// Screen reader announcer for page change
// Reader is detecting change of element content, thus the timeout with empty string
export const NavAnnouncer: React.FC = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setMessage('')
        }, 500)
        return () => {
            setMessage(t('accessibility.navigated'))
            clearTimeout(timeoutId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    return (
        <span className="govuk-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
            {message}
        </span>
    )
}
