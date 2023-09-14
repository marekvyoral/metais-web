import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const LicenseHowTo = () => {
    const { t } = useTranslation()
    return <MainContentWrapper>{t('navMenu.lists.licenses')}</MainContentWrapper>
}

export default LicenseHowTo
