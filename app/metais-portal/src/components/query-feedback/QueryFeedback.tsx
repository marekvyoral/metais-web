import React, { PropsWithChildren } from 'react'

import { ILoadingIndicatorProps, LoadingIndicator } from '../loading-indicator/LoadingIndicator'
import { ErrorBlock, ErrorBlockProps } from '../error-block/ErrorBlock'

interface IQueryFeedbackProps extends PropsWithChildren {
    loading: boolean
    error?: boolean
    indicatorProps?: ILoadingIndicatorProps
    errorProps?: ErrorBlockProps
}

export const QueryFeedback: React.FC<IQueryFeedbackProps> = ({ loading, error, children, indicatorProps, errorProps }) => {
    if (error) {
        return <ErrorBlock {...errorProps} />
    } else if (loading) {
        return <LoadingIndicator {...indicatorProps} />
    } else {
        return <>{children}</>
    }
}
