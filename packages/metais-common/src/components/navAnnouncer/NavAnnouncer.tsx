import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const NavAnnouncer: React.FC = () => {
    const location = useLocation()
    const { t } = useTranslation()
    const [title, setTitle] = useState<string>('')

    useEffect(() => {
        setTitle(document.title)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <span className="govuk-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
            {t('accessibility.navigated', { pageTitle: title })}
        </span>
    )
}
