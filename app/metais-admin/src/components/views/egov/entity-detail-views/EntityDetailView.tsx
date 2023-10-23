import React from 'react'
import { useTranslation } from 'react-i18next'
import { Tab } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { getTabsFromApi, QueryFeedback } from '@isdd/metais-common'
import { Button, ButtonGroupRow } from '@isdd/idsk-ui-kit'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { EntityDetailViewAttributes } from './attributes/EntityDetailViewAttributes'
import { SummarizingCard } from './SummarizingCard'

import styles from '@/components/views/egov/detailViews.module.scss'
import { BasicInformations } from '@/components/views/egov/BasicInformations'
import { IAtrributesContainerView } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { ProfileTabs } from '@/components/ProfileTabs'

export const EntityDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, summarizingCardData, attributesOverridesData },
    setValidityOfEntity,
    setSummarizingCardData,
    saveExistingAttribute,
    resetExistingAttribute,
    isError,
    isLoading,
    roles,
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
                    roles={roles}
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
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <div className={styles.basicInformationSpace}>
                <FlexColumnReverseWrapper>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className="govuk-heading-l">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</h2>
                        <ButtonGroupRow>
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
                        </ButtonGroupRow>
                    </div>
                    {isError && <QueryFeedback error loading={false} />}
                </FlexColumnReverseWrapper>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} roles={roles} />
            </div>
            <ProfileTabs tabList={tabList} />
        </QueryFeedback>
    )
}
