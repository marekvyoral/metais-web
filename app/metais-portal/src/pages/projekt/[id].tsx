import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'

import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'

const ProjektEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()

    const tabList = [
        {
            id: '1',
            title: t('ciType.informations'),
            content: <>{/* <CiContainer entityName={entityName ?? ''} entityId={projektId ?? ''} View={ProjectInformationAccordion} /> */}</>,
        },
        {
            id: '2',
            title: t('ciType.documents'),
            content: <></>,
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