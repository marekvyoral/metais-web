import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Tab } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { getTabsFromApi, MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { Button, ButtonGroupRow, TextHeading } from '@isdd/idsk-ui-kit'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { EntityDetailViewAttributes } from './attributes/EntityDetailViewAttributes'

import styles from '@/components/views/egov/detailViews.module.scss'
import { BasicInformation } from '@/components/views/egov/BasicInformation'
import { IEntityDetailContainerView } from '@/components/containers/Egov/Entity/EntityDetailContainer'
import { ProfileTabs } from '@/components/ProfileTabs'

export const EntityDetailView = ({
    data: {
        ciTypeData,
        constraintsData,
        unitsData,
        keysToDisplay,
        attributesOverridesData,
        // summarizingCardData,
    },
    setValidityOfEntity,
    // setSummarizingCardData,
    saveExistingAttribute,
    resetExistingAttribute,
    isError,
    isLoading,
    roles,
}: IEntityDetailContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const tabsFromApi = getTabsFromApi(
        keysToDisplay,
        EntityDetailViewAttributes,
        attributesOverridesData,
        undefined,
        saveExistingAttribute,
        resetExistingAttribute,
        roles,
    )

    const tabList: Tab[] = [
        // HIDDEN UNTIL WE FIND OUT WHY IT IS HERE
        // {
        //     id: 'summarizingCard',
        //     title: t('egov.detail.summarizingCard'),
        //     content: <SummarizingCard data={summarizingCardData} setSummarizingCardData={setSummarizingCardData} />,
        // },
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

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <div className={styles.basicInformationSpace}>
                <FlexColumnReverseWrapper>
                    <div className={styles.flexBetween}>
                        <TextHeading size="XL">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</TextHeading>
                        <ButtonGroupRow>
                            <Button
                                label={t('egov.edit')}
                                onClick={() => {
                                    navigate('/egov/entity/' + ciTypeData?.technicalName + '/edit', { state: { from: location } })
                                }}
                                disabled={ciTypeData?.type === AttributeProfileType.system}
                            />
                            <Button
                                label={ciTypeData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                                onClick={() => setValidityOfEntity(ciTypeData?.technicalName)}
                                disabled={ciTypeData?.type === AttributeProfileType.system}
                            />
                        </ButtonGroupRow>
                    </div>
                    {isError && <QueryFeedback error loading={false} />}
                    <div ref={wrapperRef}>
                        <MutationFeedback
                            success={isActionSuccess.value && isActionSuccess?.additionalInfo?.type === 'attrEdit'}
                            successMessage={t('mutationFeedback.attrSuccessfulUpdated')}
                        />

                        <MutationFeedback
                            success={
                                isActionSuccess.value &&
                                (isActionSuccess.additionalInfo?.type === 'edit' || isActionSuccess.additionalInfo?.type === 'create')
                            }
                            successMessage={
                                isActionSuccess.additionalInfo?.type === 'edit'
                                    ? t('mutationFeedback.successfulUpdated')
                                    : t('mutationFeedback.successfulCreated')
                            }
                        />
                    </div>
                </FlexColumnReverseWrapper>
                <BasicInformation data={{ ciTypeData, constraintsData, unitsData }} roles={roles} />
            </div>
            <ProfileTabs tabList={tabList} />
        </QueryFeedback>
    )
}
