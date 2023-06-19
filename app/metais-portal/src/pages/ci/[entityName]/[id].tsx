import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'

import { Tab, Tabs } from '@/components/tabs/Tabs'
import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { CiContainer } from '@/components/containers/CiContainer'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { CiWithRelsResultUi, RelatedCiTypePreview } from '@/api'

const ProjektEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { projektId, entityName } = useParams()

    const tabList = [
        {
            id: '1',
            title: t('ciType.informations'),
            content: (
                <>
                    <CiContainer entityName={entityName ?? ''} entityId={projektId ?? ''} View={ProjectInformationAccordion} />
                </>
            ),
        },
        {
            id: '2',
            title: t('ciType.documents'),
            content: <></>,
        },
    ]

    const tabListRelations = ({
        keysToDisplay,
        entityTypes,
    }: {
        entityTypes?: RelatedCiTypePreview[]
        relationsList?: CiWithRelsResultUi
        keysToDisplay: {
            tabName: string
            technicalName: string
        }[]
    }): Tab[] =>
        keysToDisplay.map((key, index) => ({
            id: index.toString(),
            title: key.tabName,
            content: (
                <>
                    <ApplicationServiceRelations entityId={projektId ?? ''} ciType={key.technicalName} entityTypes={entityTypes} />
                </>
            ),
        }))

    return (
        <>
            <TextHeading size={'L'}>Elektronický národný register informácií dopravy</TextHeading>
            <Tabs tabList={tabList} />
            <TextHeading size={'M'}>Vzťahy na súvisiace položky</TextHeading>
            <RelationsListContainer
                entityId={projektId ?? ''}
                technicalName={entityName ?? ''}
                View={({ data, filterCallback, setClickedEntityName }) => {
                    console.log(data)
                    return <Tabs tabList={tabListRelations(data)} />
                }}
            />
        </>
    )
}

export default ProjektEntityDetailPage
