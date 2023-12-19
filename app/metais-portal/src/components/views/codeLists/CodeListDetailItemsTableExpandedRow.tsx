import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroupRow, TextWarning } from '@isdd/idsk-ui-kit/index'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import styles from './codeList.module.scss'

import { CodeListItemInfo } from '@/components/views/codeLists/components/ItemInfo'
import { CodeListItemState } from '@/componentHelpers/codeList'

interface CodeListDetailItemsTableExpandedRowProps {
    workingLanguage: string
    codelistItem?: ApiCodelistItem
    attributeProfile?: AttributeProfile
    handleOpenEditItem: (item: ApiCodelistItem) => void
    handleMarkForPublish: (itemCodes: string[]) => void
}

export const CodeListDetailItemsTableExpandedRow: React.FC<CodeListDetailItemsTableExpandedRowProps> = ({
    workingLanguage,
    codelistItem,
    attributeProfile,
    handleOpenEditItem,
    handleMarkForPublish,
}) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const ability = useAbilityContext()

    if (!codelistItem || !attributeProfile) return <></>

    const canEditItem = ability.can(Actions.EDIT, Subjects.ITEM) && !(codelistItem.locked && codelistItem.lockedBy !== user?.login)
    const canReadyToPublish =
        ability.can(Actions.EDIT, Subjects.ITEM, 'readyToPublish') &&
        codelistItem.codelistItemState !== CodeListItemState.READY_TO_PUBLISH &&
        codelistItem.codelistItemState !== CodeListItemState.PUBLISHED &&
        !codelistItem.locked

    return (
        <div className={styles.expandableRowContent}>
            {codelistItem.locked && (
                <TextWarning>
                    {t('codeListDetail.warning.itemLocked', { user: codelistItem.lockedBy, date: t('date', { date: codelistItem.lockedFrom }) })}
                </TextWarning>
            )}

            {codelistItem && <CodeListItemInfo codelistItem={codelistItem} workingLanguage={workingLanguage} attributeProfile={attributeProfile} />}

            <ButtonGroupRow>
                {canEditItem && handleOpenEditItem && (
                    <Button
                        label={t('codeListDetail.button.edit')}
                        onClick={() => {
                            handleOpenEditItem(codelistItem)
                        }}
                    />
                )}
                {handleMarkForPublish && canReadyToPublish && (
                    <Button
                        label={t('codeListDetail.button.markItemReadyForPublishing')}
                        onClick={() => handleMarkForPublish([codelistItem.itemCode || ''])}
                    />
                )}
            </ButtonGroupRow>
        </div>
    )
}
