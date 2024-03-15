import React, { useEffect } from 'react'

import { useScroll } from '@isdd/metais-common/hooks/useScroll'

type Props = {
    trigger: boolean
}

export const ElementToScrollTo: React.FC<Props & React.PropsWithChildren> = ({ children, trigger }) => {
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (trigger) {
            scrollToMutationFeedback()
        }
    }, [scrollToMutationFeedback, trigger])

    return <>{<div ref={wrapperRef}>{children}</div>}</>
}
