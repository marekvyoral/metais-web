import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ValidationError, object, string } from 'yup'
import { TFunction } from 'i18next'

import { IErrorsDetailState } from './CodeListDetailTable'

export const validateRowDetailData = async (rowData: EnumItem, rowId: number, t: TFunction<'translation', undefined, 'translation'>) => {
    const rowDataSchema = object().shape({
        code: string().required(t('codelists.codeError')),
        description: string().required(t('codelists.descriptionError')),
        engDescription: string().required(t('codelists.engDescriptionError')),
        value: string().required(t('codelists.valueError')),
        engValue: string().required(t('codelists.engValueError')),
    })
    try {
        await rowDataSchema.validate(rowData, { abortEarly: false })
        return null
    } catch (validationErrors) {
        if (validationErrors != null) {
            const errorsTyped = validationErrors as ValidationError
            const errorsObject: IErrorsDetailState = { id: rowId }
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
                    case 'engDescription': {
                        errorsObject.engDescription = error.message
                        break
                    }
                    case 'value': {
                        errorsObject.value = error.message
                        break
                    }
                    case 'engValue': {
                        errorsObject.engValue = error.message
                        break
                    }
                }
            })
            return errorsObject
        }
    }
}
