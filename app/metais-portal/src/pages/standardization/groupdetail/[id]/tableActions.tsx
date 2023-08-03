import { Button, ButtonGroupRow, SimpleSelect, TextBody } from '@isdd/idsk-ui-kit/index'
import { FindRelatedIdentitiesAndCountParams } from '@isdd/metais-common/api/generated/iam-swagger'
import React from 'react'

import styles from './styles.module.scss'

interface KSIVSTAbleActionsProps {
    listParams: FindRelatedIdentitiesAndCountParams
    setListParams: (value: React.SetStateAction<FindRelatedIdentitiesAndCountParams>) => void
    setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const KSIVSTableActions: React.FC<KSIVSTAbleActionsProps> = ({ listParams, setListParams, setAddModalOpen }) => {
    return (
        <>
            <ButtonGroupRow>
                <Button label="Export" variant="secondary" />
                <Button label="Poslať email" variant="secondary" />
                <Button label="+ Pridať člena" onClick={() => setAddModalOpen(true)} />
                <TextBody className={styles.marginLeftAuto}>Zobrazit</TextBody>
                <SimpleSelect
                    onChange={(label) => {
                        setListParams({ ...listParams, perPage: label.target.value })
                    }}
                    id="select"
                    label=""
                    options={[
                        { label: '10', value: '10' },
                        { label: '20', value: '20' },
                        { label: '50', value: '50' },
                        { label: '100', value: '100' },
                    ]}
                />
            </ButtonGroupRow>
        </>
    )
}
export default KSIVSTableActions
