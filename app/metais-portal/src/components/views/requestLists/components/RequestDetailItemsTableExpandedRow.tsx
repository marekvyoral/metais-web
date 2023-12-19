import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useTranslation } from 'react-i18next'
import { IconWithText } from '@isdd/idsk-ui-kit/index'
import { InfoIcon } from '@isdd/metais-common/assets/images'

import styles from './requestList.module.scss'

import { CodeListItemInfo } from '@/components/views/codeLists/components/ItemInfo'

interface RequestDetailItemsTableExpandedRowProps {
    workingLanguage: string
    codelistItem?: ApiCodelistItem
    attributeProfile?: AttributeProfile
}

export const RequestDetailItemsTableExpandedRow: React.FC<RequestDetailItemsTableExpandedRowProps> = ({
    workingLanguage,
    codelistItem,
    attributeProfile,
}) => {
    const { t } = useTranslation()

    return (
        <div className={styles.expandableRowContent}>
            {codelistItem?.locked && (
                <IconWithText icon={InfoIcon}>
                    {t('codeListDetail.warning.itemLocked', { user: codelistItem.lockedBy, date: t('date', { date: codelistItem.lockedFrom }) })}
                </IconWithText>
            )}

            {codelistItem && <CodeListItemInfo codelistItem={codelistItem} workingLanguage={workingLanguage} attributeProfile={attributeProfile} />}
        </div>
    )
}
