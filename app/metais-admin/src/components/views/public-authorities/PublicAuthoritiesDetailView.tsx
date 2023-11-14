import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { BasicInformation } from './BasicInformation'

import styles from '@/components/views/egov/detailViews.module.scss'
import { IPublicAuthoritiesDetail } from '@/components/containers/public-authorities/PublicAuthoritiesDetailContainer'

interface Props extends IPublicAuthoritiesDetail {
    isError: boolean
    isLoading: boolean
}

const PublicAuthoritiesDetailView: React.FC<Props> = ({
    parsedAttributes,
    statutarAttributes,
    setInvalid,
    configurationItem,
    isError,
    isLoading,
}) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <div className={styles.basicInformationSpace}>
                <FlexColumnReverseWrapper>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2 className="govuk-heading-l">{t('publicAuthorities.detail.title')}</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                label={t('egov.edit')}
                                onClick={() => {
                                    navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES}/${configurationItem?.uuid}/edit`, { state: { from: location } })
                                }}
                            />
                            <Button
                                label={t('egov.detail.validityChange.setInvalid')}
                                onClick={() => setInvalid?.(configurationItem?.uuid, configurationItem)}
                            />
                        </div>
                    </div>
                    {isError && <QueryFeedback loading={false} error={isError} />}
                </FlexColumnReverseWrapper>
                <BasicInformation parsedAttributes={parsedAttributes} />
            </div>
            <div className={styles.basicInformationSpace}>
                <h2 className="govuk-heading-l">{t('publicAuthorities.detail.statutoryOfficer')}</h2>
                <BasicInformation parsedAttributes={statutarAttributes} />
            </div>
        </QueryFeedback>
    )
}

export default PublicAuthoritiesDetailView
