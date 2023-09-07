import { useState } from 'react'

import { EkoListContainer } from '@/components/containers/Eko/EkoListContainer'
import { EkoTable } from '@/components/views/eko/eko-list-views/EkoTable'
import { TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'
import { enrichEkoDataMaper } from '@/components/views/eko/ekoHelpers'

const Eko = () => {
    const [rowSelection, setRowSelection] = useState<Record<string, TEkoCodeDecorated>>({})

    return (
        <EkoListContainer
            View={(props) => {
                return (
                    <EkoTable
                        data={enrichEkoDataMaper(props?.data?.ekoCodes || [])}
                        entityName={'eko'}
                        rowSelectionState={{ rowSelection, setRowSelection }}
                        deleteCodes={props.deleteCodes}
                        invalidateCodes={props.invalidateCodes}
                        defaultFilterParams={props.defaultFilterParams}
                        handleFilterChange={props.handleFilterChange}
                    />
                )
            }}
        />
    )
}

export default Eko
