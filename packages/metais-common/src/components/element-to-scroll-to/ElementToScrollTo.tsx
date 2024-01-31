import React, { useEffect } from 'react'

import { useScroll } from '@isdd/metais-common/hooks/useScroll'

type Props = {
    isVisible: boolean
}

export const ElementToScrollTo: React.FC<Props & React.PropsWithChildren> = ({ children, isVisible }) => {
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (isVisible) {
            scrollToMutationFeedback()
        }
    }, [scrollToMutationFeedback, isVisible])

    return <>{isVisible && <div ref={wrapperRef}>{children}</div>}</>
}
