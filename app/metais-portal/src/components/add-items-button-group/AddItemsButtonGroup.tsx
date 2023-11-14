import { Button, ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './addItemsButtonGroup.module.scss'

interface Props {
    handleItemsChange: () => void
    isUnderTable?: boolean
}

export const AddItemsButtonGroup: React.FC<Props> = ({ handleItemsChange, isUnderTable = false }) => {
    const { setIsListPageOpen } = useNewRelationData()
    const { t } = useTranslation()
    return (
        <ButtonGroupRow className={classNames(!isUnderTable && styles.wrapper, isUnderTable && styles.wrapperUnderTable)}>
            <Button label={t('newRelation.cancel')} variant="secondary" onClick={() => setIsListPageOpen(false)} />
            <Button label={t('newRelation.addItems')} onClick={handleItemsChange} />
        </ButtonGroupRow>
    )
}
