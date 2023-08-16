import { AccordionContainer, CheckBox, SelectLazyLoading, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from '@tanstack/react-table'
import { EnumItem } from '@isdd/metais-common/api'

import styles from './userView.module.scss'
import { SelectableColumnsSpec } from './userManagementUtils'
import { UserRolesEditable } from './UserRolesEditable'
import { formatOrgData, getDefaultRolesKeys, getLoadOptions, getUniqueUserOrg } from './managementListHelpers'

import { UserDetailData } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserManagementData } from '@/components/containers/ManagementList/UserManagementContainer'
import { useImplicitHierarchy } from '@/hooks/useImplicitHierarchy'

export interface ImplicitHierarchyPagination {
    page: number
    perPage: number
    totalPages: number
    totalItems: number
}

export interface HierarchyItem {
    HIERARCHY_FROM_ROOT: number
    address: {
        number: string
        street: string
        village: string
        zipCode: string
    }
    path: string
    poName: string
    poUUID: string
    roles: unknown[]
}

export interface ImplicitHierarchyData {
    pagination: ImplicitHierarchyPagination
    rights: HierarchyItem[]
}

export interface RoleTable {
    uuid: string
    name: string
    description: string
    assignedGroup: string
    check?: boolean
}

export interface OrgData {
    orgId: string
    orgName: string
    orgStreet: string
    orgVillage: string
    orgZIP: string
    orgNumber: string
    roles: Record<string, RoleTable>
}

interface Props {
    detailData: UserDetailData | undefined | null
    managementData: UserManagementData | undefined
    editedUserOrgAndRoles: Record<string, OrgData>
    setEditedUserOrgAndRoles: React.Dispatch<React.SetStateAction<Record<string, OrgData>>>
    handleBackNavigate: () => void
    isCreate: boolean
    shouldReset: boolean
}

