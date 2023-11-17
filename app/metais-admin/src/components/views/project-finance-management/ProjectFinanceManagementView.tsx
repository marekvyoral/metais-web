import { Button, Filter, ISelectColumnType, Input, PaginatorWrapper, SimpleSelect, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ApiProgramPartFinance, GetProgramWithPartsParams } from '@isdd/metais-common/api/generated/kris-swagger'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    getProjectsFinanceManagementSelectedColumns,
    projectsFinanceManagementInvestmentType,
} from '@isdd/metais-common/constants'
import { ActionsOverTable, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { IView, defaultFilter } from '@/components/containers/ProjectFinanceManagement/ProjectFinanceManagementContainer'

const DEFAULT_FOCUS_KEY = 'program.partFinances.0.min'

export const ProjectFinanceManagementView: React.FC<IView> = ({
    isLoading,
    allPrograms,
    approvalProcesses,
    program,
    filter,
    handleFilterChange,
    updateProgramHook,
    refetchProgram,
    setIsUpdating,
    isSuccess,
    isError,
}) => {
    const { t, i18n } = useTranslation()
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([...getProjectsFinanceManagementSelectedColumns(t)])
    const [editing, setEditing] = useState(false)
    const [editingInputId, setEditingInputId] = useState(DEFAULT_FOCUS_KEY)
    const { register, reset, handleSubmit, setValue, formState, getValues, setError, clearErrors } = useForm({
        defaultValues: {
            program,
        },
    })

    const handleMinErrors = useCallback(() => {
        program?.partFinances?.forEach((_, index) => {
            const currentIndex: `program.partFinances.${number}.min` = `program.partFinances.${index}.min`
            const current = getValues(currentIndex) ?? 0
            const currentMax = getValues(`program.partFinances.${index}.max`) ?? 0
            const previousMax = getValues(`program.partFinances.${index - 1}.max`) ?? 0

            if (index == 0) {
                if (current != 0) {
                    setError(currentIndex, {
                        message: t('financesValidations.startWithZero'),
                    })
                    return
                } else {
                    clearErrors(currentIndex)
                }
            } else {
                if (Number(previousMax) + 1 != Number(current)) {
                    setError(currentIndex, {
                        message: t('financesValidations.allNumbers'),
                    })
                    return
                } else {
                    clearErrors(currentIndex)
                }
                if (currentMax != 0 && Number(current) >= Number(currentMax)) {
                    setError(currentIndex, {
                        message: t('financesValidations.minMax'),
                    })
                } else {
                    clearErrors(currentIndex)
                }
            }
        })
    }, [clearErrors, getValues, program?.partFinances, setError, t])

    const handleMaxErrors = useCallback(() => {
        const lastIndex = (program?.partFinances?.length ?? 0) - 1
        program?.partFinances?.forEach((_, index) => {
            const currentIndex: `program.partFinances.${number}.max` = `program.partFinances.${index}.max`
            const current = getValues(currentIndex) ?? 0
            const currentMin = getValues(`program.partFinances.${index}.min`) ?? 0
            const nextMin = getValues(`program.partFinances.${index + 1}.min`) ?? 0
            if (index != lastIndex) {
                if (Number(nextMin) != Number(current) + 1) {
                    setError(currentIndex, {
                        message: t('financesValidations.allNumbers'),
                    })
                    return
                } else {
                    clearErrors(currentIndex)
                }
                if (Number(current) <= Number(currentMin)) {
                    setError(currentIndex, {
                        message: t('financesValidations.allNumbers'),
                    })
                } else {
                    clearErrors(currentIndex)
                }
            }
        })
    }, [clearErrors, getValues, program?.partFinances, setError, t])

    const handleErrors = useCallback(() => {
        handleMinErrors()
        handleMaxErrors()
    }, [handleMaxErrors, handleMinErrors])

    const columns: Array<ColumnDef<ApiProgramPartFinance>> = [
        {
            header: t('projects.financeManagement.tableTitleMin'),
            accessorFn: (row) => row?.min,
            enableSorting: true,
            id: 'min',
            cell: (cell) => (
                <Input
                    type="number"
                    disabled={!editing}
                    defaultValue={program?.partFinances?.[cell.row.index].min}
                    {...register(`program.partFinances.${cell.row.index}.min`)}
                    error={formState.errors?.program?.partFinances?.[cell.row.index]?.min?.message}
                    onChange={(newValue) => {
                        setValue(`program.partFinances.${cell.row.index}.min`, Number(newValue.target.value))
                        setEditingInputId(`program.partFinances.${cell.row.index}.min`)
                        handleErrors()
                    }}
                    autoFocus={editingInputId === `program.partFinances.${cell.row.index}.min`}
                />
            ),
        },
        {
            header: t('projects.financeManagement.tableTitleMax'),
            accessorFn: (row) => row?.max,
            enableSorting: true,
            id: 'max',
            cell: (cell) =>
                cell.row.original.max == 0 ? (
                    t('projects.financeManagement.more')
                ) : (
                    <Input
                        type="number"
                        disabled={!editing}
                        {...register(`program.partFinances.${cell.row.index}.max`)}
                        defaultValue={program?.partFinances?.[cell.row.index].max}
                        onChange={(newValue) => {
                            setValue(`program.partFinances.${cell.row.index}.max`, Number(newValue.target.value))
                            setEditingInputId(`program.partFinances.${cell.row.index}.max`)
                            handleErrors()
                        }}
                        error={formState.errors.program?.partFinances?.[cell.row.index]?.max?.message}
                        autoFocus={editingInputId === `program.partFinances.${cell.row.index}.max`}
                    />
                ),
        },
        {
            header: t('projects.financeManagement.approvalProcessName'),
            accessorFn: (row) => (i18n.language == 'sk' ? row?.approvalProcess?.name : row.approvalProcess?.nameEng),
            enableSorting: true,
            id: 'name',
        },
        {
            header: t('projects.financeManagement.approvalProcess'),
            accessorFn: (row) => (i18n.language == 'sk' ? row?.approvalProcess?.description : row?.approvalProcess?.descriptionEng),

            enableSorting: true,
            id: 'approvalProcess',
            cell: (cell) => (
                <SimpleSelect
                    disabled={!editing}
                    defaultValue={approvalProcesses?.find((a) => a.id == program?.partFinances?.[cell.row.index].approvalProcess?.id)}
                    label=""
                    name={`program.partFinances.${cell.row.index}.approvalProcess`}
                    options={
                        approvalProcesses?.map((a) => ({
                            label: (i18n.language == 'sk' ? a.description : a.descriptionEng) ?? '',
                            value: a,
                        })) ?? []
                    }
                    setValue={setValue}
                />
            ),
        },
    ]

    const onSubmit = async (formData: FieldValues) => {
        setEditing(false)
        setIsUpdating(true)
        const response = await updateProgramHook({ id: Number(program?.id), data: formData.program ?? {} })

        if (response.ok) {
            refetchProgram()
        }
    }
    return (
        <>
            <TextHeading size={'L'}>{t('projects.financeManagement.heading')}</TextHeading>
            <MutationFeedback
                success={isSuccess}
                error={isError ? t('relationDetail.editError', { relationName: program?.name }) : ''}
                successMessage={t('relationDetail.editSuccess', { relationName: program?.name })}
            />
            <QueryFeedback loading={isLoading}>
                <Filter<GetProgramWithPartsParams>
                    defaultFilterValues={defaultFilter}
                    onlyForm
                    form={({ setValue: setFilterValue, watch: watchFilter }) => {
                        const programUuid = watchFilter('programUuid')
                        return (
                            <div>
                                <SimpleSelect
                                    name="programUuid"
                                    defaultValue={filter.programUuid}
                                    setValue={setFilterValue}
                                    label={t('projects.financeManagement.program')}
                                    options={allPrograms?.map((prog) => ({ label: prog.name ?? '', value: prog.programUuid ?? '' })) ?? []}
                                    placeholder={t('projects.financeManagement.selectProgram')}
                                />
                                <SimpleSelect
                                    disabled={programUuid == ''}
                                    name="projectType"
                                    defaultValue={filter.projectType}
                                    setValue={setFilterValue}
                                    label={t('projects.financeManagement.investmentType')}
                                    options={projectsFinanceManagementInvestmentType}
                                    placeholder={t('projects.financeManagement.selectInvestmentType')}
                                />
                            </div>
                        )
                    }}
                />
                <form>
                    <ActionsOverTable
                        entityName={''}
                        simpleTableColumnsSelect={{ selectedColumns, setSelectedColumns }}
                        pagination={{
                            pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                            dataLength: program?.partFinances?.length ?? 0,
                        }}
                        handleFilterChange={handleFilterChange}
                    >
                        {!editing ? (
                            <Button label={t('actionsInTable.edit')} onClick={() => setEditing(true)} variant="secondary" bottomMargin={false} />
                        ) : (
                            <>
                                <Button
                                    label={t('actionsInTable.cancel')}
                                    onClick={() => {
                                        reset()
                                        setEditing(false)
                                    }}
                                    variant="secondary"
                                    bottomMargin={false}
                                />
                                <Button
                                    label={t('actionsInTable.save')}
                                    onClick={handleSubmit(onSubmit)}
                                    bottomMargin={false}
                                    disabled={Object.keys(formState.errors).length !== 0}
                                />
                            </>
                        )}
                    </ActionsOverTable>
                    <Table
                        data={program?.partFinances}
                        columns={columns.filter((c) => selectedColumns.find((s) => s.selected && s.technicalName === c.id)) ?? []}
                        sort={filter.sort}
                        onSortingChange={(newSort) => handleFilterChange({ sort: newSort })}
                    />
                </form>
                <PaginatorWrapper
                    pageSize={filter.pageSize ?? BASE_PAGE_SIZE}
                    pageNumber={filter.pageNumber ?? BASE_PAGE_NUMBER}
                    dataLength={program?.partFinances?.length ?? 0}
                    handlePageChange={(page) => handleFilterChange({ pageNumber: page.pageNumber })}
                />
            </QueryFeedback>
        </>
    )
}
