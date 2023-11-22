import { BreadCrumbs, Button, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from '@isdd/metais-common/components/crash-fallback/crash.module.scss'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'

type Props = {
    heading?: string
}

export const TodoPage: React.FC<Props> = ({ heading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: RouterRoutes.HOME, icon: HomeIcon }]} />
            <MainContentWrapper>
                <div className={styles.centered}>
                    <TextHeading size="XL">{heading ?? t('todo.header')}</TextHeading>
                    <TextBody size="L">{t('todo.description')}</TextBody>
                    <Button label={t('todo.homeButton')} onClick={() => navigate(RouterRoutes.HOME)} />
                </div>
            </MainContentWrapper>
        </>
    )
}
