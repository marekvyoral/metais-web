import React from 'react'
import { useTranslation } from 'react-i18next'

const LicenseHowTo = () => {
    const { t } = useTranslation()
    return <div>{t('navMenu.lists.licenses')}</div>
}

export default LicenseHowTo
