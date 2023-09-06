import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tab } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { getTabsFromApi } from '@isdd/metais-common'
import { Button } from '@isdd/idsk-ui-kit'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from '../detailViews.module.scss'
import { BasicInformations } from '../BasicInformations'

import { EntityDetailViewAttributes } from './attributes/EntityDetailViewAttributes'
import { SummarizingCard } from './SummarizingCard'

import { IAtrributesContainerView } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { ProfileTabs } from '@/components/ProfileTabs'

export const EntityDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, summarizingCardData, attributesOverridesData },
    setValidityOfEntity,
    setSummarizingCardData,
    saveExistingAttribute,
    resetExistingAttribute,
}: IAtrributesContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const tabsFromApi = getTabsFromApi(
        keysToDisplay,
        EntityDetailViewAttributes,
        attributesOverridesData,
        undefined,
        saveExistingAttribute,
        resetExistingAttribute,
    )

    const tabList: Tab[] = [
        {
            id: 'summarizingCard',
            title: t('egov.detail.summarizingCard'),
            content: <SummarizingCard data={summarizingCardData} setSummarizingCardData={setSummarizingCardData} />,
        },
        {
            id: 'genericProfile',
            title: t('egov.detail.genericProfile'),
            content: (
                <EntityDetailViewAttributes
                    data={ciTypeData}
                    attributesOverridesData={attributesOverridesData}
                    saveExistingAttribute={saveExistingAttribute}
                    resetExistingAttribute={resetExistingAttribute}
                />
            ),
        },
        ...tabsFromApi,
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</h2>
                    <div>
                        <Button
                            label={t('egov.edit')}
                            onClick={() => {
                                navigate('/egov/entity/' + ciTypeData?.technicalName + '/edit', { state: { from: location } })
                            }}
                        />
                        <Button
                            label={ciTypeData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                            onClick={() => setValidityOfEntity(ciTypeData?.technicalName)}
                        />
                    </div>
                </div>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            </div>
            <ProfileTabs tabList={tabList} />
        </>
    )
}
