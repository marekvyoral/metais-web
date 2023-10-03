import { TextBody } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import classNames from 'classnames'

import styles from './globalSearchCard.module.scss'

type Props = {
    value: string | string[]
    label: string
    notBoldLabel?: boolean
    setHtml?: boolean
}

export const GlobalCardDefinitionItem: React.FC<Props> = ({ value, label, notBoldLabel = false, setHtml = false }) => {
    return (
        <div className={styles.row}>
            <dt>
                <TextBody className={classNames(styles.noMargin, { [styles.bold]: !notBoldLabel })}>
                    {setHtml ? <div dangerouslySetInnerHTML={{ __html: label + ':' }} /> : label}
                </TextBody>
            </dt>
            {Array.isArray(value) ? (
                <dd>
                    {value.map((v, index) => (
                        <TextBody key={index} className={styles.noMargin}>
                            {setHtml ? <div dangerouslySetInnerHTML={{ __html: v }} /> : v}
                        </TextBody>
                    ))}
                </dd>
            ) : (
                <dd>
                    <TextBody className={styles.noMargin}>{setHtml ? <div dangerouslySetInnerHTML={{ __html: value }} /> : value}</TextBody>
                </dd>
            )}
        </div>
    )
}
