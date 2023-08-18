import React, { useCallback, useState } from 'react'
import { Attribute, IEntityDetailViewAttributes, filterSelectedRowsFromApi, isRowSelected } from '@isdd/metais-common'
import { ColumnDef } from '@tanstack/react-table'
import { Button, Input, Table } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

import styles from '../detailViews.module.scss'

export const EntityDetailViewAttributes = ({
    data,
    attributesOverridesData,
    removeProfileAttribute,
    saveExistingAttribute,
    resetExistingAttribute,
}: IEntityDetailViewAttributes) => {
    const { t } = useTranslation()
    const selectedFromApi = filterSelectedRowsFromApi(attributesOverridesData, data?.attributes)
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const { register, getValues } = useForm({
        defaultValues: {
            attributes: data?.attributes ?? [],
        },
    })

    const cancelEditing = useCallback(
        (rowIndex: number) => {
            setSelectedRows([...(selectedRows?.filter((index) => index !== rowIndex) ?? [])])
        },
        [selectedRows],
    )

    const handleSaveAttribute = useCallback(
        (rowIndex: number) => {
            const editedData = getValues(`attributes.${rowIndex}`)
            saveExistingAttribute?.(editedData?.technicalName, editedData)
            cancelEditing(rowIndex)
        },
        [saveExistingAttribute, getValues, cancelEditing],
    )

    const handleResetAttribute = useCallback(
        (rowIndex: number) => {
            const editedData = getValues(`attributes.${rowIndex}`)
            resetExistingAttribute?.(editedData?.technicalName)
        },
        [resetExistingAttribute, getValues],
    )

    const columns: Array<ColumnDef<Attribute>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input id="name" {...register(`attributes.${ctx?.row?.index}.name`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input id="name" {...register(`attributes.${ctx?.row?.index}.description`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },

        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.technicalName,
            enableSorting: true,
            id: 'technicalName',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            id: 'type',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => <span>{t(`state.${ctx.row?.original?.valid}`)}</span>,
        },
        {
            header: t('actionsInTable.actions'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            id: 'actions',
            cell: (ctx) => {
                if (isRowSelected(ctx?.row?.index, selectedFromApi) && !isRowSelected(ctx?.row?.index, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button onClick={() => setSelectedRows([...selectedRows, ctx?.row?.index])} label={t('actionsInTable.edit')} />
                            <Button onClick={() => handleResetAttribute(ctx?.row?.index)} label={t('actionsInTable.reset')} />
                        </div>
                    )
                } else if (isRowSelected(ctx?.row?.index, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button onClick={() => handleSaveAttribute(ctx?.row?.index)} label={t('actionsInTable.save')} />
                            <Button onClick={() => cancelEditing(ctx?.row?.index)} label={t('actionsInTable.cancel')} />
                        </div>
                    )
                } else return <Button onClick={() => setSelectedRows([...selectedRows, ctx?.row?.index])} label={t('actionsInTable.edit')} />
            },
        },
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                {removeProfileAttribute && (
                    <Button
                        label={t('egov.create.removeProfile')}
                        className={styles.removeButton}
                        onClick={() => removeProfileAttribute(data?.technicalName ?? '')}
                    />
                )}
                <div className={styles.attributeGridRowBox}>
                    <InformationGridRow key={'name'} label={t('egov.name')} value={data?.name} />
                    <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={data?.technicalName} />
                    <InformationGridRow key={'type'} label={t('egov.type')} value={t(`type.${data?.type}`)} />
                    <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`state.${data?.valid}`)} />
                    <InformationGridRow key={'description'} label={t('egov.description')} value={data?.description} />
                    <InformationGridRow key={'roles'} label={t('egov.roles')} value={data?.roleList} />
                </div>
            </div>
            <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
            <div>
                <Table columns={columns} data={data?.attributes} />
            </div>
        </>
    )
}
