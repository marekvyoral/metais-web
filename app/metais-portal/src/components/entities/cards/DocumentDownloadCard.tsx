import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback } from '@isdd/metais-common/index'
import { DMS_DOWNLOAD_FILE } from '@isdd/metais-common/api'
import { Metadata } from '@isdd/metais-common/api/generated/dms-swagger'

import styles from '@/components/entities/cards/relationCard.module.scss'
import { RelationAttribute } from '@/components/entities/cards/RelationAttribute'
import { convertBytesToMegaBytes } from '@/componentHelpers'

interface IDocumentDownloadCardProps extends PropsWithChildren {
    data?: Metadata
    isLoading: boolean
    isError: boolean
}

export const DocumentDownloadCard: React.FC<IDocumentDownloadCardProps> = ({ data, isLoading, isError }) => {
    const { t } = useTranslation()

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <div className={classNames([styles.itemBox], { [styles.errorItemBox]: status === 'INVALIDATED' })}>
                <RelationAttribute name={t('documentsTab.card.fileName')} value={data?.filename} />
                <RelationAttribute name={t('documentsTab.card.type')} value={data?.mimeType} />
                <RelationAttribute name={t('documentsTab.card.version')} value={data?.version} />
                <RelationAttribute name={t('documentsTab.card.size')} value={`${convertBytesToMegaBytes(data?.contentLength)}MB`} />

                <div>
                    <a className={styles.buttonCenter} href={`${DMS_DOWNLOAD_FILE}${data?.uuid}`}>
                        <Button variant="secondary" label={t('download')} />
                    </a>
                </div>
            </div>
        </QueryFeedback>
    )
}
