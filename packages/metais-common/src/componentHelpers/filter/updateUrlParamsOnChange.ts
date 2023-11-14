import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/src/types'
import { SetURLSearchParams } from 'react-router-dom'

export const updateUrlParamsOnChange = (changedFilter: IFilter, setUrlParams: SetURLSearchParams) => {
    Object.entries(changedFilter).forEach(([key, currentParam]) =>
        setUrlParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams)
            if (currentParam) {
                // set sort fields to url search params as orderby='...'&sortDirection='...'
                if (key === 'sort') {
                    if (currentParam.length > 0)
                        currentParam?.forEach((item: ColumnSort) => Object.entries(item)?.forEach(([field, value]) => newParams.set(field, value)))
                    else {
                        newParams.set('orderBy', '')
                        newParams.set('sortDirection', '')
                    }
                } else {
                    newParams.set(key, currentParam.toString())
                }
                return newParams
            }
            return newParams
        }),
    )
}
