import { BreadCrumbs, Button, CheckBox, HomeIcon, Input, Table } from '@isdd/idsk-ui-kit'
import { isRowSelected } from '@isdd/metais-common'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { HTML_TYPE } from '@isdd/metais-common/constants'

import { MoreActionsColumn } from './actions/MoreActionsColumn'
import { AddAttributeModal } from './attributes/AddAttributeModal'

import styles from '@/components/views/egov/detailViews.module.scss'
import { IAtrributesContainerView } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { BasicInformations } from '@/components/views/egov/BasicInformations'

export const ProfileDetailView = <T,>({
    data: { ciTypeData, constraintsData, unitsData },
    setValidityOfProfile,
    entityName,
    saveAttribute,
    setValidityOfAttributeProfile,
    setVisibilityOfAttributeProfile,
}: IAtrributesContainerView<T>) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
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
        (rowIndex: number, row: Row<Attribute>) => {
            const editedData = getValues(`attributes.${rowIndex}`)
            const originalRow = row.original

            const editedAttribute = { ...originalRow, ...editedData }
            saveAttribute?.(editedAttribute as T)
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
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.index}.name`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engName'),
            accessorFn: (row) => row?.engName,
            enableSorting: true,
            id: 'engName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.index}.engName`)} />
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
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.index}.description`)} />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engDescription'),
            accessorFn: (row) => row?.engDescription,
            enableSorting: true,
            id: 'engDescription',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.index, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.index}.engDescription`)} />
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
                    <Input defaultValue={Number(ctx?.getValue?.())} type="number" {...register(`attributes.${ctx?.row?.index}.order`)} />
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
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => {
                if (isRowSelected(ctx?.row?.index, selectedRows)) {
                    return <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.index}.defaultValue`)} />
                } else if (ctx.row.original.type === HTML_TYPE) {
                    return <SafeHtmlComponent dirtyHtml={ctx?.getValue?.() as string} />
                } else {
                    return <span>{ctx?.getValue?.() as string}</span>
                }
            },
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
                            <Button onClick={() => handleSaveAttribute(ctx?.row?.index, ctx.row)} label={t('actionsInTable.save')} />
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
            <BreadCrumbs
                links={[
                    { label: t('egov.routing.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('egov.routing.attrProfile'), href: AdminRouteNames.EGOV_PROFILE },
                ]}
            />
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('egov.detail.profileAttributesHeading')}</h2>
                    <div className={styles.generalActions}>
                        <Button
                            label={t('egov.edit')}
                            onClick={() => {
                                navigate('/egov/profile/' + ciTypeData?.technicalName + '/edit', { state: { from: location } })
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
                <div className={styles.underTableButton}>
                    <Button
                        label={t('egov.create.back')}
                        onClick={() => {
                            navigate('/egov/profile/', { state: { from: location } })
                        }}
                        variant="secondary"
                    />

                    <Button label={t('egov.create.addAttribute')} onClick={() => setOpenAddAttributeModal(true)} />
                </div>
                <AddAttributeModal open={openAddAttributeModal} onClose={() => setOpenAddAttributeModal(false)} entityName={entityName ?? ''} />
            </div>
        </>
    )
}
