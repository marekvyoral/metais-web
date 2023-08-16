import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'

import { BasicInformation } from './BasicInformation'

import styles from '@/components/views/egov/detailViews.module.scss'
import { IOrganizationDetail } from '@/components/containers/organizations/OrganizationsDetailContainer'

const OrganizationsDetailView = ({ parsedAttributes, statutarAttributes, setInvalid, configurationItem }: IOrganizationDetail) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('organizations.detail.title')}</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                            label={t('egov.edit')}
                            onClick={() => {
                                navigate('/organizations/' + configurationItem?.uuid + '/edit')
                            }}
                        />
                        <Button
                            label={t('egov.detail.validityChange.setInvalid')}
                            onClick={() => setInvalid?.(configurationItem?.uuid, configurationItem)}
                        />
                    </div>
                </div>
                <BasicInformation parsedAttributes={parsedAttributes} />
            </div>
            <div className={styles.basicInformationSpace}>
                <h2 className="govuk-heading-l">{t('organizations.detail.statutoryOfficer')}</h2>
                <BasicInformation parsedAttributes={statutarAttributes} />
            </div>
        </>
    )
}

export default OrganizationsDetailView
