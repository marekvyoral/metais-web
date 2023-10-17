import React from 'react'
import { CiTypePreview } from '@isdd/metais-common/api/generated/types-repo-swagger'

import styles from './connectionView.module.scss'
import ConnectionItem from './ConnectionItem'

interface ConnectionViewProps {
    sources: CiTypePreview[] | undefined
    targets: CiTypePreview[] | undefined
}

const ConnectionView = ({ sources, targets }: ConnectionViewProps) => {
    return (
        <div className={styles.connectionBox}>
            <div className={styles.fullWidth}>
                {sources?.map((previewType) => {
                    return <ConnectionItem item={previewType} type="source" key={previewType?.id} />
                })}
            </div>
            <div className={styles.fullWidth}>
                {targets?.map((previewType) => {
                    return <ConnectionItem item={previewType} type="target" key={previewType?.id} />
                })}
            </div>
        </div>
    )
}

export default ConnectionView
