import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { useForm } from 'react-hook-form'
import { MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { Button, Table, TextBody } from '@isdd/idsk-ui-kit/index'
import { ApiIntegrationHarmonogram } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useLocation, useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'
import { INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM } from '@isdd/metais-common/constants'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { replaceDotForUnderscore } from '@isdd/metais-common/utils/utils'

import styles from './integration.module.scss'

import { HarmonogramView } from '@/components/containers/IntegrationHarmonogramContainer'
import { formatFormValuesForHarmonogramUpdate, formatHarmonogramFormKey } from '@/componentHelpers/ci'

export enum HarmonogramInputNames {
    PLANNED_DATE = 'plannedDate',
    REALIZED_DATE = 'realizedDate',
}

export const IntegrationHarmonogramView: React.FC<HarmonogramView> = ({
    isError,
    isLoading,
    isUpdateError,
    isUpdateLoading,
    isUpdateSuccess,
    updateHarmonogram,
    data: { harmonogramData, integrationPhase },
}) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const isHarmonogramEdit = location.search.includes(INTEGRATION_HARMONOGRAM_EDIT_SEARCH_PARAM)

    const defaultValues = useMemo(() => {
        const formatDefaultValues = (data: ApiIntegrationHarmonogram[]) => {
            const formatted = data.reduce<Record<string, string | null>>((acc, item) => {
                const replacedHarmonogramPhase = replaceDotForUnderscore(item?.harmonogramPhase ?? '')

                return {
                    ...acc,
                    [formatHarmonogramFormKey(replacedHarmonogramPhase, HarmonogramInputNames.PLANNED_DATE)]: item.plannedDate ?? '',
                    [formatHarmonogramFormKey(replacedHarmonogramPhase, HarmonogramInputNames.REALIZED_DATE)]: item.realizedDate ?? '',
                }
            }, {})
            return formatted
        }
        return formatDefaultValues(harmonogramData?.results ?? [])
    }, [harmonogramData?.results])

    const { control, setValue, reset, handleSubmit } = useForm({
        defaultValues,
    })

    useEffect(() => {
        if (harmonogramData?.results && harmonogramData?.results?.length > 0) {
            reset(defaultValues)
        }
    }, [defaultValues, harmonogramData?.results, reset])

    const onSubmit = (formValues: Record<string, string | null>) => {
        const formattedValuesForUpdate = formatFormValuesForHarmonogramUpdate(formValues, harmonogramData)

        updateHarmonogram(formattedValuesForUpdate)
        navigate('?')
    }

    const handleDateChange = (date: Date | null, name: string) => {
        setValue(name, date ? DateTime.fromJSDate(date).toISO() : null)
    }

    const columns: Array<ColumnDef<ApiIntegrationHarmonogram>> = [
        {
            accessorKey: 'harmonogramPhase',
            header: () => {
                return <span>{t('integrationLinks.harmonogramPhase')}</span>
            },
            id: 'harmonogramPhase',
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationHarmonogram, unknown>) => {
                const phase = integrationPhase?.enumItems?.find((item) => item.code === ctx.row.original.harmonogramPhase)
                return (
                    <TextBody className={styles.lineBreak}>
                        <strong>{phase?.value}</strong>
                    </TextBody>
                )
            },
        },
        {
            accessorKey: 'plannedDate',
            header: () => {
                return <span>{t('integrationLinks.plannedDate')}</span>
            },
            id: 'plannedDate',
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationHarmonogram, unknown>) => {
                const replacedItemCode = replaceDotForUnderscore(ctx.row.original.harmonogramPhase ?? '')

                return isHarmonogramEdit ? (
                    <DateInput
                        className={styles.fullWidth}
                        name={formatHarmonogramFormKey(replacedItemCode, HarmonogramInputNames.PLANNED_DATE)}
                        control={control}
                        handleDateChange={handleDateChange}
                    />
                ) : (
                    <TextBody>
                        {t('date', { date: defaultValues?.[formatHarmonogramFormKey(replacedItemCode, HarmonogramInputNames.PLANNED_DATE)] })}
                    </TextBody>
                )
            },
        },
        {
            accessorKey: 'realizedDate',
            header: () => {
                return <span>{t('integrationLinks.realizedDate')}</span>
            },
            id: 'realizedDate',
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationHarmonogram, unknown>) => {
                const replacedItemCode = replaceDotForUnderscore(ctx.row.original.harmonogramPhase ?? '')

                return isHarmonogramEdit ? (
                    <DateInput
                        className={styles.fullWidth}
                        name={formatHarmonogramFormKey(replacedItemCode, HarmonogramInputNames.REALIZED_DATE)}
                        control={control}
                        handleDateChange={handleDateChange}
                    />
                ) : (
                    <TextBody>
                        {t('date', { date: defaultValues?.[formatHarmonogramFormKey(replacedItemCode, HarmonogramInputNames.REALIZED_DATE)] })}
                    </TextBody>
                )
            },
        },
    ]

    return (
        <QueryFeedback loading={isLoading || isUpdateLoading} error={isError} withChildren>
            <MutationFeedback success={isUpdateSuccess} error={isUpdateError ? t('feedback.mutationErrorMessage') : ''} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table columns={columns} data={harmonogramData?.results} />
                {isHarmonogramEdit && (
                    <SubmitWithFeedback
                        submitButtonLabel={t('integrationLinks.submit')}
                        loading={isUpdateLoading}
                        additionalButtons={[
                            <Button
                                key={1}
                                variant="secondary"
                                label={t('integrationLinks.reset')}
                                onClick={() => {
                                    reset(defaultValues)
                                    navigate('?')
                                }}
                            />,
                        ]}
                    />
                )}
            </form>
        </QueryFeedback>
    )
}
