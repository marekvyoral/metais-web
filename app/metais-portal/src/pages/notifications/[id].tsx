import { useParams } from 'react-router-dom'
import React, { useEffect } from 'react'
import { BreadCrumbs, HomeIcon, LoadingIndicator, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useGetNotificationDetail, useSetNotificationAsRead } from '@isdd/metais-common/api/generated/notifications-swagger'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import styles from './notifications.module.scss'

const NotificationsDetailPage = () => {
    const { id } = useParams()
    const { t, i18n } = useTranslation()
    const idNumber = Number(id)
    const { isLoading, data } = useGetNotificationDetail(idNumber)
    const { mutate: setAsRead } = useSetNotificationAsRead()
    const date = new Date(data?.createdAt ?? '')
    useEffect(() => {
        setAsRead({ id: idNumber })
    }, [idNumber, setAsRead])

    return isLoading ? (
        <LoadingIndicator />
    ) : (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('notifications.notifications'), href: NavigationSubRoutes.NOTIFICATIONS },
                    { label: data?.messagePerex ?? '', href: NavigationSubRoutes.NOTIFICATIONS + id },
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

export default NotificationsDetailPage
