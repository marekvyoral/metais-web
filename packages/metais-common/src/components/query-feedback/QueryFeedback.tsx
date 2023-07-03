import React, { PropsWithChildren } from 'react'
import { ErrorBlock, ErrorBlockProps } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ILoadingIndicatorProps, LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'

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
