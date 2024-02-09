import React, { PropsWithChildren } from 'react'

import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

interface IInformationGridRowProps extends PropsWithChildren {
    label: React.ReactNode
    value: React.ReactNode
    tooltip?: string
    hideIcon?: boolean
    lang?: string | undefined
    href?: string
    valueWarning?: boolean
    secColValue?: string | React.ReactNode | undefined
}

export const InformationGridRow: React.FC<IInformationGridRowProps> = ({
    label,
    value,
    tooltip,
    hideIcon,
    lang,
    href,
    valueWarning,
    secColValue,
}) => {
    return (
        <DefinitionListItem
            label={label}
            value={value}
            lang={lang}
            href={href}
            valueWarning={valueWarning}
            secColValue={secColValue}
            tooltip={tooltip}
            hideIcon={hideIcon}
        />
    )
}
