import React from 'react'
import { Link } from 'react-router-dom'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { CiTypePreview } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'

import styles from './connectionView.module.scss'

interface ConnectionItem {
    source?: CiTypePreview
    target?: CiTypePreview
}

const ConnectionItem = ({ source, target }: ConnectionItem) => {
    const { t } = useTranslation()
    return (
        <div className={styles.connectionBox}>
            <InformationGridRow
                key={`source.${source?.id}`}
                label={t('egov.detail.source')}
                value={
                    source && (
                        <Link to={'/egov/entity/' + source?.technicalName} target="_blank">
                            {source?.name}
                        </Link>
                    )
                }
            />
            <InformationGridRow
                key={`target.${target?.id}`}
                label={t('egov.detail.target')}
                value={
                    target && (
                        <Link to={'/egov/entity/' + target?.technicalName} target="_blank">
                            {target?.name}
                        </Link>
                    )
                }
            />
        </div>
    )
}

export default ConnectionItem
