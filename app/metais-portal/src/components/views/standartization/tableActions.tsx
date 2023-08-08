import { Button, ButtonGroupRow, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { FindRelatedIdentitiesAndCountParams, useFindMembershipData } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import styles from './styles.module.scss'
import { canUserSendEmails, isUserAdmin, sendBatchEmail } from './standartizationUtils'

import { TableData } from '@/pages/standardization/groupdetail/[id]'

interface KSIVSTAbleActionsProps {
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: (value: React.SetStateAction<FindRelatedIdentitiesAndCountParams>) => void
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    userRoles: string[] | undefined
    selectedRows: Record<string, TableData>
    groupUuid?: string
}
const KSIVSTableActions: React.FC<KSIVSTAbleActionsProps> = ({ listParams, setListParams, setAddModalOpen, userRoles, selectedRows, groupUuid }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const { data: isMemberData } = useFindMembershipData(user?.uuid ?? '')
    const isMember = isMemberData?.membershipData?.find((item) => item.groupUuid == groupUuid)
    return (
        <>
            <ButtonGroupRow>
                <Button label={t('KSIVSPage.export')} variant="secondary" disabled />
                {(canUserSendEmails(userRoles) || isUserAdmin(userRoles)) && (
                    <Button
                        label={t('KSIVSPage.sendEmail')}
                        variant="secondary"
                        disabled={Object.keys(selectedRows).length <= 0 || !isMember}
                        onClick={() => sendBatchEmail(selectedRows)}
                    />
                )}
                {isUserAdmin(userRoles) && <Button label={'+ ' + t('KSIVSPage.addMember')} onClick={() => setAddModalOpen(true)} />}
                <TextBody className={styles.marginLeftAuto}>{t('KSIVSPage.display')}</TextBody>
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
                />{' '}
                <TextBody>{t('KSIVSPage.showRecords')}</TextBody>
            </ButtonGroupRow>
        </>
    )
}
export default KSIVSTableActions
