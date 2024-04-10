import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { GetAllLocale, GetAllUserInterface } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { Row } from '@tanstack/react-table'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { DOT_SIGN, JOIN_OPERATOR } from '@isdd/metais-common/constants'

import {
    CustomPagination,
    DataRecord,
    NameValueObj,
    SecondLanguage,
    getLocalizationColumns,
    hasSecValue,
    isObjectWithSkAndEn,
} from '@/componentHelpers/localization'
import { UpdateForm, UpdateMultiple } from '@/hooks/useTransUpdate'

type Props = {
    rowSelection: DataRecord
    setRowSelection: Dispatch<SetStateAction<DataRecord>>
    pagination: CustomPagination
    dataArr: NameValueObj[]
    firstLanguage: GetAllLocale
    secondLanguage: SecondLanguage
    handleFilterChange: (changedFilter: IFilter) => void
    clearSelectedRows: () => void
    sort: ColumnSort[]
    userInterface: GetAllUserInterface
    updateMultiple: ({ data }: UpdateMultiple) => void
    updateForm: ({ data, params }: UpdateForm) => void
}

export const getKey = (uuid: string) => {
    return uuid.split(DOT_SIGN).join(JOIN_OPERATOR)
}

export const LocalizationTable: React.FC<Props> = ({
    rowSelection,
    setRowSelection,
    pagination: { startOfList, endOfList, pageNumber, pageSize, dataLength },
    dataArr,
    secondLanguage,
    firstLanguage,
    handleFilterChange,
    clearSelectedRows,
    sort,
    userInterface,
    updateForm,
    updateMultiple,
}) => {
    const { t } = useTranslation()
    const tableRef = useRef<HTMLTableElement>(null)
    const [areBeingEdited, setAreBeingEdited] = useState<Record<string, NameValueObj>>({})
    const { register, getValues, reset } = useForm<Record<string, string | { sk: string; en: string }>>({
        defaultValues: {},
    })

    //clear form when anything but pagination changes in filter
    useEffect(() => {
        reset({})
        setAreBeingEdited({})
    }, [firstLanguage, reset, secondLanguage, userInterface])

    const onCancel = useCallback(
        (uuid: string) => {
            const currentValues = getValues()
            delete currentValues[getKey(uuid)]
            reset(currentValues)
            setAreBeingEdited((prev) => {
                const newRecord = { ...prev }
                delete newRecord[uuid]
                return newRecord
            })
        },
        [getValues, reset],
    )

    const onEdit = useCallback(
        (item: NameValueObj) => {
            const currentValues = getValues()
            const key = getKey(item.uuid)

            if (secondLanguage && hasSecValue(item)) {
                reset({ ...currentValues, [key]: { sk: item.value, en: item.secValue } })
            } else {
                reset({ ...currentValues, [key]: item.value })
            }
            setAreBeingEdited((prev) => ({ ...prev, [item.uuid]: item }))
        },
        [getValues, reset, secondLanguage],
    )

    const submit = useCallback(
        (uuid: string) => {
            const formValues = getValues()
            const key = getKey(uuid)
            const submitted = formValues[key]

            if (secondLanguage && isObjectWithSkAndEn(submitted)) {
                updateMultiple({
                    data: [
                        { locale: 'SK', userInterface, map: { [uuid]: submitted.sk } },
                        { locale: 'EN', userInterface, map: { [uuid]: submitted.en } },
                    ],
                })
            } else {
                updateForm({ data: { [uuid]: submitted?.toString() }, params: { locale: firstLanguage, userInterface } })
            }

            onCancel(uuid)
        },
        [firstLanguage, getValues, onCancel, secondLanguage, updateForm, updateMultiple, userInterface],
    )

    const handleCheckboxChange = useCallback(
        (row: Row<NameValueObj>) => {
            if (row.original.uuid) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.uuid]) {
                    delete newRowSelection[row.original.uuid]
                } else {
                    if (hasSecValue(row.original)) {
                        newRowSelection[row.original.uuid] = { sk: row.original.value, en: row.original.secValue }
                    } else {
                        newRowSelection[row.original.uuid] = row.original.value
                    }
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection, setRowSelection],
    )

    const handleAllCheckboxChange = useCallback(
        (rows: NameValueObj[]) => {
            const checked = rows.every(({ uuid }) => (uuid ? !!rowSelection[uuid] : false))
            const newRowSelection = { ...rowSelection }
            if (checked) {
                rows.forEach(({ uuid }) => uuid && delete newRowSelection[uuid])
                setRowSelection(newRowSelection)
            } else {
                setRowSelection((prevRowSelection) => ({
                    ...prevRowSelection,
                    ...rows.reduce<DataRecord>((result, item) => {
                        if (item.uuid) {
                            if (hasSecValue(item)) {
                                result[item.uuid] = { sk: item.value, en: item.secValue }
                            } else {
                                result[item.uuid] = item.value
                            }
                        }
                        return result
                    }, {}),
                }))
            }
        },
        [rowSelection, setRowSelection],
    )

    const isRowSelected = (row: Row<NameValueObj>) => {
        return row.original.uuid ? !!rowSelection[row.original.uuid] : false
    }

    const columns = useMemo(() => {
        return getLocalizationColumns({
            rowSelection,
            dataArr,
            t,
            secondLanguage,
            firstLanguage,
            handleAllCheckboxChange,
            handleCheckboxChange,
            areBeingEdited,
            register,
            submit,
            onCancel,
            onEdit,
        })
    }, [
        areBeingEdited,
        dataArr,
        firstLanguage,
        handleAllCheckboxChange,
        handleCheckboxChange,
        onCancel,
        onEdit,
        register,
        rowSelection,
        secondLanguage,
        submit,
        t,
    ])

    const [seed, setSeed] = useState(1)
    useEffect(() => {
        setSeed(Math.random())
    }, [columns])

    return (
        <>
            <Table
                key={seed}
                tableRef={tableRef}
                columns={columns}
                data={dataArr.slice(startOfList, endOfList)}
                isRowSelected={isRowSelected}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                    clearSelectedRows()
                }}
                sort={sort}
            />
            <PaginatorWrapper handlePageChange={handleFilterChange} pageNumber={pageNumber} pageSize={pageSize} dataLength={dataLength} />
        </>
    )
}
