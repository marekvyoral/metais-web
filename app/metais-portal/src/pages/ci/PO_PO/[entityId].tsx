import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, useReadConfigurationItem } from '@isdd/metais-common/api'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

import Informations from './[entityId]/informations'

import NeighboursCardListWrapper from '@/components/entities/NeighboursCardListWrapper'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.PO_PODetail')}`
    const { isActionSuccess } = useActionSuccess()
    const { entityId } = useParams()
    const entityName = 'PO_PO'
    const PO = 'PO'

    const tabList: Tab[] = [
        {
            id: 'informations',
            path: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: 'documents',
            path: `/ci/${entityName}/${entityId}/documents`,
            title: t('ciType.documents'),
            content: <Outlet />,
        },
        {
            id: 'relationships',
            path: `/ci/${entityName}/${entityId}/relationships`,
            title: t('ciType.relationships'),
            content: <Outlet />,
        },
        {
            id: 'history',
            path: `/ci/${entityName}/${entityId}/history`,
            title: t('ciType.history'),
            content: <Outlet />,
        },
    ]

    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    //need to call ciItemData here to show heading
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('ciType.PO_PO_Heading'), href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">{ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}</TextHeading>
                    <MutationFeedback error={false} success={isActionSuccess.value} />
                </FlexColumnReverseWrapper>
                <Tabs tabList={tabList} />
                <NeighboursCardListWrapper entityId={entityId} entityName={PO} tabList={tabList} />
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
