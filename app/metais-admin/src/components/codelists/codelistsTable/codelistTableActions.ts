import { EnumTypePreview } from '@isdd/metais-common/api'
import { object, string, ValidationError } from 'yup'

import { IErrorsState } from './CodelistsTable'

const rowDataSchema = object().shape({
    code: string().required('Code is required'),
    name: string().required('Name is required'),
    description: string().required('Description is required'),
})

export const validateRowData = async (rowData: EnumTypePreview, rowId: number) => {
    try {
        await rowDataSchema.validate(rowData, { abortEarly: false })
        return null
    } catch (validationErrors) {
        if (validationErrors != null) {
            const errorsTyped = validationErrors as ValidationError
            const errorsObject: IErrorsState = { id: rowId }
            errorsTyped.inner.forEach((error) => {
                switch (error.path) {
                    case 'code': {
                        errorsObject.code = error.message
                        break
                    }
                    case 'description': {
                        errorsObject.description = error.message
                        break
                    }
                    case 'name': {
                        errorsObject.name = error.message
                        break
                    }
                }
            })
            return errorsObject
        }
    }
}
