import React from 'react'
import { Filter, TextHeading } from '@isdd/idsk-ui-kit'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

interface FilterData extends IFilterParams {
    name: string
    isSystemRole?: false
}

const defaultFilterValues: FilterData = {
    name: '',
    isSystemRole: false,
}

const ManageRoles: React.FC = () => {
    return (
        <>
            <TextHeading size="L">Zoznam roli</TextHeading>
            <Filter<FilterData> form={(register) => <></>} defaultFilterValues={defaultFilterValues} />
        </>
    )
}

export default ManageRoles
