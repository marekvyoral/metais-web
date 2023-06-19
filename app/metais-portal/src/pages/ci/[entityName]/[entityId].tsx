import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'

import { Tabs } from '@/components/tabs/Tabs'
import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { CiContainer } from '@/components/containers/CiContainer'
import Documents from '@/pages/ci/[entityName]/[entityId]/documents'
import Relationships from '@/pages/ci/[entityName]/[entityId]/relationships'
const ProjektEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useParams()

    const tabList = [
        {
            id: '1',
            title: t('ciType.informations'),
            content: (
                <>
                    <CiContainer entityName={entityName ?? ''} entityId={entityId ?? ''} View={ProjectInformationAccordion} />
                </>
            ),
        },
        {
            id: '2',
            title: t('ciType.documents'),
            content: <Documents />,
        },
        {
            id: '3',
            title: t('ciType.relationships'),
            content: <Relationships />,
        },
    ]

    const tabListRelations = [
        {
            id: '1',
            title: `${t('relationType.as')} (1)`,
            content: (
                <>
                    <ApplicationServiceRelations />
                </>
            ),
        },
    ]

    return (
        <>
            <TextHeading size={'L'}>Elektronický národný register informácií dopravy</TextHeading>
            <Tabs tabList={tabList} />
            <TextHeading size={'M'}>Vzťahy na súvisiace položky</TextHeading>
            <Tabs tabList={tabListRelations} />
        </>
    )
}

export default ProjektEntityDetailPage
