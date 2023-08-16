import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './notifications.module.scss'

import { NotificationsDetailViewParams } from '@/components/containers/NotificationsDetailContainer'

const NotificationsDetailView: React.FC<NotificationsDetailViewParams> = ({ data, id }) => {
    const { t, i18n } = useTranslation()
    const date = new Date(data?.createdAt ?? '')
    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('notifications.notifications'), href: NavigationSubRoutes.NOTIFICATIONS },
                    { label: data?.messagePerex ?? '', href: NavigationSubRoutes.NOTIFICATIONS + '/' + id },
                ]}
            />
            <TextHeading size="L">{data?.messagePerex}</TextHeading>
            <div className={styles.displayFlex}>
                <TextBody className={styles.fontWeightBolder}>{t('notifications.created')}</TextBody>
                <TextBody> {date.toLocaleString(i18n.language)}</TextBody>
            </div>
            <div dangerouslySetInnerHTML={{ __html: data?.message ?? '' }} />
        </>
    )
}

export default NotificationsDetailView
