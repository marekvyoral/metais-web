import React, { useCallback, useState } from 'react'
import { Button, CheckBox, Input, Table } from '@isdd/idsk-ui-kit'
import { Attribute } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { isRowSelected } from '@isdd/metais-common'
import { useForm } from 'react-hook-form'

import { BasicInformations } from '../BasicInformations'
import styles from '../detailViews.module.scss'

import { AddAttributeModal } from './attributes/AddAttributeModal'
import { MoreActionsColumn } from './actions/MoreActionsColumn'

import { IAtrributesContainerView } from '@/components/containers/Egov/Profile/ProfileDetailContainer'

export const ProfileDetailView = ({
    data: { ciTypeData, constraintsData, unitsData },
    setValidityOfProfile,
    entityName,
    saveAttribute,
    setValidityOfAttributeProfile,
    setVisibilityOfAttributeProfile,
}: IAtrributesContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [openAddAttributeModal, setOpenAddAttributeModal] = useState(false)
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const { register, getValues } = useForm({
        defaultValues: {
            attributes: ciTypeData?.attributes ?? [],
        },
    })

    const editRow = useCallback(
        (rowIndex: number) => {
            setSelectedRows([...selectedRows, rowIndex])
        },
        [setSelectedRows, selectedRows],
    )

    const cancelEditing = useCallback(
        (rowIndex: number) => {
            setSelectedRows([...(selectedRows?.filter((index) => index !== rowIndex) ?? [])])
        },
        [selectedRows],
    )

    const handleSaveAttribute = useCallback(
        (rowIndex: number) => {
            const editedData = getValues(`attributes.${rowIndex}`)
            saveAttribute?.(editedData)
            cancelEditing(rowIndex)
        },
        [saveAttribute, getValues, cancelEditing],
    )

    const columns: Array<ColumnDef<Attribute>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input {...register(`attributes.${ctx?.row?.index}.name`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engName'),
            accessorFn: (row) => row?.engName,
            enableSorting: true,
            id: 'engName',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input {...register(`attributes.${ctx?.row?.index}.engName`)} />
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
                    <Input {...register(`attributes.${ctx?.row?.index}.description`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engDescription'),
            accessorFn: (row) => row?.engDescription,
            enableSorting: true,
            id: 'engDescription',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input {...register(`attributes.${ctx?.row?.index}.engDescription`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.order'),
            accessorFn: (row) => row?.order,
            enableSorting: true,
            id: 'order',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input type="number" {...register(`attributes.${ctx?.row?.index}.order`)} />
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
            cell: (ctx) => <span>{t(`validity.${ctx.row?.original?.valid}`)}</span>,
        },
        {
            header: t('egov.invisible'),
            accessorFn: (row) => row?.invisible,
            id: 'invisible',
            cell: (row) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox label={row.getValue() as string} name="checkbox" disabled checked={!row?.getValue()} id="invisible" />
                </div>
            ),
        },
        {
            header: t('egov.defaultValue'),
            accessorFn: (row) => row?.defaultValue,
            enableSorting: true,
            id: 'defaultValue',
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input {...register(`attributes.${ctx?.row?.index}.defaultValue`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('actionsInTable.actions'),
            enableSorting: true,
            id: 'actions',
            cell: (ctx) => {
                if (!ctx?.row?.original?.valid) {
                    return (
                        <Button
                            onClick={() => setValidityOfAttributeProfile?.(ctx?.row?.original?.technicalName, ctx?.row?.original?.valid)}
                            label={ctx?.row?.original?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                        />
                    )
                } else if (isRowSelected(ctx?.row?.index, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button onClick={() => handleSaveAttribute(ctx?.row?.index)} label={t('actionsInTable.save')} />
                            <Button onClick={() => cancelEditing(ctx?.row?.index)} label={t('actionsInTable.cancel')} />
                        </div>
                    )
                } else
                    return (
                        <MoreActionsColumn
                            ctx={ctx}
                            t={t}
                            setValidityOfAttributeProfile={setValidityOfAttributeProfile}
                            setVisibilityOfAttributeProfile={setVisibilityOfAttributeProfile}
                            editRow={editRow}
                        />
                    )
            },
        },
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('egov.detail.profileAttributesHeading')}</h2>
                    <div className={styles.generalActions}>
                        <Button
                            label={t('egov.edit')}
                            onClick={() => {
                                navigate('/egov/profile/' + ciTypeData?.technicalName + '/edit')
                            }}
                        />
                        <Button
                            label={ciTypeData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                            onClick={() => setValidityOfProfile(ciTypeData?.technicalName)}
                        />
                    </div>
                </div>
                <BasicInformations data={{ ciTypeData, constraintsData, unitsData }} />
            </div>
            <div>
                <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
                <Table columns={columns} data={ciTypeData?.attributes ?? []} />
                <Button label={t('egov.create.addAttribute')} onClick={() => setOpenAddAttributeModal(true)} />
                <AddAttributeModal open={openAddAttributeModal} onClose={() => setOpenAddAttributeModal(false)} entityName={entityName ?? ''} />
            </div>
        </>
    )
}
