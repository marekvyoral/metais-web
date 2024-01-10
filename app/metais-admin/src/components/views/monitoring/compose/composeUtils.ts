import { IOption } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { TFunction } from 'i18next'
import { FieldValues } from 'react-hook-form'
import * as Yup from 'yup'

export interface IMonitoringComposeForm {
    id?: number
    isvsUuid?: string
    entityType?: string
    isvsName?: string
    httpUrl?: string
    httpMethod?: string
    httpRequestHeader?: string[][]
    httpRequestBody?: string
    httpResponseStatus?: string
    httpResponseBodyRegex?: string
    periodicity?: string
    enabled?: boolean
}

export const getPageTitle = (newVote: boolean, t: TFunction) => {
    if (newVote) {
        return t('monitoring.compose.title.newRecord')
    }
    return `${t('monitoring.compose.title.editRecord')}`
}

export const schema = (t: TFunction<'translation', undefined, 'translation'>): Yup.ObjectSchema<IMonitoringComposeForm> => {
    return Yup.object()
        .shape({
            id: Yup.number(),
            isvsUuid: Yup.string().required(t('validation.required')),
            entityType: Yup.string().required(t('validation.required')),
            isvsName: Yup.string(),
            httpUrl: Yup.string().required(t('validation.required')),
            httpMethod: Yup.string().required(t('validation.required')),
            httpRequestHeader: Yup.array(),
            httpRequestBody: Yup.string(),
            httpResponseStatus: Yup.string(),
            httpResponseBodyRegex: Yup.string(),
            periodicity: Yup.string().required(t('validation.required')),
            enabled: Yup.boolean(),
        })
        .defined()
}

export enum PeriodicityEnum {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    SEMIANNUALLY = 'semiannually',
    ANNUALLY = 'annually',
}

export const getHttpRequestHeader = (httpRequestHeader?: string[][]) => {
    const result: string[][] = []
    httpRequestHeader?.forEach((headerData) => {
        if (!!headerData?.[0] && !!headerData?.[1]) {
            result.push(headerData)
        }
    })
    return result
}

export const mapFormDataToApi = (formData: FieldValues): ApiActiveMonitoringCfg => {
    return {
        id: formData.id,
        isvsUuid: formData.isvsUuid,
        entityType: formData.entityType,
        isvsName: formData.isvsName,
        httpUrl: formData.httpUrl,
        httpMethod: formData.httpMethod,
        httpRequestHeader: getHttpRequestHeader(formData.httpRequestHeader),
        httpRequestBody: formData.httpRequestBody,
        httpResponseStatus: formData.httpResponseStatus,
        httpResponseBodyRegex: formData.httpResponseBodyRegex,
        createdAt: formData.createdAt,
        lastExecutionTime: formData.lastExecutionTime,
        periodicity: formData.periodicity,
        enabled: formData.enabled,
    }
}

export const mapApiMonitoringCfgToFormData = (apiMonitoringCfgData?: ApiActiveMonitoringCfg): IMonitoringComposeForm => {
    const returnFormData: IMonitoringComposeForm = {
        ...(!!apiMonitoringCfgData?.id && { id: apiMonitoringCfgData.id }),
        ...(!!apiMonitoringCfgData?.isvsUuid && { isvsUuid: apiMonitoringCfgData.isvsUuid }),
        ...(!!apiMonitoringCfgData?.isvsName && { isvsName: apiMonitoringCfgData.isvsName }),
        ...(!!apiMonitoringCfgData?.entityType && { entityType: apiMonitoringCfgData.entityType }),
        ...(!!apiMonitoringCfgData?.httpUrl && { httpUrl: apiMonitoringCfgData.httpUrl }),
        ...(!!apiMonitoringCfgData?.httpMethod && { httpMethod: apiMonitoringCfgData.httpMethod }),
        ...(!!apiMonitoringCfgData?.httpRequestHeader && { httpRequestHeader: getHttpRequestHeader(apiMonitoringCfgData.httpRequestHeader) }),
        ...(!!apiMonitoringCfgData?.httpRequestBody && { httpRequestBody: apiMonitoringCfgData.httpRequestBody }),
        ...(!!apiMonitoringCfgData?.httpResponseStatus && { httpResponseStatus: apiMonitoringCfgData.httpResponseStatus }),
        ...(!!apiMonitoringCfgData?.httpResponseBodyRegex && { httpResponseBodyRegex: apiMonitoringCfgData.httpResponseBodyRegex }),
        ...(!!apiMonitoringCfgData?.periodicity && { periodicity: apiMonitoringCfgData.periodicity }),
        ...(!!apiMonitoringCfgData?.enabled && { enabled: apiMonitoringCfgData.enabled }),
    }
    return returnFormData ?? {}
}

export const getCiName = (item: ConfigurationItemUi) => {
    return (item?.attributes && `${item?.attributes[ATTRIBUTE_NAME.Gen_Profil_nazov]}`) ?? ''
}

export const getPeriodicityOptions = (t: TFunction<'translation', undefined, 'translation'>): IOption<string | undefined>[] => [
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.DAILY}`), value: '0 0 12 * * ? *' },
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.WEEKLY}`), value: '0 0 12 ? * MON *' },
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.MONTHLY}`), value: '0 0 12 1 * ? *' },
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.QUARTERLY}`), value: '0 0 12 1 1,4,7,10 ? *' },
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.SEMIANNUALLY}`), value: '0 0 12 1 1/6 ? *' },
    { label: t(`monitoring.compose.periodicityEnum.${PeriodicityEnum.ANNUALLY}`), value: '0 0 12 1 6 ? *' },
]
