import { IFilter } from '@isdd/idsk-ui-kit/src/types'
import { SetURLSearchParams } from 'react-router-dom'

export const updateUrlParamsOnChange = (changedFilter: IFilter, setUrlParams: SetURLSearchParams) => {
    Object.keys(changedFilter).forEach((key) =>
        setUrlParams((prevParams) => {
            const currentParam = changedFilter[key]
            console.log('suka', changedFilter)
            const newParams = new URLSearchParams(prevParams)
            if (currentParam) {
                if (key === 'sort') {
                    newParams.set(key, currentParam.sort[0].toString())
                } else {
                    newParams.set(key, currentParam.toString())
                }
                console.log('suka', newParams)
                return newParams
            }
            return newParams
        }),
    )
}