export const UserRolesForm: React.FC<Props> = ({
    detailData,
    managementData,
    editedUserOrgAndRoles,
    setEditedUserOrgAndRoles,
    isCreate,
    shouldReset,
}) => {
    const { t } = useTranslation()

    const { implicitHierarchyData, setFilter } = useImplicitHierarchy()

    const roleGroupsData = managementData?.roleGroupsData
    const allRolesData = managementData?.allRolesData

    const [selectedOrg, setSelectedOrg] = useState<HierarchyItem | null>(null)
    const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>({})
    const [rowSelection, setRowSelection] = useState<Record<string, RoleTable>>({})

    //add to editedUserOrgAndRoles exact roles on checkbox selection
    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            setEditedUserOrgAndRoles((prev) => formatOrgData(prev, selectedOrg, rowSelection))
        }
    }, [rowSelection, selectedOrg, setEditedUserOrgAndRoles])

    //set default selected org if there is no user data
    useEffect(() => {
        if (isCreate) {
            if (implicitHierarchyData?.rights != null) {
                setSelectedOrg(implicitHierarchyData.rights[0] as HierarchyItem)
            }
        }
    }, [implicitHierarchyData?.rights, isCreate])

    //set users default values for rows, organizations, etc.
    useEffect(() => {
        const selectedGroupDefault: Record<string, boolean> =
            roleGroupsData?.enumItems?.map((item) => item.code).reduce((o, key) => ({ ...o, [key ?? '']: false }), {}) ?? {}
        setSelectedGroups(selectedGroupDefault)

        if (!isCreate) {
            const userRelatedRoles = detailData?.userRelatedRoles ?? []

            const uniqueUserOrg = getUniqueUserOrg(detailData?.userOrganizations)

            const firstUserOrg = [...uniqueUserOrg][0]
            const defaultRolesKeys = getDefaultRolesKeys(uniqueUserOrg, detailData?.userOrganizations, userRelatedRoles)
            setSelectedOrg({
                path: firstUserOrg.gid ?? '',
                poName: firstUserOrg.orgName ?? '',
                poUUID: firstUserOrg.orgId ?? '',
                roles: [],
                HIERARCHY_FROM_ROOT: -1,
                address: {
                    number: firstUserOrg.orgNumber ?? '',
                    zipCode: firstUserOrg.orgZIP ?? '',
                    street: firstUserOrg.orgStreet ?? '',
                    village: firstUserOrg.orgVillage ?? '',
                },
            })
            setRowSelection(defaultRolesKeys[firstUserOrg.orgId ?? ''].roles)
            setEditedUserOrgAndRoles({ ...defaultRolesKeys })
        }
    }, [detailData, isCreate, roleGroupsData, setEditedUserOrgAndRoles, shouldReset])

    //handle clicking on group checkboxes
    const handleGroupCheckboxChange = (item: EnumItem) => {
        setSelectedGroups((prev) => {
            const code = item.code ?? ''
            if (prev != null && item.code != null) {
                return { ...prev, [code]: !prev[code] }
            }
            return {}
        })

        if (Array.isArray(allRolesData)) {
            const filteredAllRoles = allRolesData.filter((filterItem) => item.code === filterItem.assignedGroup)
            const reducedFilteredRoles = filteredAllRoles.reduce(
                (o: Record<string, RoleTable>, role) => ({
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
            //set roles
            if (selectedGroups[item.code ?? ''] === false) {
                setEditedUserOrgAndRoles((prev) => formatOrgData(prev, selectedOrg, reducedFilteredRoles))
                setRowSelection((prev) => ({ ...prev, ...reducedFilteredRoles }))
            }

            //filter roles
            if (selectedGroups[item.code ?? ''] === true) {
                setEditedUserOrgAndRoles((prev) => {
                    const filteredPrev: Record<string, RoleTable> = {}
                    const reducedKeys = Object.keys(reducedFilteredRoles)
                    for (const key in prev[selectedOrg?.poUUID ?? ''].roles) {
                        if (!reducedKeys.includes(key)) {
                            filteredPrev[key] = prev[selectedOrg?.poUUID ?? ''].roles[key]
                        }
                    }

                    if (Object.keys(filteredPrev).length > 0) {
                        return formatOrgData(prev, selectedOrg, filteredPrev)
                    } else {
                        const filteredPrevOrg: Record<string, OrgData> = {}
                        for (const key in prev) {
                            if (prev[key].orgId != selectedOrg?.poUUID) {
                                filteredPrevOrg[key] = prev[key]
                            }
                        }
                        return filteredPrevOrg
                    }
                })
                setRowSelection((prev) => {
                    const filteredPrev: Record<string, RoleTable> = {}
                    const reducedKeys = Object.keys(reducedFilteredRoles)
                    for (const key in prev) {
                        if (!reducedKeys.includes(prev[key].uuid)) {
                            filteredPrev[key] = prev[key]
                        }
                    }
                    return filteredPrev
                })
            }
        }
    }

    //handle change of selected organisation
    const handleSelectedOrganizationChange = (value: HierarchyItem) => {
        setSelectedOrg(value)
        setSelectedGroups((prev) => {
            const acc: Record<string, boolean> = {}
            for (const key in prev) {
                acc[key] = false
            }
            return acc
        })
        setRowSelection({})
        if (Object.keys(editedUserOrgAndRoles[value.poUUID]).length > 0) {
            setRowSelection(editedUserOrgAndRoles[value.poUUID].roles)
        }
        return
    }

    //handle delete click in role list
    const handleDeleteRole = (roleId: string, orgId: string) => {
        const filteredRoleList: Record<string, RoleTable> = {}
        for (const key in editedUserOrgAndRoles[orgId].roles) {
            if (key !== roleId) {
                filteredRoleList[key] = editedUserOrgAndRoles[orgId].roles[key]
            }
        }

        setEditedUserOrgAndRoles((prev) => {
            if (Object.keys(filteredRoleList).length > 0) {
                return { ...prev, [orgId]: { ...prev[orgId], roles: filteredRoleList } }
            } else {
                const filteredOrgList: Record<string, OrgData> = {}
                for (const key in prev) {
                    if (key !== orgId) {
                        filteredOrgList[key] = editedUserOrgAndRoles[orgId]
                    }
                }
                return filteredOrgList
            }
        })

        if (selectedOrg?.poUUID == orgId) {
            setRowSelection(filteredRoleList)
        }
    }

    //load options for lazy select
    const loadOptions = getLoadOptions(setFilter, detailData?.userOrganizations, implicitHierarchyData?.rights as HierarchyItem[])
    const isRowSelected = (row: Row<RoleTable>) => {
        return row.original.uuid ? !!rowSelection[row.original.uuid] : false
    }

    //table data and sections
    const roleTableData = Array.isArray(allRolesData)
        ? allRolesData?.map((role) => ({
              uuid: role.uuid ?? '',
              name: role.name ?? '',
              description: role.description ?? '',
              assignedGroup: role.assignedGroup ?? '',
          }))
        : [
              {
                  uuid: allRolesData?.uuid ?? '',
                  name: allRolesData?.name ?? '',
                  description: allRolesData?.description ?? '',
                  assignedGroup: allRolesData?.assignedGroup ?? '',
              },
          ]
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
            content: (
                <Table<RoleTable>
                    data={roleTableData}
                    columns={SelectableColumnsSpec(t, rowSelection, setRowSelection, roleTableData)}
                    isRowSelected={isRowSelected}
                />
            ),
        },
    ]

    return (
        <>
            <TextHeading size="L">{t('managementList.giveRolesToUserHeading')}</TextHeading>
            <SelectLazyLoading
                option={undefined}
                value={selectedOrg}
                getOptionLabel={(item) => item.poName ?? ''}
                getOptionValue={(item) => item.poUUID ?? ''}
                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                label={t('managementList.publicAuthority')}
                name="public-authority"
                onChange={(val) => handleSelectedOrganizationChange(Array.isArray(val) ? val[0] : val)}
            />
            <AccordionContainer sections={sections} />
            <UserRolesEditable editedUserOrgAndRoles={editedUserOrgAndRoles} handleDeleteRole={handleDeleteRole} />
        </>
    )
}