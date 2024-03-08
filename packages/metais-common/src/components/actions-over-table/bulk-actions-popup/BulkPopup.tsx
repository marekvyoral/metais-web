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
                disabled={disabled}
                buttonLabel={`${label ? label : t('actionOverTable.actions')} ${checkedRowItems ? '(' + checkedRowItems + ')' : ''}`}
                buttonClassName="marginBottom0"
                popupPosition={popupPosition}
                popupContent={(closePopup) => (
                    <div className={styles.popupActions} id="bulkActionsList">
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
