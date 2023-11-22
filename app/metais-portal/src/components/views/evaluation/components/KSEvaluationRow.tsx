import { Button, ButtonGroupRow, CheckBox, GridRow, InfoIconWithText, Input, Table, TextArea } from '@isdd/idsk-ui-kit/index'
import { KrisToBeRights, NewNoteUi, NoteItemUi, useAddEvaluationHook, useGetEvaluations } from '@isdd/metais-common/api/generated/kris-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ColumnDef, Row } from '@tanstack/react-table'

import styles from '@/components/views/evaluation/evaluationView.module.scss'

interface IKSEvaluationRowProps {
    uuid?: string
    entityId: string
    isvsAttributes?: AttributeProfile
    dataRights?: KrisToBeRights
}

interface IDetailISVSColumn {
    id: string
    name: string
    tooltip: string
    lastEvaliation?: string
    createdBy?: string
    isApproved: boolean
    evaluation?: string
}

export const KSEvaluationRow: React.FC<IKSEvaluationRowProps> = ({ uuid, entityId, isvsAttributes, dataRights }) => {
    const { t } = useTranslation()
    const { data: evalData, isError, isLoading, refetch, isFetching } = useGetEvaluations(entityId, uuid ?? '', 'KS')
    const { register, handleSubmit, setValue, getValues } = useForm<Array<IDetailISVSColumn>>()
    const [rowSelection, setRowSelection] = useState<Array<string>>([])
    const [isLoadingAddData, setLoadingAddData] = useState<boolean>(false)
    const [isErrorAddData, setErrorAddData] = useState<boolean>(false)
    const [isEditRow, setEditRow] = useState<boolean>(false)
    const saveIsvsHook = useAddEvaluationHook()

    const onSubmit = (formData: IDetailISVSColumn[]) => {
        setEditRow(false)
        setLoadingAddData(true)
        const convertData = Object.values(formData)
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
        saveIsvsHook(entityId, uuid ?? '', 'KS', fetchData)
            .then(() => {
                refetch()
            })
            .catch(() => {
                setErrorAddData(false)
            })
            .finally(() => {
                setLoadingAddData(false)
            })
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
            for (const _ of values ?? []) {
                setValue(`${count++}.isApproved`, false)
            }
            setRowSelection([])
            return
        }
        let count = 0
        for (const _ of values ?? []) {
            setValue(`${count++}.isApproved`, true)
        }
        const customRows = values?.map((row) => row.name || '') || []
        setRowSelection(customRows)
    }

    const columnsDetail: Array<ColumnDef<IDetailISVSColumn>> = [
        {
            accessorFn: (row) => row?.name,
            header: '',
            id: 'name',
            cell: ({ row }) => {
                return (
                    <>
                        <InfoIconWithText key={row?.original?.name} tooltip={row?.original?.tooltip}>
                            {row?.original?.name}
                        </InfoIconWithText>
                        <Input readOnly hidden {...register(`${row?.index}.id`)} key={row?.original?.id} value={row?.original?.id} />
                    </>
                )
            },
        },
        {
            accessorFn: (row) => row?.lastEvaliation,
            header: t('evaluation.detailTable.lastEvaluation'),
            id: 'lastEvaluation',
            cell: (ctx) => ctx.row?.original?.lastEvaliation,
        },
        {
            accessorFn: (row) => row?.createdBy,
            header: t('evaluation.detailTable.createdBy'),
            id: 'createdBy',
            cell: (ctx) => ctx.row?.original?.createdBy,
        },
        {
            accessorFn: (row) => row?.isApproved,
            id: 'isApproved',
            header: () => {
                const checkedAll = Object.values(getValues())?.every((row) => rowSelection.includes(row.name || ''))

                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            disabled={!isEditRow}
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={() => handleAllCheckboxChange()}
                            checked={checkedAll}
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
                            disabled={!isEditRow}
                            id={`${row?.index}.isApproved`}
                            onChange={() => handleCheckboxChange(row)}
                            checked={rowSelection.includes(row.original.id)}
                        />
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => row?.evaluation,
            header: () => {
                return (
                    <>
                        <GridRow>{t('evaluation.detailTable.evaluation')}</GridRow>
                        <GridRow>
                            {!isEditRow ? (
                                <Button label={t('evaluation.changeBtn')} onClick={() => setEditRow(!isEditRow)} />
                            ) : (
                                <ButtonGroupRow>
                                    <Button label={t('evaluation.saveBtn')} type="submit" />
                                    <Button variant="secondary" label={t('evaluation.cancelBtn')} onClick={() => setEditRow(false)} />
                                </ButtonGroupRow>
                            )}
                        </GridRow>
                    </>
                )
            },
            id: 'evaluation',
            cell: ({ row }) => {
                return isEditRow ? (
                    <TextArea {...register(`${row?.index}.evaluation`)} rows={3} defaultValue={row?.original?.evaluation} />
                ) : (
                    <>{row?.original?.evaluation}</>
                )
            },
        },
    ]
    const mappedData = (apiData?: NoteItemUi): Array<IDetailISVSColumn> => {
        return (
            apiData?.state?.values?.map((item) => {
                return {
                    id: item.name,
                    name: isvsAttributes?.attributes?.find((att) => att.technicalName === item.name)?.name ?? '',
                    tooltip: isvsAttributes?.attributes?.find((att) => att.technicalName === item.name)?.description ?? '',
                    lastEvaliation: apiData?.evaluations?.[apiData?.evaluations?.length - 1]?.values?.find((e) => e.name === item.name)?.value ?? '',
                    createdBy: apiData?.evaluations?.[apiData?.evaluations?.length - 1]?.noteVersionUi?.createdBy ?? '',
                    isApproved: apiData?.state?.values?.find((e) => e.name === item.name)?.value,
                    evaluation: apiData?.evaluations?.[apiData?.evaluations?.length - 1]?.values?.find((e) => e.name === item.name)?.value ?? '',
                } as IDetailISVSColumn
            }) ?? []
        )
    }

    return (
        <QueryFeedback loading={isLoading || isLoadingAddData || isFetching} error={isError || isErrorAddData}>
            <div className={styles.expandableRowContent}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Table columns={columnsDetail} data={mappedData(evalData)} />
                </form>
            </div>
        </QueryFeedback>
    )
}
