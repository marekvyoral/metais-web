import { BreadCrumbs, Button, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export const TodoPage: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="XL">{t('todo.header')}</TextHeading>
                <Button label={t('todo.homeButton')} onClick={() => navigate('/')} />
            </MainContentWrapper>
        </>
    )
}
