import { BreadCrumbs, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'

import styles from './notifications.module.scss'

import { NotificationsDetailViewParams } from '@/components/containers/NotificationsDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const NotificationsDetailView: React.FC<NotificationsDetailViewParams> = ({ data, id, isError, isLoading }) => {
    const { t, i18n } = useTranslation()
    const date = new Date(data?.createdAt ?? '')
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('notifications.notifications'), href: NavigationSubRoutes.NOTIFICATIONS },
                    { label: data?.messagePerex ?? '', href: NavigationSubRoutes.NOTIFICATIONS + '/' + id },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="L">{data?.messagePerex}</TextHeading>
                        {isError && <QueryFeedback loading={false} error={isError} />}
                    </FlexColumnReverseWrapper>
                    <div className={styles.displayFlex}>
                        <TextBody className={styles.fontWeightBolder}>{t('notifications.created')}</TextBody>
                        <TextBody> {date.toLocaleString(i18n.language)}</TextBody>
                    </div>
                    <SafeHtmlComponent dirtyHtml={data?.message ?? ''} />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default NotificationsDetailView
