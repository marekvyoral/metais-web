import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './loadingIndicator.module.scss'

import { CircleLoadingArrowIcon } from '@/assets/images'

export interface ILoadingIndicatorProps {
    label?: string
    fullscreen?: boolean
    transparentMask?: boolean
    layer?: 'parent' | 'dialog' | 'always-top'
}

export const LoadingIndicator: React.FC<ILoadingIndicatorProps> = ({ fullscreen = false, transparentMask = false, label, layer = 'always-top' }) => {
    const { t } = useTranslation()
    const getMaskLayerClassName = () => {
        switch (layer) {
            case 'parent':
                return styles.loadingMaskLayerParent
            case 'dialog':
                return styles.loadingMaskLayerDialog
            case 'always-top':
                return styles.loadingMaskLayerAlwaysTop
            default:
                return styles.loadingMaskLayerParent
        }
    }

    const classNamesList = classNames(
        styles.loadingIndicator,
        fullscreen && styles.loadingIndicatorFullscreen,
        transparentMask && styles.transparentBackgroundMask,
        getMaskLayerClassName(),
    )

    return (
        <div className={classNamesList}>
            <div className={styles.frameBorder}>
                <img className={styles.spinner} src={CircleLoadingArrowIcon} />
                <p>{label ?? t('loading.loadingSubPage')}</p>
            </div>
        </div>
    )
}
