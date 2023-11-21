import { AccordionContainer, CheckBox, Table, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ClaimUi } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { useGetRolesByidentityAndOrgannizationHook } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './requestDetail.module.scss'
import { getColumns } from './requestRoleHelper'
import { RequestRolesEditable } from './RequestRolesEditable'

import { IRequestRoleData } from '@/components/containers/ManagementList/RequestList/RequestDetailContainer'

export interface RoleItem {
    uuid: string
    name: string
    description: string
    assignedGroup: string
    check?: boolean
}
export interface RequestRolesFormProps {
    roleData: IRequestRoleData | undefined
    request: ClaimUi | undefined
    isRegistration?: boolean
    handleCanApprove: (rows: Record<string, RoleItem>) => void
}

export const RequestRolesForm: React.FC<RequestRolesFormProps> = ({ roleData, request, handleCanApprove, isRegistration = false }) => {
    const { t } = useTranslation()
    const roleGroupsData = roleData?.roleGroupsData
    const allRolesData = useMemo(() => {
        const roles = roleData?.allRolesData
        if (Array.isArray(roles)) {
            return roles.map((role) => role as RoleItem)
        } else {
            return [roles as RoleItem]
        }
    }, [roleData?.allRolesData])

    const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>({})
    const [rowSelection, setRowSelection] = useState<Record<string, RoleItem>>({})

    const getRoles = useGetRolesByidentityAndOrgannizationHook()

    useEffect(() => {
        const selectedGroupDefault: Record<string, boolean> =
            roleGroupsData?.enumItems?.map((item) => item.code).reduce((o, key) => ({ ...o, [key ?? '']: false }), {}) ?? {}
        setSelectedGroups(selectedGroupDefault)

        if (!isRegistration) {
            getRoles(request?.createdBy || '', request?.po || '').then((res) => {
                const addedRoles: Record<string, RoleItem> = {}
                res.map((role) => {
                    allRolesData?.map((item) => {
                        if (item.uuid === role.uuid) {
                            item.check = true
                            addedRoles[item.uuid ?? ''] = item
                            setRowSelection((prev) => ({ ...prev, [item.uuid ?? '']: item }))
                        }
                    })
                })
                handleCanApprove(addedRoles)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleGroupsData?.enumItems, allRolesData])

    const handleGroupCheckboxChange = useCallback(
        (item: EnumItem) => {
            setSelectedGroups((prev) => {
                const code = item.code ?? ''
                if (prev != null && item.code != null) {
                    return { ...prev, [code]: !prev[code] }
                }
                return {}
            })

            const filteredAllRoles = allRolesData.filter((filterItem) => item.code === filterItem.assignedGroup)
            const reducedFilteredRoles = filteredAllRoles.reduce(
                (o: Record<string, RoleItem>, role) => ({
                    ...o,
                    [role.uuid ?? '']: {
                        uuid: role.uuid ?? '',
                        name: role.name ?? '',
                        description: role.description ?? '',
                        assignedGroup: role.assignedGroup ?? '',
                    },
                }),
                {},
            )

            if (selectedGroups[item.code ?? ''] === false) {
                setRowSelection((prev) => ({ ...prev, ...reducedFilteredRoles }))
                handleCanApprove(reducedFilteredRoles)
            }

            if (selectedGroups[item.code ?? ''] === true) {
                setRowSelection((prev) => {
                    const filteredPrev: Record<string, RoleItem> = {}

                    const reducedKeys = Object.keys(reducedFilteredRoles)

                    for (const key in prev) {
                        if (!reducedKeys.includes(prev[key].uuid)) {
                            filteredPrev[key] = prev[key]
                        }
                    }

                    handleCanApprove(filteredPrev)
                    return filteredPrev
                })
            }
        },
        [allRolesData, handleCanApprove, selectedGroups],
    )

    const handleDeleteRole = (roleId: string) => {
        const filteredRoleList: Record<string, RoleItem> = {}
        for (const key in rowSelection) {
            if (key !== roleId) {
                filteredRoleList[key] = rowSelection[key]
            }
        }

        setRowSelection(filteredRoleList)
        handleCanApprove(filteredRoleList)
    }

    const roleTableData = allRolesData?.map((role) => ({
        uuid: role?.uuid ?? '',
        name: role?.name ?? '',
        description: role?.description ?? '',
        assignedGroup: role?.assignedGroup ?? '',
    }))

    const sections = [
        {
            title: t('managementList.roleGroups'),
            summary: null,
            content: (
                <div className={styles.attributeGridRowBox}>
                    {roleGroupsData?.enumItems?.map((item) => (
                        <CheckBox
                            key={item.id}
                            label={item.value ?? ''}
                            name={item.code ?? ''}
                            id={item.id?.toString() ?? ''}
                            checked={selectedGroups[item.code ?? '']}
                            onChange={() => handleGroupCheckboxChange(item)}
                        />
                    ))}
                </div>
            ),
        },
        {
            title: t('managementList.singleRoles'),
            summary: null,
            content: <Table<RoleItem> data={allRolesData} columns={getColumns(t, rowSelection, setRowSelection, handleCanApprove, roleTableData)} />,
        },
    ]

    return (
        <>
            <TextHeading size="M">{t('requestList.rolesDetail')}</TextHeading>
            <TextBody>{`${t('requestList.poName')}: ${request?.poName}`}</TextBody>
            <AccordionContainer sections={sections} />
            <RequestRolesEditable roles={rowSelection} handleDeleteRole={handleDeleteRole} />
        </>
    )
}
