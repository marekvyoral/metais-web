import { useRef, useState } from 'react'

import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

export interface IScrollParams {
    behavior?: 'auto' | 'smooth'
    block?: 'center' | 'end' | 'nearest' | 'start'
    inline?: 'center' | 'end' | 'nearest' | 'start'
}

export const useScroll = (scrollOptions?: IScrollParams) => {
    const wrapperRef = useRef<HTMLTableSectionElement>(null)
    const [scrolled, setScrolled] = useState(false)
    const {
        setScrolled: setScrolledActionSuccess,
        isActionSuccess: { scrolled: scrolledActionSuccess },
    } = useActionSuccess()

    const scrollToMutationFeedback = (setScrolledParam?: boolean) => {
        if (scrolledActionSuccess) {
            return
        }
        if ((!scrolled && setScrolledParam) || setScrolledParam == null) {
            wrapperRef.current?.scrollIntoView({
                behavior: scrollOptions?.behavior ?? 'smooth',
                block: scrollOptions?.block ?? 'center',
                inline: scrollOptions?.inline ?? 'nearest',
            })
            setScrolledActionSuccess()
        }
        if (setScrolledParam) {
            setScrolled(true)
        }
    }

    return { wrapperRef, scrollToMutationFeedback }
}
