import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ErrorBlockProps } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ILoadingIndicatorProps, LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
import { TransparentButtonWrapper } from '@isdd/idsk-ui-kit'

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
    showSupportEmail?: boolean
}

export const QueryFeedback: React.FC<IQueryFeedbackProps> = ({
    loading,
    error,
    showSupportEmail,
    children,
    indicatorProps,
    errorProps,
    withChildren,
}) => {
    const { t } = useTranslation()
    const labelId = `${uuidV4()}-label`
    const { clearAction } = useActionSuccess()
    const [show, setShow] = useState(true)
    const closeMessage = () => {
        clearAction()
        setShow(false)
    }
    const errorMessage = errorProps?.errorMessage ? (
        errorProps.errorMessage
    ) : (
        <div className={styles.column}>
            {t('feedback.queryErrorMessage')}
            <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>
        </div>
    )

    useEffect(() => {
        setShow(true)
    }, [error])

    return (
        <div className={classNames(styles.loadingIndicator, withChildren && styles.autoHeight)}>
            {error && show && (
                <TextWarning>
                    <div className={styles.inline} aria-live="assertive">
                        <div className={styles.column}>
                            {errorMessage}
                            {showSupportEmail && <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>}
                        </div>
                        <Spacer horizontal />
                        <div onClick={closeMessage} className={classNames(styles.closeIconWrapper, 'govuk-body')}>
                            <TransparentButtonWrapper onClick={closeMessage} aria-labelledby={labelId}>
                                <span id={labelId} className="govuk-visually-hidden">
                                    {errorMessage}
                                </span>
                                <img src={CloseIcon} className={styles.closeIcon} alt={t('closeFeedback')} lang="sk" />
                            </TransparentButtonWrapper>
                        </div>
                    </div>
                </TextWarning>
            )}
            {loading && <LoadingIndicator {...indicatorProps} />}
            {(withChildren || !loading || error) && children}
        </div>
    )
}
