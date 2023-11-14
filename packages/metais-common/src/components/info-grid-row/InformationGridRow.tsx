import React, { PropsWithChildren } from 'react'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'
import { InfoIconWithText } from '@isdd/idsk-ui-kit/typography/InfoIconWithText'

import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

interface IInformationGridRowProps extends PropsWithChildren {
    label: string
    value: React.ReactNode
    tooltip?: string
    hideIcon?: boolean
    lang?: string | undefined
    href?: string
    valueWarning?: boolean
}

export const InformationGridRow: React.FC<IInformationGridRowProps> = ({ label, value, tooltip, hideIcon, lang, href, valueWarning }) => {
    return (
        <DefinitionListItem
            label={
                <TextBody>
                    <InfoIconWithText tooltip={tooltip} hideIcon={hideIcon}>
                        {label}
                    </InfoIconWithText>
                </TextBody>
            }
            value={value}
            lang={lang}
            href={href}
            valueWarning={valueWarning}
        />
    )
}
