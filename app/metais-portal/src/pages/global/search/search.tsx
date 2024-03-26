import React from 'react'

import { GlobalSearchContainer } from '@/components/containers/GlobalSearchContainer'
import { GlobalSearchView } from '@/components/views/global-search/GlobalSearchView'

const GlobalSearchPage = () => {
    return (
        <GlobalSearchContainer
            View={({ data, isError, isLoading, ownerItems, pagination }) => (
                <GlobalSearchView data={data} isError={isError} isLoading={isLoading} ownerItems={ownerItems} pagination={pagination} />
            )}
        />
    )
}

export default GlobalSearchPage
