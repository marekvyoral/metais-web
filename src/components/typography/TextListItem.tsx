import React, { forwardRef, PropsWithChildren } from 'react'

export const TextListItem = forwardRef<HTMLLIElement, PropsWithChildren>(({ children }) => {
    return <li>{children}</li>
})
