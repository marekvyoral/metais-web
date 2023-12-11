import { BreadCrumbs, Button, CheckBox, HomeIcon, Input, Table } from '@isdd/idsk-ui-kit'
import { MutationFeedback, QueryFeedback, isRowSelected } from '@isdd/metais-common'
import { Attribute, AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { HTML_TYPE } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { MoreActionsColumn } from './actions/MoreActionsColumn'
import { AddAttributeModal } from './attributes/AddAttributeModal'

import styles from '@/components/views/egov/detailViews.module.scss'
import { IAttributesContainerView } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { BasicInformation } from '@/components/views/egov/BasicInformation'

export const ProfileDetailView = <T,>({
    data: { profileData, constraintsData, unitsData },
    setValidityOfProfile,
    entityName,
    saveAttribute,
    setValidityOfAttributeProfile,
    setVisibilityOfAttributeProfile,
    openAddAttribudeModalState,
    refetch,
    isLoading,
    isError,
    roles,
}: IAttributesContainerView<T>) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])
    const location = useLocation()
    const { openAddAttributeModal, setOpenAddAttributeModal } = openAddAttribudeModalState
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const { register, getValues } = useForm({
        defaultValues: {
            attributes: profileData?.attributes ?? [],
        },
    })

    const editRow = useCallback(
        (attrId: number) => {
            setIsActionSuccess({ value: false, path: `${AdminRouteNames.EGOV_PROFILE}/${entityName}` })
            setSelectedRows([...selectedRows, attrId])
        },
        [setIsActionSuccess, entityName, selectedRows],
    )

    const cancelEditing = useCallback(
        (attrId: number | undefined) => {
            setSelectedRows([...(selectedRows?.filter((index) => index !== attrId) ?? [])])
        },
        [selectedRows],
    )

    const handleSaveAttribute = useCallback(
        async (attrId: number | undefined, row: Row<Attribute>) => {
            if (attrId) {
                const editedData = getValues(`attributes.${attrId}`)

                const originalRow = row.original

                const editedAttribute = { ...originalRow, ...editedData }
                await saveAttribute?.(editedAttribute as T)

                cancelEditing(attrId)
            }
        },
        [getValues, saveAttribute, cancelEditing],
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
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.original.id ?? 0}.name`)} />
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
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.original.id ?? 0}.engName`)} />
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
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.original.id ?? 0}.description`)} />
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
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.original.id ?? 0}.engDescription`)} />
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
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input defaultValue={Number(ctx?.getValue?.())} type="number" {...register(`attributes.${ctx?.row?.original.id ?? 0}.order`)} />
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
            header: t('egov.mandatory'),
            accessorFn: (row) => row?.mandatory,
            enableSorting: true,
            id: 'mandatory',
            cell: (ctx) => <span>{ctx.row?.original?.mandatory?.type === 'critical' ? t('yes') : t('no')}</span>,
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
                    return (
                        <Input defaultValue={ctx?.getValue?.()?.toString()} {...register(`attributes.${ctx?.row?.original.id ?? 0}.defaultValue`)} />
                    )
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
                } else if (isRowSelected(ctx?.row?.original?.id ?? 0, selectedRows)) {
                    return (
                        <div className={styles.actions}>
                            <Button onClick={() => handleSaveAttribute(ctx?.row?.original?.id, ctx.row)} label={t('actionsInTable.save')} />
                            <Button onClick={() => cancelEditing(ctx?.row?.original?.id)} label={t('actionsInTable.cancel')} />
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
                            profile={profileData}
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
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <div className={styles.basicInformationSpace}>
                    <FlexColumnReverseWrapper>
                        <div className={styles.flexBetween}>
                            <h2 className="govuk-heading-l">{t('egov.detail.profileAttributesHeading')}</h2>
                            <div className={styles.generalActions}>
                                <Button
                                    label={t('egov.edit')}
                                    onClick={() => {
                                        navigate('/egov/profile/' + profileData?.technicalName + '/edit', { state: { from: location } })
                                    }}
                                    disabled={profileData?.type === AttributeProfileType.system}
                                />
                                <Button
                                    label={profileData?.valid ? t('egov.detail.validityChange.setInvalid') : t('egov.detail.validityChange.setValid')}
                                    onClick={() => setValidityOfProfile(profileData?.technicalName)}
                                    disabled={profileData?.type !== AttributeProfileType.custom}
                                />
                            </div>
                        </div>
                        <div ref={wrapperRef}>
                            {isActionSuccess.value && (
                                <MutationFeedback
                                    successMessage={
                                        isActionSuccess.additionalInfo?.type === 'edit'
                                            ? isActionSuccess.additionalInfo?.entity === 'attribute'
                                                ? t('mutationFeedback.attrSuccessfulUpdated')
                                                : t('mutationFeedback.successfulUpdated')
                                            : isActionSuccess.additionalInfo?.entity === 'attribute'
                                            ? t('mutationFeedback.attrSuccessfulCreated')
                                            : t('mutationFeedback.successfulCreated')
                                    }
                                    success={isActionSuccess.value}
                                    error={false}
                                />
                            )}
                        </div>
                    </FlexColumnReverseWrapper>
                    <BasicInformation data={{ ciTypeData: profileData, constraintsData, unitsData }} roles={roles} />
                </div>
                <div>
                    <h3 className="govuk-heading-m">{t('egov.detail.profileAttributes')}</h3>
                    <Table columns={columns} data={profileData?.attributes ?? []} />
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
                    <AddAttributeModal
                        refetch={refetch}
                        open={openAddAttributeModal}
                        onClose={() => setOpenAddAttributeModal(false)}
                        entityName={entityName ?? ''}
                    />
                </div>
            </QueryFeedback>
        </>
    )
}
