import { CheckBox, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { UpdatePreferencesReturnEnum, WizardTypes, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { SubmitWithFeedback } from '@isdd/metais-common/components/submit-with-feedback/SubmitWithFeedback'
import styles from '@isdd/metais-common/components/GridView.module.scss'

export const UserWizards: React.FC = () => {
    const { t } = useTranslation()
    const { currentPreferences, updateUserPreferences } = useUserPreferences()
    const { isActionSuccess, setIsActionSuccess } = useActionSuccess()

    const [searchWizard, setSearchWizard] = useState(true)
    const [filterWizard, setFilterWizard] = useState(true)
    const [actionsWizard, setActionsWizard] = useState(true)
    const [relationsWizard, setRelationsWizard] = useState(true)

    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setSearchWizard(currentPreferences[WizardTypes.SEARCH] ?? true)
        setFilterWizard(currentPreferences[WizardTypes.FILTER] ?? true)
        setActionsWizard(currentPreferences[WizardTypes.ACTIONS] ?? true)
        setRelationsWizard(currentPreferences[WizardTypes.RELATIONS] ?? true)
    }, [currentPreferences])

    const onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        setHasError(false)
        const formData = {
            [WizardTypes.SEARCH]: searchWizard,
            [WizardTypes.FILTER]: filterWizard,
            [WizardTypes.ACTIONS]: actionsWizard,
            [WizardTypes.RELATIONS]: relationsWizard,
        }

        const preferencesData = { ...currentPreferences, ...formData }

        const update = updateUserPreferences(preferencesData)
        if (update === UpdatePreferencesReturnEnum.SUCCESS) {
            setIsActionSuccess({ value: true, path: location.pathname })
        } else if (update === UpdatePreferencesReturnEnum.ERROR) {
            setHasError(true)
        }
    }

    return (
        <>
            <MutationFeedback success={isActionSuccess.value} error={hasError} successMessage={t('wizard.success')} />
            <TextHeading size="L">{t('wizard.show')}</TextHeading>
            <form onSubmit={onSubmit}>
                <div className={styles.govukBottomMargin}>
                    <CheckBox
                        label={t('wizard.search')}
                        id="searchWizard"
                        name="searchWizard"
                        onChange={() => setSearchWizard((prev) => !prev)}
                        checked={searchWizard}
                    />
                </div>
                <div className={styles.govukBottomMargin}>
                    <CheckBox
                        label={t('wizard.filter')}
                        id="filterWizard"
                        name="filterWizard"
                        onChange={() => setFilterWizard((prev) => !prev)}
                        checked={filterWizard}
                    />
                </div>
                <div className={styles.govukBottomMargin}>
                    <CheckBox
                        label={t('wizard.bulkActions')}
                        id="actionsWizard"
                        name="actionsWizard"
                        onChange={() => setActionsWizard((prev) => !prev)}
                        checked={actionsWizard}
                    />
                </div>{' '}
                <div className={styles.govukBottomMargin}>
                    <CheckBox
                        label={t('wizard.relations')}
                        id="relationsWizard"
                        name="relationsWizard"
                        onChange={() => setRelationsWizard((prev) => !prev)}
                        checked={relationsWizard}
                    />
                </div>
                <SubmitWithFeedback submitButtonLabel={t('userProfile.savePreferences')} loading={false} />
            </form>
        </>
    )
}
