import { useState, useEffect } from 'react'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

export const useRowSelectionState = (entityName: string) => {
    const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
    useEffect(() => {
        setRowSelection({})
    }, [entityName])
    return {
        rowSelection,
        setRowSelection,
    }
}
