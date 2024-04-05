import React, { useEffect } from 'react'

import { IScrollParams, useScroll } from '@isdd/metais-common/hooks/useScroll'

type Props = {
    trigger: boolean
    manualScroll?: boolean
    scrollOptions?: IScrollParams
}

export const ElementToScrollTo: React.FC<Props & React.PropsWithChildren> = ({ children, trigger, manualScroll = false, scrollOptions }) => {
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (trigger) {
            if (manualScroll) {
                wrapperRef.current?.scrollIntoView({
                    behavior: scrollOptions?.behavior ?? 'smooth',
                    block: scrollOptions?.block ?? 'center',
                    inline: scrollOptions?.inline ?? 'nearest',
                })
            } else {
                scrollToMutationFeedback()
            }
        }
    }, [manualScroll, scrollOptions?.behavior, scrollOptions?.block, scrollOptions?.inline, scrollToMutationFeedback, trigger, wrapperRef])

    return <>{<div ref={wrapperRef}>{children}</div>}</>
}
