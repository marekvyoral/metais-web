import { ApiReferenceRegisterItem } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useTranslation } from 'react-i18next'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import styles from '@/components/entities/accordion/basicInformationSection.module.scss'
import { RefRegisterItemItems } from '@/types/filters'

interface IRefRegisterItemView {
    row: ApiReferenceRegisterItem
    referenceRegisterItemAttributes: Attribute[] | undefined
}

export const RefRegisterItemView = ({ row, referenceRegisterItemAttributes }: IRefRegisterItemView) => {
    const { t } = useTranslation()

    const getTooltipOfRow = (refRegisterAttribute: string) => {
        return referenceRegisterItemAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.description ?? ''
    }

    return (
        <div className={styles.attributeGridRowBox}>
            <InformationGridRow
                key={RefRegisterItemItems.ORDER}
                label={t('refRegisters.detail.items.order')}
                value={row?.order}
                tooltip={getTooltipOfRow(RefRegisterItemItems.ORDER)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.NAME}
                label={t('refRegisters.detail.items.itemName')}
                value={row?.itemName}
                tooltip={getTooltipOfRow(RefRegisterItemItems.NAME)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.GROUP}
                label={t('refRegisters.detail.items.group')}
                value={row?.referenceRegisterGroup?.groupName}
                tooltip={getTooltipOfRow(RefRegisterItemItems.GROUP)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.SUB_GROUP_NAME}
                label={t('refRegisters.detail.items.subGroup')}
                value={row?.referenceRegisterSubGroup?.groupName}
                tooltip={getTooltipOfRow(RefRegisterItemItems.SUB_GROUP_NAME)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.SUBJECT_IDENTIFICATIONS}
                label={t('refRegisters.detail.items.subjectIdentification')}
                value={row?.subjectIdentification}
                tooltip={getTooltipOfRow(RefRegisterItemItems.SUBJECT_IDENTIFICATIONS)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.REF_ID}
                label={t('refRegisters.detail.items.refID')}
                value={row?.refID}
                tooltip={getTooltipOfRow(RefRegisterItemItems.REF_ID)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.DATA_ELEMENT_REF_ID}
                label={t('refRegisters.detail.items.dataElementRefID')}
                value={row?.dataElementRefID}
                tooltip={getTooltipOfRow(RefRegisterItemItems.DATA_ELEMENT_REF_ID)}
            />
            <InformationGridRow
                key={RefRegisterItemItems.NOTE}
                label={t('refRegisters.detail.items.note')}
                value={row?.note}
                tooltip={getTooltipOfRow(RefRegisterItemItems.NOTE)}
            />
        </div>
    )
}
