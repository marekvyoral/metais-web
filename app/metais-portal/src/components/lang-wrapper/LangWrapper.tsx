import React, { PropsWithChildren } from 'react'

interface LangWrapperProps extends PropsWithChildren {
    lang: string | undefined
}

export const LangWrapper = ({ children, lang }: LangWrapperProps): JSX.Element => {
    return <>{lang ? <div lang={lang}>{children}</div> : children}</>
}
