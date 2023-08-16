import { IFilter } from '@isdd/idsk-ui-kit/src/types'
import { SetURLSearchParams } from 'react-router-dom'

export const updateUrlParamsOnChange = (changedFilter: IFilter, setUrlParams: SetURLSearchParams) => {
    Object.keys(changedFilter).forEach((key) =>
        setUrlParams((prevParams) => {
            const currentParam = changedFilter[key]
            const newParams = new URLSearchParams(prevParams)
            if (currentParam) {
                newParams.set(key, currentParam.toString())
                return newParams
            }
            return newParams
        }),
    )
}