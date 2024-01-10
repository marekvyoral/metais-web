import {
    AccordionContainer,
    Button,
    CheckBox,
    ILoadOptionsResponse,
    Input,
    RadioButton,
    RadioGroupWithLabel,
    SelectLazyLoading,
    SimpleSelect,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { ApiActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import React, { useEffect, useState } from 'react'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { MultiValue } from 'react-select'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import styles from '../monitoring.module.scss'

import { HttpRequestHeaders } from './HttpHeadersModal'
import {
    IMonitoringComposeForm,
    getCiName,
    getPageTitle,
    getPeriodicityOptions,
    mapFormDataToApi,
    schema,
    mapApiMonitoringCfgToFormData,
} from './composeUtils'

export interface IMonitoringComposeView {
    monitoringCfgData?: ApiActiveMonitoringCfg
    ciDefaultValue?: ConfigurationItemUi
    isCreateLoading: boolean
    loadOptions: (searchQuery: string, additional: { page: number } | undefined) => Promise<ILoadOptionsResponse<ConfigurationItemUi>>
    createMonitoringRecord: (data: ApiActiveMonitoringCfg) => Promise<void>
    updateMonitoringRecord: (data: ApiActiveMonitoringCfg) => Promise<void>
}

export const MonitoringComposeView: React.FC<IMonitoringComposeView> = ({
    monitoringCfgData,
    isCreateLoading,
    ciDefaultValue,
    loadOptions,
    createMonitoringRecord,
    updateMonitoringRecord,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [seed, setSeed] = useState(1)
    const isNewRecord = !monitoringCfgData

    const { register, unregister, setValue, handleSubmit, formState, watch } = useForm<IMonitoringComposeForm>({
        resolver: yupResolver(schema(t)),
        defaultValues: mapApiMonitoringCfgToFormData(monitoringCfgData),
    })

    const periodicityWatch = watch('periodicity')
    const entityTypeWatch = watch('entityType')

    const handleConfigurationItemChange = (value: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => {
        const ci = Array.isArray(value) ? value[0] : value
        setValue('entityType', ci.type)
        setValue('isvsUuid', ci.uuid)
        setValue('isvsName', getCiName(ci))
    }

    const handleCreateMonitoringRecord = (formData: FieldValues) => {
        const apiData = mapFormDataToApi(formData)
        createMonitoringRecord(apiData)
    }

    const handleUpdateMonitoringRecord = (formData: FieldValues) => {
        const apiData = mapFormDataToApi(formData)
        updateMonitoringRecord(apiData)
    }

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [ciDefaultValue])

    const onSubmit = (formData: FieldValues) => {
        if (isNewRecord) {
            handleCreateMonitoringRecord(formData)
        } else {
            handleUpdateMonitoringRecord(formData)
        }
    }

    const onCancel = () => {
        if (isNewRecord) {
            navigate(`${AdminRouteNames.MONITORING_LIST}`, { state: { from: location } })
        } else {
            navigate(`${AdminRouteNames.MONITORING_DETAIL}/${monitoringCfgData?.id ?? ''}`, { state: { from: location } })
        }
    }

    return (
        <>
            <TextHeading size="XL">{getPageTitle(isNewRecord, t)}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)} className={classNames('govuk-!-font-size-19')}>
                <SelectLazyLoading<ConfigurationItemUi>
                    key={seed}
                    getOptionLabel={(item) => `(${item?.type ?? ''}) ${getCiName(item)}` ?? ''}
                    getOptionValue={(item) => item.uuid ?? ''}
                    loadOptions={(searchQuery, __, additional) => loadOptions(searchQuery, additional)}
                    label={`${entityTypeWatch ?? t('monitoring.list.filter.ciLabel')}`}
                    name="isvsUuid"
                    defaultValue={ciDefaultValue}
                    onChange={handleConfigurationItemChange}
                    required
                />

                <Input
                    {...register('httpUrl')}
                    type="text"
                    label={t('monitoring.compose.httpUrl')}
                    className={styles.stretchGrow}
                    error={formState.errors['httpUrl']?.message}
                    required
                />

                <SimpleSelect
                    label={`${t('monitoring.compose.periodicity')}`}
                    options={getPeriodicityOptions(t)}
                    setValue={setValue}
                    value={periodicityWatch}
                    name="periodicity"
                    id="periodicity"
                    className={classNames(styles.stretch)}
                    error={formState.errors['periodicity']?.message}
                    isClearable={false}
                    required
                />
                <Spacer vertical />

                <CheckBox label={t('monitoring.compose.enabled')} id="enabled" {...register('enabled')} />
                <Spacer vertical />
                <AccordionContainer
                    sections={[
                        {
                            title: t('monitoring.compose.httpPart'),
                            summary: null,
                            content: (
                                <>
                                    <RadioGroupWithLabel label={t('monitoring.compose.httpMethod')} className="govuk-radios--small" inline>
                                        <RadioButton
                                            id={'httpMethod.get'}
                                            value={'GET'}
                                            label={t('monitoring.compose.radioButton.get')}
                                            {...register('httpMethod')}
                                            defaultChecked
                                        />
                                        <RadioButton
                                            id={'monitoring.compose.httpMethod.post'}
                                            value={'POST'}
                                            label={t('monitoring.compose.radioButton.post')}
                                            {...register('httpMethod')}
                                        />
                                    </RadioGroupWithLabel>

                                    <HttpRequestHeaders
                                        register={register}
                                        unregister={unregister}
                                        errors={formState.errors}
                                        initialData={watch('httpRequestHeader')?.map((headerData) => {
                                            return { httpRequestHeader: headerData }
                                        })}
                                    />
                                    <Spacer vertical />
                                    <Input
                                        {...register('httpRequestBody')}
                                        type="text"
                                        label={t('monitoring.compose.httpRequestBody')}
                                        className={styles.marginBottom0}
                                        error={formState.errors['httpRequestBody']?.message}
                                    />
                                    <Input
                                        {...register('httpResponseStatus')}
                                        type="text"
                                        label={t('monitoring.compose.httpResponseStatus')}
                                        className={styles.marginBottom0}
                                        error={formState.errors['httpResponseStatus']?.message}
                                    />
                                    <Input
                                        {...register('httpResponseBodyRegex')}
                                        type="text"
                                        label={t('monitoring.compose.httpResponseBodyRegex')}
                                        className={styles.marginBottom0}
                                        error={formState.errors['httpResponseBodyRegex']?.message}
                                    />
                                </>
                            ),
                        },
                    ]}
                />
                <Spacer vertical />
                <SubmitWithFeedback
                    submitButtonLabel={isNewRecord ? t('monitoring.compose.create') : t('monitoring.compose.update')}
                    loading={!!isCreateLoading}
                    additionalButtons={[<Button key={1} variant="secondary" label={t('monitoring.compose.cancel')} onClick={onCancel} />]}
                />
            </form>
        </>
    )
}
