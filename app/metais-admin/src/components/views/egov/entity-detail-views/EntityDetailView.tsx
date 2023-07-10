import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tab } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { getTabsFromApi } from '@isdd/metais-common'
import { Button } from '@isdd/idsk-ui-kit'

import styles from '../detailViews.module.scss'
import BasicInformations from '../BasicInformations'

import { EntityDetailViewAttributes } from './EntityDetailViewAttributes'
import { SummarizingCard } from './SummarizingCard'

import { IAtrributesContainerView } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { ProfileTabs } from '@/components/ProfileTabs'

export const EntityDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, summarizingCardData },
}: IAtrributesContainerView) => {
    const { t } = useTranslation()

    const tabsFromApi = getTabsFromApi(keysToDisplay, EntityDetailViewAttributes)

    const tabList: Tab[] = [
        { id: 'summarizingCard', title: t('egov.detail.summarizingCard'), content: <SummarizingCard data={summarizingCardData} /> },
        { id: 'genericProfile', title: t('egov.detail.genericProfile'), content: <EntityDetailViewAttributes data={ciTypeData} /> },
        ...tabsFromApi,
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</h2>
                    <Button label="zneplatnit" />
                </div>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            </div>
            <ProfileTabs tabList={tabList} />
        </>
    )
}
