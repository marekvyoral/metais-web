import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button, ButtonGroupRow, ButtonPopup, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './ciEntityHeader.module.scss'

interface Props {
    entityName: string
    entityId: string
    entityItemName: string
}

export const CiEntityIdHeader: React.FC<Props> = ({ entityName, entityId, entityItemName }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <div className={styles.headerDiv}>
            <TextHeading size="XL">{entityItemName}</TextHeading>
            <ButtonGroupRow>
                <Button label={t('ciType.editButton')} onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })} />
                <ButtonPopup
                    buttonLabel={t('ciType.moreButton')}
                    popupPosition="right"
                    popupContent={() => {
                        return (
                            <div className={styles.buttonLinksDiv}>
                                <ButtonLink label={t('ciType.invalidateItem')} />
                                <ButtonLink label={t('ciType.revalidateItem')} />
                                <ButtonLink label={t('ciType.changeOfOwner')} />
                                <ButtonLink label={t('ciType.besManagement')} />
                            </div>
                        )
                    }}
                />
            </ButtonGroupRow>
        </div>
    )
}
