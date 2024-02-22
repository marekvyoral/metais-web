import { BreadCrumbs, Button, ButtonLink, ButtonPopup, CheckBox, HomeIcon, Input, Table, TextHeading } from '@isdd/idsk-ui-kit'
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
import { ObjectSchema, lazy, number, object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { TFunction } from 'i18next'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'

import { MoreActionsColumn } from './actions/MoreActionsColumn'
import { AddAttributeModal } from './attributes/AddAttributeModal'

import styles from '@/components/views/egov/detailViews.module.scss'
import { IProfileDetailContainerView } from '@/components/containers/Egov/Profile/ProfileDetailContainer'
import { BasicInformation } from '@/components/views/egov/BasicInformation'

interface AttrSchemaObject {
    name: string
    engName: string
    description: string
    engDescription: string
    order: number | undefined
    defaultValue: string | undefined
}

const getProfileAttributeSchema = (t: TFunction) => {
    return object({
        attributes: lazy((obj) => {
            const shape: {
                [key: string]: ObjectSchema<AttrSchemaObject>
            } = {}

            Object.keys(obj).forEach((key) => {
                shape[key] = object({
                    name: string().required(t('egov.profile.nameError')),
                    description: string().required(t('egov.profile.descriptionError')),
                    engName: string().required(t('egov.profile.engNameError')),
                    engDescription: string().required(t('egov.profile.engDescriptionError')),
                    order: number(),
                    defaultValue: string().transform((value) => (value === null ? '' : value)),
                })
            })

            return object().shape(shape)
        }),
    })
}

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
}: IProfileDetailContainerView<T>) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) scrollToMutationFeedback()
    }, [isActionSuccess, scrollToMutationFeedback])
    const location = useLocation()
    const { openAddAttributeModal, setOpenAddAttributeModal } = openAddAttribudeModalState
    const [sort, setSort] = useState<ColumnSort[]>([])
    const [selectedRows, setSelectedRows] = useState<Array<number>>([])
    const createDefaultData = (): {
        [x: string]: Attribute
    } => {
        const result = profileData?.attributes?.reduce((acc, attr) => {
            return { ...acc, [attr.id ?? 0]: attr }
        }, {})
        return result as { [x: string]: Attribute }
    }
    const attributes = createDefaultData()

    const { register, getValues, formState, setValue, reset, trigger } = useForm({
        resolver: yupResolver(getProfileAttributeSchema(t)),
        defaultValues: { attributes },
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

    useEffect(() => {
        reset({
            attributes,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData?.attributes])

    const handleSaveAttribute = async (attrId: number | undefined, row: Row<Attribute>) => {
        if (attrId) {
            const editedData = getValues(`attributes.${attrId}`)
            const originalRow = row.original
            const editedAttribute = { ...originalRow, ...editedData }

            if (!editedAttribute.order) {
                const findAttWithHighestOrderExceptCurrent = () => {
                    return Math.max(
                        ...(profileData?.attributes?.filter((att) => att.technicalName != originalRow.technicalName).map((att) => att.order ?? 0) ??
                            []),
                    )
                }
                const highestCurrentOrder = findAttWithHighestOrderExceptCurrent()
                editedAttribute.order = highestCurrentOrder + 1
                setValue(`attributes.${attrId}.order`, editedAttribute.order)
            }

            const isValid = await trigger(`attributes.${attrId}`)

            if (isValid) {
                await saveAttribute?.(editedAttribute as T)
                cancelEditing(attrId)
            }
        }
    }

    const columns: Array<ColumnDef<Attribute>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            size: 200,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        defaultValue={ctx?.getValue?.()?.toString()}
                        {...register(`attributes.${ctx?.row?.original.id ?? 0}.name`)}
                        error={formState.errors.attributes?.[`${ctx?.row?.original.id ?? 0}`]?.name?.message}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engName'),
            accessorFn: (row) => row?.engName,
            size: 200,
            enableSorting: true,
            id: 'engName',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        defaultValue={ctx?.getValue?.()?.toString()}
                        {...register(`attributes.${ctx?.row?.original.id ?? 0}.engName`)}
                        name={`attributes.${ctx?.row?.original.id ?? 0}.engName`}
                        error={formState.errors.attributes?.[ctx?.row?.original.id ?? 0]?.engName?.message}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.description'),
            accessorFn: (row) => row?.description,
            size: 200,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        defaultValue={ctx?.getValue?.()?.toString()}
                        {...register(`attributes.${ctx?.row?.original.id ?? 0}.description`)}
                        error={formState.errors.attributes?.[`${ctx?.row?.original.id ?? 0}`]?.description?.message}
                    />
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
        {
            header: t('egov.engDescription'),
            accessorFn: (row) => row?.engDescription,
            size: 200,
            enableSorting: true,
            id: 'engDescription',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                isRowSelected(ctx?.row?.original.id, selectedRows) ? (
                    <Input
                        defaultValue={ctx?.getValue?.()?.toString()}
                        {...register(`attributes.${ctx?.row?.original.id ?? 0}.engDescription`)}
                        error={formState.errors.attributes?.[`${ctx?.row?.original.id ?? 0}`]?.engDescription?.message}
                    />
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
            size: 200,
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
                        <ButtonPopup
                            popupPosition="right"
                            buttonLabel={t('actionsInTable.moreActions')}
                            popupContent={(closePopup) => {
                                return (
                                    <div className={styles.actions}>
                                        <ButtonLink
                                            onClick={() => {
                                                handleSaveAttribute(ctx?.row?.original?.id, ctx.row)
                                                closePopup()
                                            }}
                                            label={t('actionsInTable.save')}
                                        />
                                        <ButtonLink
                                            onClick={() => {
                                                reset()
                                                cancelEditing(ctx?.row?.original?.id)
                                                closePopup()
                                            }}
                                            label={t('actionsInTable.cancel')}
                                        />
                                    </div>
                                )
                            }}
                        />
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
                            <TextHeading size="XL">{`${t('egov.detail.profileAttributesHeading')} - ${profileData?.name}`}</TextHeading>
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
                    <TextHeading size="M">{t('egov.detail.profileAttributes')}</TextHeading>
                    <Table columns={columns} data={profileData?.attributes ?? []} manualSorting={false} sort={sort} onSortingChange={setSort} />
                    <div className={styles.underTableButton}>
                        <Button
                            label={t('egov.create.back')}
                            onClick={() => {
                                navigate('/egov/profile/', { state: { from: location } })
                            }}
                            variant="secondary"
                        />
                        {profileData?.type !== AttributeProfileType.system && (
                            <Button label={t('egov.create.addAttribute')} onClick={() => setOpenAddAttributeModal(true)} />
                        )}
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
