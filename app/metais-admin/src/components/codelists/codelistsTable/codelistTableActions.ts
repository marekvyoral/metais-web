import { EnumTypePreview } from '@isdd/metais-common/api'
import { TFunction } from 'i18next'
import { object, string, ValidationError } from 'yup'

import { IErrorsState } from './CodelistsTable'

export const validateRowData = async (rowData: EnumTypePreview, rowId: number, t: TFunction<'translation', undefined, 'translation'>) => {
    const rowDataSchema = object().shape({
        code: string().required(t('codelists.codeError')),
        name: string().required(t('codelists.nameError')),
        description: string().required(t('codelists.descriptionError')),
    })
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
