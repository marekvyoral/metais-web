import { BaseModal, Button, MultiSelect, TextHeading } from '@isdd/idsk-ui-kit'
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { PO } from '@isdd/metais-common/constants'
import { ModalButtons, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IChangeRoleItem {
    uuidPo: string | undefined
    roles: string[] | undefined
}
export interface IChangeRoleModalProps {
    isOpen: boolean
    addRoles: (result: IChangeRoleItem, allRolesData: FindAll11200) => void
    removeRoles: (result: IChangeRoleItem, allRolesData: FindAll11200) => void
    close: () => void
}

export interface RoleTable {
    uuid: string
    name: string
    description: string
    assignedGroup: string
    check?: boolean
}

export const ChangeRoleModal: React.FC<IChangeRoleModalProps> = ({ isOpen, close, addRoles, removeRoles }) => {
    const { t } = useTranslation()
    const { data: allRolesData, isLoading: isAllRolesLoading, isError: isAllRolesError } = useFindAll11()
    const [selectedPO, setSelectedPO] = useState<string | undefined>()
    const [selectedRoles, setSelectedRoles] = useState<string[] | undefined>()

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

    return (
        <BaseModal isOpen={isOpen} close={close}>
            <QueryFeedback loading={isAllRolesLoading} error={isAllRolesError} withChildren>
                <TextHeading size="L">{t('userManagement.changeRoles')}</TextHeading>
                <SelectPOForFilter
                    isMulti={false}
                    ciType={PO}
                    label={t('userManagement.organizationUnit')}
                    name="owner"
                    valuesAsUuids={[]}
                    onChange={(val) => setSelectedPO(val?.[0]?.uuid ?? '')}
                />
                <MultiSelect
                    label={t('userManagement.individualsRoles')}
                    name={'role'}
                    options={roleTableData?.map((item) => ({ label: item.description, value: item.uuid })) ?? []}
                    onChange={(val) => setSelectedRoles(val)}
                />
                <ModalButtons
                    additionalButtons={[
                        <Button
                            key={'addRoles'}
                            label={t('userManagement.addRoles')}
                            onClick={() => addRoles({ uuidPo: selectedPO, roles: selectedRoles }, allRolesData ?? [])}
                        />,
                        <Button
                            key={'removeRoles'}
                            label={t('userManagement.removeRoles')}
                            onClick={() => removeRoles({ uuidPo: selectedPO, roles: selectedRoles }, allRolesData ?? [])}
                        />,
                    ]}
                    closeButtonLabel={t('actionsInTable.cancel')}
                    onClose={close}
                />
            </QueryFeedback>
        </BaseModal>
    )
}
