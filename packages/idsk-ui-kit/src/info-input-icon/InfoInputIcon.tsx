import React from 'react'
import { Tooltip } from 'react-tooltip'

import { InfoIcon } from '../assets/images'
import { TextBody } from '../typography/TextBody'

import styles from './InfoInputIcon.module.scss'

interface IInfoInputIcon {
    description?: string
    id: string
}

export const InfoInputIcon: React.FC<IInfoInputIcon> = ({ description, id }) => {
    return (
        <>
            <Tooltip anchorSelect={`.anchor-element-${id}`} place="top">
                <TextBody size="S" className={styles.tooltipBody}>
                    {description}
                </TextBody>
            </Tooltip>
            <img src={InfoIcon} className={`anchor-element-${id}`} />
        </>
    )
}
