import { IOption } from '@isdd/idsk-ui-kit/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Parameter, ParameterType } from '@isdd/metais-common/api/generated/report-swagger'
import { TFunction } from 'i18next'
import { addMethod, boolean, object, string } from 'yup'

export const getDefaultValueForKey = (key?: string, parameters?: Parameter[]) => {
    return parameters?.find((parameter) => parameter.key === key)?.defaultValue
}

export const loadEnumsRepoOptions = (filterData: (EnumType | undefined)[], code?: string): IOption<string>[] => {
    const enumtItems = filterData.find((fD) => fD?.code === code)?.enumItems
    const selectOptions = enumtItems?.map((eI) => {
        return { value: eI.code ?? '', label: eI.description ?? '' }
    })
    return [...(selectOptions ?? [])]
}

export const loadEnumerateOptions = (enumsString?: string): IOption<string>[] => {
    const selectOptions = enumsString
        ?.split(';')
        .filter(Boolean)
        .map((enumOption) => {
            return { value: enumOption, label: enumOption }
        })

    return [...(selectOptions ?? [])]
}

export const getReportsFilterParameterYupSchema = (
    t: TFunction<'translation', undefined, 'translation'>,
    parameterKeys?: (string | undefined)[],
    parameters?: Parameter[],
) => {
    addMethod(object, 'atLeastOneOf', function (list) {
        return this.test({
            name: 'atLeastOneOf',
            message: '${path} must have at least one of these keys: ${keys}',
            exclusive: true,
            params: { keys: list.join(', ') },
            test: (value) => value == null || list.some((f: string) => !!value[f]),
        })
    })

    if (parameterKeys) {
        const schema = Object.fromEntries(
            parameterKeys?.map((key) => {
                const type = parameters?.find((parameter) => parameter.key === key)?.type
                if (type === ParameterType.BOOLEAN) return [key, boolean().oneOf([true], t('validation.mustBeChecked'))]

                return [key, string().required(t('validation.required'))]
            }) ?? [],
        )
        return (
            object()
                ?.shape(schema)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ?.atLeastOneOf([...(parameterKeys ?? [])])
        )
    }
}
