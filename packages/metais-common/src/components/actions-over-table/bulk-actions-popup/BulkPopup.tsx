import { ButtonPopup } from '@isdd/idsk-ui-kit'
import classnames from 'classnames'
import React, { cloneElement } from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

export interface IBulkPopupProps {
    checkedRowItems?: number
    label?: string
    items?: (closePopup: () => void) => Array<React.ReactElement>
}

export const BulkPopup: React.FC<IBulkPopupProps> = ({ checkedRowItems, label, items = () => [] }) => {
    const { t } = useTranslation()
    return (
        <div className={classnames(styles.mobileOrder3, styles.buttonPopup)}>
            <ButtonPopup
                buttonLabel={`${label ? label : t('actionOverTable.actions')} ${checkedRowItems ? '(' + checkedRowItems + ')' : ''}`}
                buttonClassName="marginBottom0"
                popupContent={(closePopup) => (
                    <div className={styles.popupActions}>
                        {items(closePopup)?.map((item) =>
                            cloneElement(item, {
                                className: styles.buttonLinkWithIcon,
                            }),
                        )}
                    </div>
                )}
            />
        </div>
    )
}
