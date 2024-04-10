import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalButtons } from '@isdd/metais-common/index'
import { AccordionContainer, CheckBox, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { FindAll11200 } from '@isdd/metais-common/api/generated/iam-swagger'
import { EnumItem, EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import isEmpty from 'lodash/isEmpty'
import { Row } from '@tanstack/react-table'
import { HierarchyRightsResultUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

import styles from './selectPoAndRolesModal.module.scss'
import { OrgData, RoleTable } from './UserRolesForm'
import { SelectableColumnsSpec } from './userManagementUtils'
import { formatOrgData } from './managementListHelpers'

interface ISelectPoAndRolesModalProps {
    isOpen: boolean
    className?: string
    close: () => void
    isError?: boolean
    updatePOid?: string
    allRolesData?: FindAll11200 | undefined
    roleGroupsData?: EnumType | undefined
    setEditedUserOrgAndRoles: React.Dispatch<React.SetStateAction<Record<string, OrgData>>>
    implicitHierarchyData?: HierarchyRightsResultUi | undefined
    editedUserOrgAndRoles: Record<string, OrgData>
}

export const SelectPoAndRolesModal: React.FC<ISelectPoAndRolesModalProps> = ({
    isOpen,
    close,
    updatePOid,
    implicitHierarchyData,
    allRolesData,
    roleGroupsData,
    setEditedUserOrgAndRoles,
    editedUserOrgAndRoles,
}) => {
    const { t } = useTranslation()

    const [selectedPo, setSelectedPo] = useState(updatePOid)
    const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>({})
    const [rowSelection, setRowSelection] = useState<Record<string, RoleTable>>({})
    const closeModal = () => {
        setSelectedGroups({})
        setRowSelection({})
        setSelectedPo(undefined)
        close()
    }

    useEffect(() => {
        setSelectedPo(updatePOid)
        if (updatePOid && editedUserOrgAndRoles[updatePOid]) {
            const roleKeys = Object.keys(editedUserOrgAndRoles[updatePOid].roles)
            const reducedFilteredRoles = roleKeys.reduce(
                (o: Record<string, RoleTable>, role) => ({
                    ...o,
                    [editedUserOrgAndRoles[updatePOid].roles[role].uuid ?? '']: {
                        uuid: editedUserOrgAndRoles[updatePOid].roles[role].uuid ?? '',
                        name: editedUserOrgAndRoles[updatePOid].roles[role].name ?? '',
                        description: editedUserOrgAndRoles[updatePOid].roles[role].description ?? '',
                        assignedGroup: editedUserOrgAndRoles[updatePOid].roles[role].assignedGroup ?? '',
                    },
                }),
                {},
            )
            setRowSelection(reducedFilteredRoles)
            const selectedGroupDefault: Record<string, boolean> =
                roleGroupsData?.enumItems
                    ?.map((item) => item.code)
                    .reduce((o, key) => {
                        if (allRolesData && Array.isArray(allRolesData)) {
                            const groupRolesLength = allRolesData.filter((role) => role.assignedGroup === key).length
                            const userGroupRoleLength = roleKeys?.filter(
                                (role) => editedUserOrgAndRoles[updatePOid].roles[role].assignedGroup === key,
                            ).length
                            return { ...o, [key ?? '']: groupRolesLength === userGroupRoleLength }
                        }

                        return { ...o, [key ?? '']: false }
                    }, {}) ?? {}
            setSelectedGroups(selectedGroupDefault)
        }
    }, [allRolesData, editedUserOrgAndRoles, roleGroupsData?.enumItems, updatePOid])

    const optionsPo = useMemo(() => {
        if (Array.isArray(implicitHierarchyData?.rights)) {
            return implicitHierarchyData?.rights
                ?.filter((po) => !editedUserOrgAndRoles[po.poUUID ?? ''] || updatePOid === po.poUUID)
                .map((po) => ({
                    value: `${po.poUUID}`,
                    label: `${po.poName}`,
                }))
        }
        return []
    }, [editedUserOrgAndRoles, implicitHierarchyData?.rights, updatePOid])

    const validationError = useMemo(() => {
        return isEmpty(selectedPo) !== isEmpty(rowSelection)
    }, [rowSelection, selectedPo])

    const isRowSelected = (row: Row<RoleTable>) => {
        return row.original.uuid ? !!rowSelection[row.original.uuid] : false
    }

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
            if (!selectedGroups[item.code ?? '']) {
                setRowSelection((prev) => ({ ...prev, ...reducedFilteredRoles }))
            }

            //filter roles
            if (selectedGroups[item.code ?? ''] === true) {
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

    const handleSubmit = () => {
        const selectedOrg = implicitHierarchyData?.rights?.find((org) => org.poUUID === selectedPo)
        if (selectedOrg) setEditedUserOrgAndRoles((prev) => formatOrgData(prev, selectedOrg, rowSelection))
    }

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
        <BaseModal isOpen={isOpen} close={closeModal}>
            {updatePOid ? (
                <TextHeading size={'L'} className={styles.heading}>
                    {t('managementList.updatePoModal')}
                </TextHeading>
            ) : (
                <TextHeading size={'L'} className={styles.heading}>
                    {t('managementList.addNewPo')}
                </TextHeading>
            )}
            <SimpleSelect
                label={t('managementList.publicAuthority')}
                name="public-authority"
                options={optionsPo ?? []}
                disabled={!!updatePOid}
                isClearable={false}
                onChange={(value) => setSelectedPo(value)}
                value={updatePOid}
                hint={t('managementList.poHint')}
            />
            {selectedPo && <AccordionContainer sections={sections} />}

            <ModalButtons
                onClose={closeModal}
                submitButtonLabel={t('selectPoAndRolesModal.save')}
                onSubmit={() => {
                    handleSubmit()
                    closeModal()
                }}
                disabled={validationError || !selectedPo}
            />
        </BaseModal>
    )
}
