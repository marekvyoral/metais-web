import React, { useState } from 'react'
import { Button, CheckBox, Table } from '@isdd/idsk-ui-kit'
import { Attribute } from '@isdd/metais-common/api'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import BasicInformations from '../BasicInformations'
import styles from '../detailViews.module.scss'

import AddAttributeModal from './AddAttributeModal'

import { IAtrributesContainerView } from '@/components/containers/Egov/Profile/ProfileDetailContainer'

export const ProfileDetailView = ({
    data: { ciTypeData, constraintsData, unitsData },
    setValidityOfProfile,
    entityName,
}: IAtrributesContainerView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [openAddAttributeModal, setOpenAddAttributeModal] = useState(false)
    const columns: Array<ColumnDef<Attribute>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.engName'),
            accessorFn: (row) => row?.engName,
            enableSorting: true,
            id: 'engName',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('egov.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        // {
        //     header: t('egov.engDescription'),
        //     accessorFn: (row) => row?.engDescription,
        //     enableSorting: true,
        //     id: 'engDescription',
        //     cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        // },
        {
            header: t('egov.order'),
            accessorFn: (row) => row?.order,
            enableSorting: true,
            id: 'order',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
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
            header: t('egov.invisible'),
            accessorFn: (row) => row?.invisible,
            id: 'invisible',
            cell: (row) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox label={row.getValue() as string} name="checkbox" disabled checked={!row?.getValue()} id="invisible" />
                </div>
            ),
        },
        // {
        //     header: t('egov.defaultValue'),
        //     accessorFn: (row) => row?.defaultValue,
        //     enableSorting: true,
        //     id: 'defaultValue',
        //     cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        // },
    ]

    return (
        <>
            <div className={styles.basicInformationSpace}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 className="govuk-heading-l">{t('egov.detail.profileAttributesHeading')}</h2>
                    <div>
                        <Button
                            label="zmenit"
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
                <Button label="pridanie attributu" onClick={() => setOpenAddAttributeModal(true)} />
                <AddAttributeModal open={openAddAttributeModal} onClose={() => setOpenAddAttributeModal(false)} entityName={entityName ?? ''} />
            </div>
        </>
    )
}
