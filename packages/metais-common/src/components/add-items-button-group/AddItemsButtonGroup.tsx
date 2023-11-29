import { Button, ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import React from 'react'

import styles from './addItemsButtonGroup.module.scss'

interface Props {
    handleItemsChange: () => void
    isUnderTable?: boolean
    onCancel: () => void
}

export const AddItemsButtonGroup: React.FC<Props> = ({ handleItemsChange, isUnderTable = false, onCancel }) => {
    const { t } = useTranslation()
    return (
        <ButtonGroupRow className={classNames(!isUnderTable && styles.wrapper, isUnderTable && styles.wrapperUnderTable)}>
            <Button label={t('newRelation.cancel')} variant="secondary" onClick={() => onCancel()} />
            <Button label={t('newRelation.addItems')} onClick={handleItemsChange} />
        </ButtonGroupRow>
    )
}
