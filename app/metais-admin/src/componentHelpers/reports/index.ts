import { Category, Parameter, ParameterType, ReportDefinition, ReportDefinitionLanguage, ScriptExecute } from '@isdd/metais-common/api'
import { array, mixed, object, ObjectSchema, string } from 'yup'
import { TFunction } from 'i18next'

import { IReportFormData } from '@/components/views/egov/reports/ReportsDetail'

export const mapFormDataToScriptExecute = (formData: IReportFormData): ScriptExecute => {
    return {
        body: formData.report.script,
        parameters: Object.fromEntries(
            Object.entries(formData.report?.cards ?? []).map(([, value]) => {
                return [value.identificator, value.defaultValue]
            }),
        ),
    }
}

export const mapFormDataToReportDefinition = (formData: IReportFormData, data?: ReportDefinition, categories?: Category[]): ReportDefinition => {
    const category = categories?.find((cat) => formData.report?.category === cat.id?.toString())

    const parametersEdited = formData.report?.cards?.map((value): Parameter => {
        return {
            defaultValue: value.defaultValue,
            key: value.identificator,
            metaData: value.additionalParams,
            name: value.name,
            required: value.required,
            type: value.parameterType,
            id: value.id,
        }
    })

    return {
        ...data,

        name: formData.report.name,
        lookupKey: formData.report.identificator,
        language: formData.report.language,
        category: category,
        description: formData.report.description,
        scripts: {
            type: 'TABLE',
            id: data?.scripts?.id,
            body: formData.report.script,
        },
        parameters: parametersEdited,
    }
}

export const reportCreateSchema = (t: TFunction<'translation', undefined, 'translation'>): ObjectSchema<IReportFormData> =>
    object().shape({
        report: object().shape({
            name: string().required(t('validation.required')),
            identificator: string().required(t('validation.required')),
            language: mixed<ReportDefinitionLanguage>().oneOf(Object.values(ReportDefinitionLanguage)).required(t('validation.required')),

            cards: array(
                object()
                    .shape({
                        name: string().required(t('validation.required')),
                        identificator: string().required(t('validation.required')),
                        parameterType: mixed<ParameterType>().oneOf(Object.values(ParameterType)).required(t('validation.required')),
                    })
                    .required(),
            ),
        }),
    })
