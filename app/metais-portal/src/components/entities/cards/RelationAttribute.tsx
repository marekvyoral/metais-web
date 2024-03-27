import React, { PropsWithChildren } from 'react'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

interface IAttributeProps extends PropsWithChildren {
    name: string
    value: React.ReactNode
    className?: string
}

export const RelationAttribute: React.FC<IAttributeProps> = ({ name, value, className }) => {
    return <DefinitionListItem label={name} value={value} className={className} />
}
