import React from 'react'
import { useTranslation } from 'react-i18next'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'

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

    return (
        <>
            <TextHeading size={'L'}>Elektronický národný register informácií dopravy</TextHeading>
            <Tabs tabList={tabList} />
        </>
    )
}

export default ProjektEntityDetailPage
