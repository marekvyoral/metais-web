import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ErrorBlockProps } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ILoadingIndicatorProps, LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import { Spacer } from '../spacer/Spacer'

import styles from './queryFeedback.module.scss'

import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { CloseIcon } from '@isdd/metais-common/assets/images'
import { metaisEmail } from '@isdd/metais-common/constants'
interface IQueryFeedbackProps extends PropsWithChildren {
    loading: boolean
    error?: boolean
    indicatorProps?: ILoadingIndicatorProps
    errorProps?: ErrorBlockProps
    withChildren?: boolean
}

export const QueryFeedback: React.FC<IQueryFeedbackProps> = ({ loading, error, children, indicatorProps, errorProps, withChildren }) => {
    const { t } = useTranslation()
    const { clearAction } = useActionSuccess()
    const [show, setShow] = useState(true)
    const closeMessage = () => {
        clearAction()
        setShow(false)
    }

    useEffect(() => {
        setShow(true)
    }, [error])

    return (
        <>
            <div className={classNames(styles.loadingIndicator, withChildren && styles.autoHeight)}>
                {error && show && (
                    <TextWarning>
                        <div className={styles.inline}>
                            {errorProps?.errorMessage ? (
                                errorProps.errorMessage
                            ) : (
                                <div className={styles.column}>
                                    {t('feedback.queryErrorMessage')}
                                    <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>
                                </div>
                            )}
                            <Spacer horizontal />
                            <div onClick={closeMessage} className={classNames(styles.closeIconWrapper, 'govuk-body')}>
                                <img src={CloseIcon} />
                            </div>
                        </div>
                    </TextWarning>
                )}
                {loading && <LoadingIndicator {...indicatorProps} />}
                {(withChildren || !loading || error) && children}
            </div>
        </>
    )
}
