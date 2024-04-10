import { Button, GridCol, GridRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { Group } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SafeHtmlComponent } from '@isdd/idsk-ui-kit/save-html-component/SafeHtmlComponent'
import { GroupPermissionSubject } from '@isdd/metais-common/hooks/permissions/useGroupsPermissions'
import headerStyles from '@isdd/metais-common/components/entity-header/ciEntityHeader.module.scss'

import styles from '@/components/views/standardization/groups/styles.module.scss'

interface GroupDetailBaseInfoProps {
    infoData: Group | undefined
    openDeleteModal: () => void
    canDelete?: boolean
}

const GroupDetailBaseInfo: React.FC<GroupDetailBaseInfoProps> = ({ infoData, openDeleteModal, canDelete = true }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <div className={headerStyles.headerDiv}>
                <TextHeading size="XL">{infoData?.name}</TextHeading>
                <div className={styles.buttonDiv}>
                    {canDelete && (
                        <Can I={Actions.DELETE} a={GroupPermissionSubject.GROUPS}>
                            <Button variant="warning" label={t('groups.deleteItem')} onClick={openDeleteModal} />
                        </Can>
                    )}
                    <Can I={Actions.EDIT} a={GroupPermissionSubject.GROUPS}>
                        <Button label={t('groups.editItem')} onClick={() => navigate('./edit', { relative: 'path' })} />
                    </Can>
                </div>
            </div>

            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('groups.shortName')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>{infoData?.shortName}</TextBody>
                </GridCol>
            </GridRow>
            <GridRow>
                <GridCol setWidth="one-quarter">
                    <TextBody className={styles.boldText}>{t('groups.description')}</TextBody>
                </GridCol>
                <GridCol setWidth="two-thirds">
                    <TextBody>
                        <SafeHtmlComponent dirtyHtml={infoData?.description ?? ''} />
                    </TextBody>
                </GridCol>
            </GridRow>
        </>
    )
}

export default GroupDetailBaseInfo
