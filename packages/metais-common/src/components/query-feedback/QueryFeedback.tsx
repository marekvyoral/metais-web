import React, { PropsWithChildren } from 'react'
import { ErrorBlockProps } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ILoadingIndicatorProps, LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import styles from './queryFeedback.module.scss'
interface IQueryFeedbackProps extends PropsWithChildren {
    loading: boolean
    error?: boolean
    indicatorProps?: ILoadingIndicatorProps
    errorProps?: ErrorBlockProps
    withChildren?: boolean
}

export const QueryFeedback: React.FC<IQueryFeedbackProps> = ({ loading, error, children, indicatorProps, errorProps, withChildren }) => {
    const { t } = useTranslation()

    const errorEmail = 'metais@LogoMirri.gov.sk'

    if (error) {
        return (
            <>
                <TextWarning>
                    {errorProps?.errorMessage ? (
                        errorProps.errorMessage
                    ) : (
                        <>
                            {t('feedback.queryErrorMessage')}
                            <Link to={`mailto:${errorEmail}`}>{errorEmail}</Link>
                        </>
                    )}
                </TextWarning>
                {withChildren && children}
            </>
        )
    } else {
        return (
            <div className={classNames(styles.loadingIndicator, withChildren && styles.autoHeight)}>
                {loading && <LoadingIndicator {...indicatorProps} />}
                {(withChildren || !loading) && children}
            </div>
        )
    }
}
