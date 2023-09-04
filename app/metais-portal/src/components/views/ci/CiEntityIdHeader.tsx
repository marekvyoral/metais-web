import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { Button, ButtonGroupRow, ButtonPopup, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
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
                <Can I={Actions.EDIT} a={`ci.${entityId}`}>
                    <Button
                        label={t('ciType.editButton')}
                        onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                    />
                </Can>
                <ButtonPopup
                    buttonLabel={t('ciType.moreButton')}
                    popupPosition="right"
                    popupContent={() => {
                        return (
                            <div className={styles.buttonLinksDiv}>
                                <ButtonLink label={t('ciType.invalidateItem')} />
                                <ButtonLink label={t('ciType.revalidateItem')} />
                                <Can I={Actions.CHANGE_OWNER} a={`ci.${entityId}`}>
                                    <ButtonLink label={t('ciType.changeOfOwner')} />
                                </Can>
                                <ButtonLink label={t('ciType.besManagement')} />
                            </div>
                        )
                    }}
                />
            </ButtonGroupRow>
        </div>
    )
}
