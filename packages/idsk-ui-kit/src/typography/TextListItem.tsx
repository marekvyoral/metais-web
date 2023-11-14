import React, { forwardRef, PropsWithChildren } from 'react'

export const TextListItem = forwardRef<HTMLLIElement, PropsWithChildren>(({ children }, ref) => {
    return <li ref={ref}>{children}</li>
})
