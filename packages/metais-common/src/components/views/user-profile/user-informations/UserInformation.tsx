import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/index'

import styles from './userInformation.module.scss'

import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { NULL } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

type Props = {
    setIsEditable: Dispatch<SetStateAction<boolean>>
    setIsChangeSuccess: Dispatch<SetStateAction<boolean>>
}

export const UserInformation: React.FC<Props> = ({ setIsEditable, setIsChangeSuccess }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()

    return (
        <>
            <div className={styles.justifyEndDiv}>
                <Button
                    variant="secondary"
                    label={t('userProfile.changeInformationsButton')}
                    onClick={() => {
                        setIsEditable(true)
                        setIsChangeSuccess(false)
                    }}
                />
            </div>
            <DefinitionList>
                <InformationGridRow label={t('userProfile.information.name')} value={user?.displayName ?? ''} hideIcon />
                <InformationGridRow
                    label={t('userProfile.information.position')}
                    value={user?.position != NULL ? user?.position ?? '' : ''}
                    hideIcon
                />
                <InformationGridRow label={t('userProfile.information.phoneNumber')} value={user?.phone ?? ''} hideIcon />
                <InformationGridRow label={t('userProfile.information.email')} value={user?.email ?? ''} hideIcon href={`mailto:${user?.email}`} />
            </DefinitionList>
        </>
    )
}
