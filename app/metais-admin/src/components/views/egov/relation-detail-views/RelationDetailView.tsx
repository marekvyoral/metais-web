import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Tab, Tabs } from '@isdd/idsk-ui-kit'
import { useNavigate } from 'react-router-dom'

import styles from '../detailViews.module.scss'
import createEntityStyles from '../entity-detail-views/createEntityView.module.scss'
import BasicInformations from '../BasicInformations'
import { EntityDetailViewAttributes } from '../entity-detail-views/attributes/EntityDetailViewAttributes'

import ConnectionView from './connections/ConnectionView'
import { AddConnectionModal } from './connections/AddConnectionModal'

import { IAtrributesContainerView } from '@/components/containers/Egov/Relation/RelationsDetailContainer'

export const RelationDetailView = ({
    data: { ciTypeData, constraintsData, unitsData, keysToDisplay, attributeOverridesData },
    unValidRelationShipTypeMutation,
    addNewConnectionToExistingRelation,
    saveExistingAttribute,
    resetExistingAttribute,
}: IAtrributesContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
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
                    data={ciTypeData}
                    attributesOverridesData={attributeOverridesData}
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
                            label="zmenit"
                            onClick={() => {
                                navigate('/egov/relation/' + ciTypeData?.technicalName + '/edit')
                            }}
                        />
                        <Button
                            label={ciTypeData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                            onClick={() => unValidRelationShipTypeMutation?.(ciTypeData?.technicalName)}
                        />
                    </div>
                </div>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            </div>
            <div className={createEntityStyles.addConnection}>
                <Button label={t('egov.create.addConnection')} onClick={() => setConnectionsOpen(true)} className={styles.addConnection} />
            </div>
            <AddConnectionModal open={connectionsOpen} onClose={() => setConnectionsOpen(false)} addConnection={addNewConnectionToExistingRelation} />
            <div>
                <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>
                <Tabs tabList={tabList} />
            </div>
        </>
    )
}
