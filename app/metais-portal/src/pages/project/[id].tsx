import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { TextHeading } from '@/components/typography/TextHeading'
import { Tabs } from '@/components/tabs/Tabs'
import { ApplicationServiceRelations } from '@/components/entities/projekt/ApplicationServiceRelations'
import { ProjectInformationAccordion } from '@/components/entities/projekt/accordion/ProjectInformationAccordion'
import { useReadConfigurationItemUsingGET, useGetRoleParticipantUsingGET, useReadCiNeighboursWithAllRelsUsingGET, useGetCiTypeUsingGET } from '@/api'

const ProjektEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { projektId } = useParams()
    const { data } = useReadConfigurationItemUsingGET(projektId ?? '')
    const { data: ciTypes } = useGetCiTypeUsingGET('ISVS')
    // const { data: ciWithRels } = useReadCiNeighboursWithAllRelsUsingGET(projektId ?? '')
    const { data: participantData } = useGetRoleParticipantUsingGET(data?.metaAttributes?.owner ?? '')

    const tabList = [
        {
            id: '1',
            title: t('ciType.informations'),
            content: (
                <>
                    <ProjectInformationAccordion
                        attributes={data?.attributes}
                        participantAttributes={participantData?.configurationItemUi?.attributes}
                        ciTypesAttributes={ciTypes?.attributes}
                    />
                </>
            ),
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
