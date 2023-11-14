import { BreadCrumbs, GridCol, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'

import { NotificationsDetailViewParams } from '@/components/containers/NotificationsDetailContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const NotificationsDetailView: React.FC<NotificationsDetailViewParams> = ({ data, id, isError, isLoading }) => {
    const { t } = useTranslation()
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
                    <GridCol setWidth="two-thirds">
                        <DefinitionList>
                            <DefinitionListItem label={t('notifications.created')} value={t('dateTime', { date: date })} />
                            <DefinitionListItem
                                label={t('notifications.description')}
                                value={<SafeHtmlComponent dirtyHtml={data?.message ?? ''} />}
                            />
                        </DefinitionList>
                    </GridCol>
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default NotificationsDetailView
