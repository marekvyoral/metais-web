import { BaseModal, Button, GridCol, GridRow, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { ApiActiveMonitoringResult } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'

import styles from '../monitoring.module.scss'

export interface IMonitoringLogFilterData extends IFilterParams, IFilter {
    activeMonitoringCfgId: number
}

export interface ICallEndpointResultModal {
    callEndpointResult?: ApiActiveMonitoringResult
    close: () => void
}

export const CallEndpointResultModal: React.FC<ICallEndpointResultModal> = ({ callEndpointResult, close }) => {
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={!!callEndpointResult} close={close}>
            <TextHeading size="M">{t('monitoring.detail.callEndpointModal.title')}</TextHeading>
            <InformationGridRow
                label={t('monitoring.detail.callEndpointModal.responseStatus')}
                value={
                    <GridCol>
                        <GridRow>{callEndpointResult?.status}</GridRow>
                        <GridRow>
                            {callEndpointResult?.statusOk
                                ? t('monitoring.detail.callEndpointModal.StatusOk')
                                : t('monitoring.detail.callEndpointModal.StatusNotOk')}
                        </GridRow>
                    </GridCol>
                }
                hideIcon
            />
            <InformationGridRow
                label={t('monitoring.detail.callEndpointModal.responseBody')}
                value={
                    <GridCol>
                        <GridRow>
                            <TextArea readOnly rows={10} name="responseStatus" defaultValue={callEndpointResult?.body} />
                        </GridRow>
                        <GridRow>
                            {callEndpointResult?.statusOk
                                ? t('monitoring.detail.callEndpointModal.StatusOk')
                                : t('monitoring.detail.callEndpointModal.StatusNotOk')}
                        </GridRow>
                    </GridCol>
                }
                hideIcon
            />
            <div className={styles.alignRight}>
                <Button type="submit" label={t('monitoring.detail.callEndpointModal.close')} onClick={close} />
            </div>
        </BaseModal>
    )
}
