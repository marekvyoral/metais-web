import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroupRow, Tab, Tabs, TextHeading } from '@isdd/idsk-ui-kit'
import { useLocation, useNavigate } from 'react-router-dom'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'

import ConnectionView from './connections/ConnectionView'
import { AddConnectionModal } from './connections/AddConnectionModal'

import createEntityStyles from '@/components/views/egov/entity-detail-views/createEntityView.module.scss'
import { EntityDetailViewAttributes } from '@/components/views/egov/entity-detail-views/attributes/EntityDetailViewAttributes'
import { BasicInformation } from '@/components/views/egov/BasicInformation'
import styles from '@/components/views/egov/detailViews.module.scss'
import { IRelationDetailContainerView } from '@/components/containers/Egov/Relation/RelationsDetailContainer'

export const RelationDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, attributeOverridesData },
    unValidRelationShipTypeMutation,
    addNewConnectionToExistingRelation,
    saveExistingAttribute,
    resetExistingAttribute,
    isLoading,
    isError,
    roles,
}: IRelationDetailContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()

    const [connectionsOpen, setConnectionsOpen] = useState(false)

    const tabsNames = Array.from(keysToDisplay?.keys() ?? new Map())

    const tabsFromApi = tabsNames?.map((key) => {
        const tabData = keysToDisplay?.get(key)
        return {
            id: key,
            title: key,
            content: (
                <EntityDetailViewAttributes
                    data={tabData}
                    attributesOverridesData={attributeOverridesData}
                    saveExistingAttribute={saveExistingAttribute}
                    resetExistingAttribute={resetExistingAttribute}
                    roles={roles}
                />
            ),
        }
    })

    const tabList: Tab[] = [
        {
            id: 'connections',
            title: t('egov.detail.connections'),
            content: <ConnectionView sources={ciTypeData?.sources} targets={ciTypeData?.targets} />,
        },
        {
            id: 'genericProfile',
            title: t('egov.detail.genericProfile'),
            content: (
                <EntityDetailViewAttributes
                    data={{ ...ciTypeData, name: t('egov.detail.genericProfile'), technicalName: 'Gen_Profil_Rel' }}
                    attributesOverridesData={attributeOverridesData}
                    saveExistingAttribute={saveExistingAttribute}
                    resetExistingAttribute={resetExistingAttribute}
                    roles={roles}
                />
            ),
        },
        ...tabsFromApi,
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <div className={styles.basicInformationSpace}>
                <FlexColumnReverseWrapper>
                    <div className={styles.flexBetween}>
                        <TextHeading size="XL">{t('egov.detail.entityHeading') + ` - ${ciTypeData?.name}`}</TextHeading>
                        <ButtonGroupRow>
                            <Button
                                label={t('egov.edit')}
                                onClick={() => {
                                    navigate('/egov/relation/' + ciTypeData?.technicalName + '/edit', { state: { from: location } })
                                }}
                                disabled={ciTypeData?.type === AttributeProfileType.system || ciTypeData?.valid === false}
                            />
                            <Button
                                label={ciTypeData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                                onClick={() => unValidRelationShipTypeMutation?.(ciTypeData?.technicalName)}
                                disabled={ciTypeData?.type === AttributeProfileType.system}
                            />
                        </ButtonGroupRow>
                    </div>
                    {isError && <QueryFeedback error loading={false} />}
                    <MutationFeedback success={isActionSuccess.value} />
                </FlexColumnReverseWrapper>
                <BasicInformation data={{ ciTypeData, constraintsData, unitsData }} roles={roles} />
            </div>
            <div className={createEntityStyles.addConnection}>
                <Button
                    label={t('egov.create.addConnection')}
                    onClick={() => setConnectionsOpen(true)}
                    className={styles.addConnection}
                    disabled={ciTypeData?.type === AttributeProfileType.system || ciTypeData?.valid === false}
                />
            </div>
            <AddConnectionModal open={connectionsOpen} onClose={() => setConnectionsOpen(false)} addConnection={addNewConnectionToExistingRelation} />
            <TextHeading size="M">{t('egov.detail.profiles')}</TextHeading>
            <Tabs tabList={tabList} />
        </QueryFeedback>
    )
}
