import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'

import styles from '../detailViews.module.scss'
import BasicInformations from '../BasicInformations'

import { EntityDetailViewAttributes } from './EntityDetailViewAttributes'
import { SummarizingCard } from './SummarizingCard'

import { IAtrributesContainerView } from '@/components/containers/Egov/Entity/EntityDetailContainer'

export const EntityDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, summarizingCardData },
}: IAtrributesContainerView) => {
    const { t } = useTranslation()
    const tabsNames = Array.from(keysToDisplay?.keys())

    const tabsFromApi = tabsNames?.map((key) => {
        const tabData = keysToDisplay?.get(key)
        return {
            id: key,
            title: key,
            content: <EntityDetailViewAttributes data={tabData} />,
        }
    })

    const tabList: Tab[] = [
        { id: 'summarizingCard', title: 'summarizingCard', content: <SummarizingCard data={summarizingCardData} /> },
        { id: 'genericProfile', title: 'genericProfile', content: <EntityDetailViewAttributes data={ciTypeData} /> },
        ...tabsFromApi,
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <h2 className="govuk-heading-l">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</h2>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            </div>
            <div>
                <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>
                <Tabs tabList={tabList} />
            </div>
        </>
    )
}
