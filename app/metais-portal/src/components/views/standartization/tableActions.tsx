import { Button, ButtonGroupRow, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { FindRelatedIdentitiesAndCountParams } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'

import styles from './styles.module.scss'
import { canUserSendEmails, isUserAdmin, sendBatchEmail } from './standartizationUtils'

import { TableData } from '@/pages/standardization/groupdetail/[id]'

interface KSIVSTAbleActionsProps {
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: (value: React.SetStateAction<FindRelatedIdentitiesAndCountParams>) => void
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    userRoles: string[] | undefined
    selectedRows: Record<string, TableData>
}
const KSIVSTableActions: React.FC<KSIVSTAbleActionsProps> = ({ listParams, setListParams, setAddModalOpen, userRoles, selectedRows }) => {
    return (
        <>
            <ButtonGroupRow>
                <Button label="Export" variant="secondary" disabled />
                {canUserSendEmails(userRoles) && (
                    <Button
                        label="Poslať email"
                        variant="secondary"
                        disabled={Object.keys(selectedRows).length <= 0}
                        onClick={() => sendBatchEmail(selectedRows)}
                    />
                )}
                {isUserAdmin(userRoles) && <Button label="+ Pridať člena" onClick={() => setAddModalOpen(true)} />}
                <TextBody className={styles.marginLeftAuto}>Zobrazit</TextBody>
                <SimpleSelect
                    onChange={(label) => {
                        setListParams({ ...listParams, perPage: label.target.value })
                    }}
                    id="select"
                    label=""
                    options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ]}
                />
            </ButtonGroupRow>
        </>
    )
}
export default KSIVSTableActions
