import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { UserRolesEditable } from './UserRolesEditable'
import { getDefaultRolesKeys, getUniqueUserOrg } from './managementListHelpers'
import { SelectPoAndRolesModal } from './SelectPoAndRolesModal'

import { UserDetailData } from '@/components/containers/ManagementList/UserDetailContainer'
import { UserManagementData } from '@/components/containers/ManagementList/UserManagementContainer'
import { useImplicitHierarchy } from '@/hooks/useImplicitHierarchy'

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

    const { implicitHierarchyData } = useImplicitHierarchy()

    const roleGroupsData = managementData?.roleGroupsData
    const allRolesData = managementData?.allRolesData
    const [modalOpen, setModalOpen] = useState(false)
    const [updatePOid, setUpdatePOid] = useState('')

    const openModal = (id: string) => {
        setUpdatePOid(id)
        setModalOpen(true)
    }

    const onClose = () => {
        setUpdatePOid('')
        setModalOpen(false)
    }

    //set users default values for rows, organizations, etc.
    useEffect(() => {
        if (!isCreate) {
            const userRelatedRoles = detailData?.userRelatedRoles ?? []
            const uniqueUserOrg = getUniqueUserOrg(detailData?.userOrganizations)
            const defaultRolesKeys = getDefaultRolesKeys(uniqueUserOrg, detailData?.userOrganizations, userRelatedRoles)

            setEditedUserOrgAndRoles({ ...defaultRolesKeys })
        }
    }, [detailData, isCreate, managementData?.allRolesData, roleGroupsData, setEditedUserOrgAndRoles, shouldReset])

    const handleDeleteOrg = (id: string) => {
        setEditedUserOrgAndRoles((prev) => {
            const newOrgAndRoles = { ...prev }
            delete newOrgAndRoles[id]
            return newOrgAndRoles
        })
    }

    return (
        <>
            <TextHeading size="L">{t('managementList.giveRolesToUserHeading')}</TextHeading>
            <Button
                label={t('managementList.addNewPo')}
                onClick={() => {
                    openModal('')
                }}
            />
            <SelectPoAndRolesModal
                isOpen={modalOpen}
                close={onClose}
                updatePOid={updatePOid}
                implicitHierarchyData={implicitHierarchyData}
                allRolesData={allRolesData}
                roleGroupsData={roleGroupsData}
                setEditedUserOrgAndRoles={setEditedUserOrgAndRoles}
                editedUserOrgAndRoles={editedUserOrgAndRoles}
            />

            <UserRolesEditable editedUserOrgAndRoles={editedUserOrgAndRoles} handleDeleteOrg={handleDeleteOrg} openModal={openModal} />
        </>
    )
}
