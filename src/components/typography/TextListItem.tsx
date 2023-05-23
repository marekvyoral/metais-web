import React, { forwardRef, PropsWithChildren } from 'react'

export const TextListItem = forwardRef<HTMLBodyElement, PropsWithChildren>(({ children }) => {
    return <li>{children}</li>
})
