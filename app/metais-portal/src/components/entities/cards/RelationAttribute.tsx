import React, { PropsWithChildren } from 'react'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

interface IAttributeProps extends PropsWithChildren {
    name: string
    value: React.ReactNode
}

export const RelationAttribute: React.FC<IAttributeProps> = ({ name, value }) => {
    return <DefinitionListItem label={name} value={value} />
}
