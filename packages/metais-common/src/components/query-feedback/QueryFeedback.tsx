import React, { PropsWithChildren } from 'react'
import { ErrorBlockProps } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ILoadingIndicatorProps, LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styles from './queryFeedback.module.scss'
interface IQueryFeedbackProps extends PropsWithChildren {
    loading: boolean
    error?: boolean
    indicatorProps?: ILoadingIndicatorProps
    errorProps?: ErrorBlockProps
}

export const QueryFeedback: React.FC<IQueryFeedbackProps> = ({ loading, error, children, indicatorProps, errorProps }) => {
    const { t } = useTranslation()

    const errorEmail = 'metais@LogoMirri.gov.sk'

    if (error) {
        return (
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
        )
    } else if (loading) {
        return (
            <div className={styles.loadingIndicator}>
                <LoadingIndicator {...indicatorProps} />
            </div>
        )
    } else {
        return <>{children}</>
    }
}
