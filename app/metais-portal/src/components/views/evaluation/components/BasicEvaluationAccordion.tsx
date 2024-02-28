import { Button, ButtonGroupRow, CheckBox, InfoIconWithText, Table, TextArea } from '@isdd/idsk-ui-kit/index'
import {
    KrisToBeRights,
    NewNoteUi,
    NoteItemUi,
    useAddEvaluationHook,
    useAddResponseHook,
    useGetEvaluations,
} from '@isdd/metais-common/api/generated/kris-swagger'
import { useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ColumnDef, Row } from '@tanstack/react-table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'

import { IResultCall } from '@/components/views/evaluation/EvaluationView'
import styles from '@/components/views/evaluation/evaluationView.module.scss'
interface IBasicEvaluationAccordionProps {
    entityId: string
    dataRights?: KrisToBeRights
    isGlobalAllowed: boolean
}

interface IDetailISVSColumn {
    id: string
    name: string
    tooltip: string
    lastEvaliation?: string
    createdBy?: string
    isApproved: boolean
    evaluation?: string
    response?: string
}

export const BasicEvaluationAccordion: React.FC<IBasicEvaluationAccordionProps> = ({ entityId, dataRights, isGlobalAllowed }) => {
    const { t } = useTranslation()
    const { data: evalData, isError, isLoading, refetch, isFetching } = useGetEvaluations(entityId, entityId ?? '', 'KRIS')
    const { data: krisToBeData, isLoading: isLoadingKrisToBeData, isError: isErrorKrisToBeData } = useGetAttributeProfile('Profil_KRIS_TO_BE')
    const { register, handleSubmit, setValue, getValues } = useForm<Array<IDetailISVSColumn>>()
    const [rowSelection, setRowSelection] = useState<Array<string>>([])
    const [isLoadingAddData, setLoadingAddData] = useState<boolean>(false)
    const [isErrorAddData, setErrorAddData] = useState<boolean>(false)
    const [isEditRow, setEditRow] = useState<boolean>(false)
    const saveIsvsHook = useAddEvaluationHook()
    const saveResponseIsvsHook = useAddResponseHook()
    const [resultSuccessApiCall, setResultSuccessApiCall] = useState<IResultCall>({ isSuccess: false, message: '' })

    const onSubmit = (formData: IDetailISVSColumn[]) => {
        setEditRow(false)
        setLoadingAddData(true)
        const convertData = Object.values(formData)

        if (dataRights?.inEvaluation) {
            const fetchData: NewNoteUi = {
                values: convertData?.map((item: IDetailISVSColumn) => {
                    return { name: item.id, value: item.evaluation }
                }),
                state: {
                    values: convertData?.map((item: IDetailISVSColumn) => {
                        return { name: item.id, value: item.isApproved }
                    }),
                },
            }
            saveIsvsHook(entityId, entityId ?? '', 'KRIS', fetchData)
                .then(() => {
                    refetch()
                    setResultSuccessApiCall({ isSuccess: true, message: t('evaluation.saveSuccess') })
                })
                .catch(() => {
                    setErrorAddData(false)
                })
                .finally(() => {
                    setLoadingAddData(false)
                })
        } else {
            const fetchData: NewNoteUi = {
                values: convertData?.map((item: IDetailISVSColumn) => {
                    return { name: item.id, value: item.response }
                }),
            }

            saveResponseIsvsHook(entityId, entityId ?? '', 'KRIS', fetchData)
                .then(() => {
                    refetch()
                    setResultSuccessApiCall({ isSuccess: true, message: t('evaluation.saveSuccess') })
                })
                .catch(() => {
                    setErrorAddData(false)
                })
                .finally(() => {
                    setLoadingAddData(false)
                })
        }
    }

    const handleCheckboxChange = useCallback(
        (row: Row<IDetailISVSColumn>) => {
            if (row.original.id) {
                if (rowSelection.includes(row.original.id)) {
                    setRowSelection((prev) => prev.filter((id) => id !== row.original.id))
                    setValue(`${row?.index}.isApproved`, false)
                } else {
                    setRowSelection((prev) => [...prev, row.original.id || ''])
                    setValue(`${row?.index}.isApproved`, true)
                }
            }
        },
        [rowSelection, setValue],
    )
    const handleAllCheckboxChange = () => {
        if (!evalData) return

        const values = Object.values(getValues())
        const checkedAll = values?.every((i) => i.isApproved === true)

        if (checkedAll) {
            let count = 0
            values.map(() => {
                setValue(`${count++}.isApproved`, false)
            })
            setRowSelection([])
            return
        }
        let count = 0
        values.map(() => {
            setValue(`${count++}.isApproved`, true)
        })
        const customRows = values?.map((row) => row.name || '') || []
        setRowSelection(customRows)
    }

    useEffect(() => {
        const rows = evalData?.state?.values?.filter((i) => i.value).map((i) => i.name || '') ?? []
        setRowSelection(rows)
    }, [evalData])

    const columnsDetail: Array<ColumnDef<IDetailISVSColumn>> = [
        {
            accessorFn: (row) => row?.name,
            header: '',
            id: 'name',
            cell: ({ row }) => {
                return (
                    <InfoIconWithText key={row?.original?.name} tooltip={row?.original?.tooltip} label={row?.original?.name}>
                        {row?.original?.name}
                        <input readOnly hidden {...register(`${row?.index}.id`)} key={row?.original?.id} value={row?.original?.id} />
                    </InfoIconWithText>
                )
            },
            size: 100,
        },
        {
            accessorFn: (row) => row?.lastEvaliation,
            header: t('evaluation.detailTable.lastEvaluation'),
            id: 'lastEvaluation',
            cell: (ctx) => ctx.row?.original?.lastEvaliation,
            size: 200,
        },
        {
            accessorFn: (row) => row?.response,
            header: t('evaluation.detailTable.createdBy'),
            id: 'createdBy',
            cell: (ctx) => {
                return !isEditRow || dataRights?.inEvaluation ? (
                    ctx.row?.original?.response
                ) : (
                    <TextArea rows={3} defaultValue={ctx.row?.original?.response} {...register(`${ctx.row?.index}.response`)} />
                )
            },
            size: 200,
        },
        {
            accessorFn: (row) => row?.isApproved,
            id: CHECKBOX_CELL,
            header: () => {
                const checkedAll = Object.values(getValues())?.every((row) => rowSelection.includes(row.name || ''))

                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            disabled={!isEditRow || !dataRights?.inEvaluation}
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => handleAllCheckboxChange()}
                            checked={checkedAll}
                            title={t('table.selectAllItems')}
                        />
                    </div>
                )
            },
            cell: ({ row }) => {
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            {...register(`${row?.index}.isApproved`)}
                            label=""
                            disabled={!isEditRow || !dataRights?.inEvaluation}
                            id={`${row?.index}.isApproved`}
                            onChange={() => handleCheckboxChange(row)}
                            checked={rowSelection.includes(row.original.id)}
                            title={t('table.selectItem', { itemName: row.original.name })}
                        />
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => row?.evaluation,
            header: () => {
                return (
                    <div className={styles.customHEader}>
                        {t('evaluation.detailTable.evaluation')}
                        {!isGlobalAllowed &&
                            (!isEditRow ? (
                                <Button className={styles.headerBtn} label={t('evaluation.changeBtn')} onClick={() => setEditRow(!isEditRow)} />
                            ) : (
                                <ButtonGroupRow>
                                    <Button label={t('evaluation.saveBtn')} className={styles.headerBtn} type="submit" />
                                    <Button
                                        variant="secondary"
                                        className={styles.headerBtn}
                                        label={t('evaluation.cancelBtn')}
                                        onClick={() => setEditRow(false)}
                                    />
                                </ButtonGroupRow>
                            ))}
                    </div>
                )
            },
            id: 'evaluation',
            cell: ({ row }) => {
                return dataRights?.inEvaluation && isEditRow ? (
                    <TextArea {...register(`${row?.index}.evaluation`)} rows={3} defaultValue={row?.original?.evaluation} />
                ) : (
                    <>{row?.original?.evaluation}</>
                )
            },
            size: 200,
        },
    ]
    const mappedData = (apiData?: NoteItemUi): Array<IDetailISVSColumn> => {
        return (
            evalData?.state?.values?.map((item) => {
                return {
                    id: krisToBeData?.attributes?.find((att) => att.technicalName === item.name)?.technicalName ?? '',
                    name: krisToBeData?.attributes?.find((att) => att.technicalName === item.name)?.name,
                    tooltip: krisToBeData?.attributes?.find((att) => att.technicalName === item.name)?.description,
                    lastEvaliation: apiData?.evaluations?.[apiData?.evaluations?.length - 1]?.values?.find((e) => e.name === item.name)?.value ?? '',
                    createdBy: evalData?.evaluations?.[evalData?.evaluations?.length - 1]?.noteVersionUi?.createdBy ?? '',
                    isApproved: item?.value,
                    evaluation: apiData?.evaluations?.[apiData?.evaluations?.length - 1]?.values?.find((e) => e.name === item.name)?.value ?? '',
                    response: apiData?.responses?.[apiData?.responses?.length - 1]?.values?.find((e) => e.name === item.name)?.value ?? '',
                } as IDetailISVSColumn
            }) ?? []
        )
    }

    return (
        <QueryFeedback
            loading={isLoading || isLoadingAddData || isFetching || isLoadingKrisToBeData}
            error={isError || isErrorAddData || isErrorKrisToBeData}
        >
            {resultSuccessApiCall.isSuccess && (
                <MutationFeedback
                    success={resultSuccessApiCall.isSuccess}
                    successMessage={resultSuccessApiCall.message}
                    error={undefined}
                    onMessageClose={() => setResultSuccessApiCall({ isSuccess: false, message: '' })}
                />
            )}
            <div className={styles.expandableRowContent}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Table columns={columnsDetail} data={mappedData(evalData)} />
                </form>
            </div>
        </QueryFeedback>
    )
}
