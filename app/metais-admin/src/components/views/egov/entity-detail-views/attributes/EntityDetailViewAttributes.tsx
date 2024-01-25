import React, { useCallback, useState } from 'react'
import { IEntityDetailViewAttributes, filterSelectedRowsFromApi, isRowSelected } from '@isdd/metais-common'
import { ColumnDef } from '@tanstack/react-table'
import { Button, Input, Table } from '@isdd/idsk-ui-kit'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Link } from 'react-router-dom'

import styles from '../../detailViews.module.scss'

export const EntityDetailViewAttributes = ({
    data,
    attributesOverridesData,
    removeProfileAttribute,
    saveExistingAttribute,
    resetExistingAttribute,
    roles,
}: IEntityDetailViewAttributes) => {
    const { t } = useTranslation()
    const indexModificator = 1
    const selectedFromApi = filterSelectedRowsFromApi(attributesOverridesData, data?.attributes, indexModificator)
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const { register, getValues } = useForm({
        defaultValues: {
            attributes: data?.attributes ?? [],
        },
    })

    const cancelEditing = useCallback(
        (id: number) => {
            setSelectedRows([...(selectedRows?.filter((index) => index !== id) ?? [])])
        },
        [selectedRows],
    )

    const handleSaveAttribute = useCallback(
        (rowIndex: number) => {
            const editedData = getValues(`attributes.${rowIndex}`)
            saveExistingAttribute?.(editedData?.technicalName, editedData)
        },
        [saveExistingAttribute, getValues],
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
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original?.id, selectedRows) ? (
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
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original?.id, selectedRows) ? (
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
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
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
            header: t('actionsInTable.actions'),
            enableSorting: true,
            id: 'actions',
            cell: (ctx) => {
                if (isRowSelected(ctx?.row?.index + indexModificator, selectedFromApi) && !isRowSelected(ctx?.row?.original?.id, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button
                                onClick={() => {
                                    ctx?.row?.original?.id && setSelectedRows([...selectedRows, ctx.row.original.id])
                                }}
                                label={t('actionsInTable.edit')}
                            />
                            <Button onClick={() => handleResetAttribute(ctx?.row?.index)} label={t('actionsInTable.reset')} />
                        </div>
                    )
                } else if (isRowSelected(ctx?.row?.original?.id, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button
                                onClick={() => {
                                    handleSaveAttribute(ctx?.row?.index)
                                    ctx?.row?.original?.id && cancelEditing(ctx?.row?.original?.id)
                                }}
                                label={t('actionsInTable.save')}
                            />
                            <Button
                                onClick={() => {
                                    ctx?.row?.original?.id && cancelEditing(ctx?.row?.original?.id)
                                }}
                                label={t('actionsInTable.cancel')}
                            />
                        </div>
                    )
                } else
                    return (
                        <Button
                            onClick={() => {
                                ctx?.row?.original?.id && setSelectedRows([...selectedRows, ctx.row.original.id])
                            }}
                            label={t('actionsInTable.edit')}
                            disabled={!ctx.row.original.valid}
                        />
                    )
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
                <DefinitionList>
                    <InformationGridRow
                        key={'name'}
                        label={t('egov.name')}
                        value={
                            <Link target="_blank" to={`/egov/profile/${data?.technicalName}`}>
                                {data?.name}
                            </Link>
                        }
                        hideIcon
                    />
                    <InformationGridRow key={'technicalName'} label={t('egov.technicalName')} value={data?.technicalName} hideIcon />
                    <InformationGridRow key={'type'} label={t('egov.type')} value={data?.type ? t(`tooltips.type.${data.type}`) : ''} hideIcon />
                    <InformationGridRow key={'valid'} label={t('egov.valid')} value={t(`validity.${data?.valid}`)} hideIcon />
                    <InformationGridRow key={'description'} label={t('egov.description')} value={data?.description} hideIcon />
                    {Array.isArray(roles) ? (
                        data?.roleList?.map((role, index) => (
                            <InformationGridRow
                                key={'roles' + index}
                                label={index == 0 ? t('egov.roles') : ''}
                                hideIcon
                                value={<>{roles.find((r) => r.name == role)?.description}</>}
                            />
                        ))
                    ) : (
                        <InformationGridRow key={'roles'} label={t('egov.roles')} value={<>{roles?.description}</>} hideIcon />
                    )}{' '}
                </DefinitionList>
            </div>
            <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
            <div>
                <Table columns={columns} data={data?.attributes} />
            </div>
        </>
    )
}
