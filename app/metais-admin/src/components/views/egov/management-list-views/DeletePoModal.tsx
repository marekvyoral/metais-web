import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ModalButtons } from '@isdd/metais-common/index'
import { TextBody } from '@isdd/idsk-ui-kit/index'

import styles from './selectPoAndRolesModal.module.scss'
import { OrgData } from './UserRolesForm'

interface IDeletePoModalProps {
    deletedPo: OrgData | undefined
    className?: string
    close: () => void
    handleDeleteOrg: (id: string) => void
}

export const DeletePoModal: React.FC<IDeletePoModalProps> = ({ deletedPo, close, handleDeleteOrg }) => {
    const { t } = useTranslation()

    return (
        <BaseModal isOpen={!!deletedPo} close={close}>
            <TextHeading size={'L'} className={styles.heading}>
                {`${t('deletePoModal.header')} ${deletedPo?.orgName}`}
            </TextHeading>
            <TextBody>{t('deletePoModal.text')}</TextBody>
            <ModalButtons
                onClose={close}
                submitButtonLabel={t('deletePoModal.remove')}
                onSubmit={() => {
                    if (deletedPo?.orgId) handleDeleteOrg(deletedPo?.orgId)
                    close()
                }}
            />
        </BaseModal>
    )
}
