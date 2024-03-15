import { ButtonPopup } from '@isdd/idsk-ui-kit'
import classnames from 'classnames'
import React, { cloneElement } from 'react'
import { useTranslation } from 'react-i18next'

import styles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'

export interface IBulkPopupProps {
    checkedRowItems?: number
    label?: string
    disabled?: boolean
    items?: (closePopup: () => void) => Array<React.ReactElement>
    popupPosition?: 'left' | 'right'
}

export const BulkPopup: React.FC<IBulkPopupProps> = ({ checkedRowItems, label, disabled, items = () => [], popupPosition }) => {
    const { t } = useTranslation()
    return (
        <div className={classnames(styles.mobileOrder3, styles.buttonPopup)} id="bulkActions">
            <ButtonPopup
                disabled={disabled ?? checkedRowItems === 0}
                disabledTooltip={t('actionOverTable.disabledTooltip')}
                buttonLabel={`${label ? label : t('actionOverTable.actions')} ${checkedRowItems ? '(' + checkedRowItems + ')' : ''}`}
                buttonClassName="marginBottom0"
                popupPosition={popupPosition}
                popupContent={(closePopup) => (
                    <div className={styles.popupActions} id="bulkActionsList" role="list">
                        {items(closePopup)?.map((item) =>
                            cloneElement(item, {
                                role: 'listitem',
                                className: styles.buttonLinkWithIcon,
                            }),
                        )}
                    </div>
                )}
            />
        </div>
    )
}
