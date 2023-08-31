import React, { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { MultiValue } from 'react-select'

import { ConfigurationItemUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api'

interface ColumnsOutputDefinition {
    attributes?: ConfigurationItemUiAttributes
    metaAttributes?: {
        [key: string]: string
    }
    type?: string
    uuid?: string
    checked?: boolean
}

export interface INewRelationData {
    selectedItems: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | ColumnsOutputDefinition | null
    setSelectedItems: Dispatch<SetStateAction<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | ColumnsOutputDefinition | null>>
    isListPageOpen: boolean
    setIsListPageOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NewRelationContext = createContext<INewRelationData>({
    selectedItems: {},
    setSelectedItems: () => undefined,
    isListPageOpen: false,
    setIsListPageOpen: () => undefined,
})

export const useNewRelationData = () => useContext(NewRelationContext)

export const NewRelationDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedItems, setSelectedItems] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null | ColumnsOutputDefinition>([])
    const [isListPageOpen, setIsListPageOpen] = useState(false)

    return (
        <NewRelationContext.Provider value={{ selectedItems, setSelectedItems, isListPageOpen, setIsListPageOpen }}>
            {children}
        </NewRelationContext.Provider>
    )
}
