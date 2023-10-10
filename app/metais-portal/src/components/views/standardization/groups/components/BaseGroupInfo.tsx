import { Button, GridCol, GridRow, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { Group } from '@isdd/metais-common/src/api/generated/iam-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from '@/components/views/standardization/groups/styles.module.scss'

interface GroupDetailBaseInfoProps {
    infoData: Group | undefined
}

const GroupDetailBaseInfo: React.FC<GroupDetailBaseInfoProps> = ({ infoData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <GridRow className={styles.row}>
                <GridCol>
                    <TextHeading size="XL">{infoData?.name}</TextHeading>
                </GridCol>
                <GridCol setWidth="one-quarter">
                    <Can I={Actions.EDIT} a={'groups'}>
                        <Button label={t('groups.editItem')} onClick={() => navigate('./edit', { relative: 'path' })} />
                    </Can>
                </GridCol>
            </GridRow>
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
                        <div dangerouslySetInnerHTML={{ __html: infoData?.description ?? '' }} />
                    </TextBody>
                </GridCol>
            </GridRow>
        </>
    )
}

export default GroupDetailBaseInfo
