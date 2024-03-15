import { yupResolver } from '@hookform/resolvers/yup'
import { AccordionContainer, Button, ErrorBlock, Input, LoadingIndicator, SimpleSelect, TextArea, TextBody } from '@isdd/idsk-ui-kit/index'
import {
    CategoryHeaderList,
    Parameter,
    ReportDefinition,
    ReportDefinitionLanguage,
    ReportResultObject,
    ScriptExecute,
} from '@isdd/metais-common/api/generated/report-swagger'
import { mapCategoriesToOptions } from '@isdd/metais-common/componentHelpers'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MutationFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'

import styles from './reportsDetail.module.scss'
import { IReportCardFormData, ReportsParameterCard } from './ReportsParameterCard'
import { ReportTable } from './ReportTable'

import { mapFormDataToReportDefinition, mapFormDataToScriptExecute, reportCreateSchema } from '@/componentHelpers/reports'

interface IReportsDetail {
    data?: ReportDefinition
    categories?: CategoryHeaderList
    saveReport: (data: ReportDefinition) => Promise<ReportDefinition>
    runReport: (data: ScriptExecute) => Promise<ReportResultObject>
    saveIsLoading: boolean
    isSaveError?: boolean
    mutationIsLoading: boolean
    isMutationError?: boolean
    runMutationIsSuccess: boolean
}

export interface IReportFormData {
    report: {
        language?: ReportDefinitionLanguage
        category?: string
        description?: string
        identificator?: string
        name?: string
        script?: string
        results?: string
        cards?: IReportCardFormData[]
    }
}

const getDefaultValues = (data?: ReportDefinition, parameters?: Parameter[]): IReportFormData => {
    const parameterCardsDefaultValues =
        parameters?.map((parameter) => {
            return {
                id: parameter.id,
                identificator: parameter.key,
                parameterType: parameter.type,
                name: parameter.name,
                defaultValue: parameter.defaultValue,
                required: parameter.required,
                additionalParams: parameter.metaData,
            }
        }) ?? []

    return {
        report: {
            language: data?.language,
            category: data?.category?.id?.toString(),
            description: data?.description,
            identificator: data?.lookupKey,
            name: data?.name,
            script: data?.scripts?.body,
            cards: parameterCardsDefaultValues,
        },
    }
}

export const ReportsDetail: React.FC<IReportsDetail> = ({
    data,
    saveReport,
    runReport,
    saveIsLoading,
    mutationIsLoading,
    isMutationError,
    isSaveError,
    runMutationIsSuccess,
    categories,
}) => {
    const { t } = useTranslation()
    const [reportResult, setReportResult] = useState<ReportResultObject>()

    const { register, handleSubmit, setValue, getValues, clearErrors, formState, watch } = useForm({
        resolver: yupResolver(reportCreateSchema(t)),
        defaultValues: getDefaultValues(data, data?.parameters),
    })
    const parameters = watch('report.cards')
    const isRunScriptDisabled = !watch('report.script')

    const addNewParameter = () => {
        setValue('report.cards', [...(parameters ?? []), {} as Parameter])
    }

    const removeParameter = (removeIndex: number) => {
        const editedParameters = parameters?.filter((parameter, index) => index !== removeIndex)
        setValue('report.cards', editedParameters)
    }

    const onSubmit = useCallback(
        async (formData: IReportFormData) => {
            await saveReport(mapFormDataToReportDefinition(formData, data, categories?.categories))
        },
        [categories?.categories, data, saveReport],
    )

    const runScript = async (formData: IReportFormData) => {
        await runReport(mapFormDataToScriptExecute(formData)).then((result) => {
            setReportResult(result)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

            <div className={styles.submitArea}>
                <Input label={t('report.detail.name')} {...register('report.name')} error={formState.errors?.report?.name?.message} required />
                <Input
                    label={t('report.detail.identificator')}
                    {...register('report.identificator')}
                    error={formState.errors?.report?.identificator?.message}
                    required
                />
                <SimpleSelect
                    id={'report.language'}
                    name={'report.language'}
                    label={t('report.language')}
                    options={[
                        { label: 'sk', value: 'sk' },
                        { label: 'en', value: 'en' },
                    ]}
                    defaultValue={data?.language}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    error={formState.errors?.report?.language?.message}
                    required
                />
                <SimpleSelect
                    id={'report.category'}
                    name={'report.category'}
                    label={t('report.category')}
                    options={mapCategoriesToOptions(categories?.categories)}
                    defaultValue={data?.category?.id?.toString()}
                    setValue={setValue}
                />
                <TextArea label={t('report.description')} rows={3} {...register('report.description')} />
                <TextBody>
                    <span className="govuk-!-font-weight-bold">{t('report.detail.state')}</span>
                </TextBody>
                <TextBody>
                    <span>{data?.publikovany ? t('report.publishedTrue') : t('report.publishedFalse')}</span>
                </TextBody>
                <MutationFeedback
                    success={runMutationIsSuccess}
                    successMessage={t('mutationFeedback.runMutationSuccess')}
                    error={isMutationError}
                    errorMessage={t('mutationFeedback.runMutationError')}
                />
                <div className={styles.submitArea}>
                    {mutationIsLoading && <LoadingIndicator label={t('feedback.executingScript')} />}
                    <TextArea label={t('report.detail.script')} rows={20} {...register('report.script')} />
                    <Button
                        label={t('report.detail.runScript')}
                        onClick={async () => {
                            runScript(getValues())
                        }}
                        className={styles.runScript}
                        disabled={isRunScriptDisabled}
                    />
                </div>
                <TextArea label={t('report.detail.results')} rows={10} {...register('report.results')} value={JSON.stringify(reportResult)} />
                {reportResult?.result && (
                    <AccordionContainer
                        sections={[
                            {
                                title: t('report.detail.resultsTable'),
                                content: <ReportTable data={reportResult?.result} isLoading={false} isError={false} />,
                            },
                        ]}
                    />
                )}
                {parameters?.map((parameter, index) => (
                    <ReportsParameterCard
                        key={index}
                        data={parameter}
                        removeParameter={removeParameter}
                        index={index}
                        register={register}
                        setValue={setValue}
                        formStateErrors={formState.errors}
                        clearErrors={clearErrors}
                    />
                ))}
                <Button label={t('report.detail.addParameter')} onClick={addNewParameter} className={styles.addConnection} />
                <SubmitWithFeedback submitButtonLabel={t('report.detail.save')} loading={saveIsLoading} />
                <MutationFeedback error={isSaveError} />
                {saveIsLoading && <LoadingIndicator label={t('feedback.saving')} />}
            </div>
        </form>
    )
}
