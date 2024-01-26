import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

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
    return (
        <div className={styles.expandableRowContent}>
            {codelistItem && <CodeListItemInfo codelistItem={codelistItem} workingLanguage={workingLanguage} attributeProfile={attributeProfile} />}
        </div>
    )
}
