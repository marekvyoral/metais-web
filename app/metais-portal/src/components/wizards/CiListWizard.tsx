import { TextBody } from '@isdd/idsk-ui-kit/index'
import { WizardState, Wizard } from '@isdd/metais-common/components/onboarding-wizard/Wizard'
import { WizardTypes, useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CallBackProps, ACTIONS, STATUS, Step, Placement } from 'react-joyride'

export const CiListWizard: React.FC = () => {
    const { currentPreferences, updateUserPreferences } = useUserPreferences()
    const { t } = useTranslation()
    const searchSteps = useMemo(() => {
        {
            return [
                {
                    target: '.idsk-header-web__main-headline-logo', //use global search id after enabled
                    content: (
                        <>
                            <TextBody>{t('wizard.searchContent.step1')}</TextBody>
                        </>
                    ),
                    title: t('wizard.search'),
                    disableBeacon: true,
                },
                {
                    target: '#fullTextSearch',
                    content: (
                        <>
                            <TextBody>{t('wizard.searchContent.step2')}</TextBody>
                        </>
                    ),
                    title: t('wizard.search'),
                    disableBeacon: true,
                },
            ]
        }
    }, [t])

    const filterSteps = useMemo(() => {
        {
            return [
                {
                    target: '#expandFilter',
                    content: (
                        <>
                            <TextBody>{t('wizard.filterContent.step1')}</TextBody>
                        </>
                    ),
                    title: t('wizard.filter'),
                    disableBeacon: true,
                },
                {
                    target: '#tableFilter',
                    content: (
                        <>
                            <TextBody>{t('wizard.filterContent.step2')}</TextBody>
                        </>
                    ),
                    title: t('wizard.filter'),
                    disableBeacon: true,
                    placement: 'bottom' as Placement,
                },
                {
                    target: '#tableFilter',
                    content: (
                        <>
                            <TextBody>{t('wizard.filterContent.step3')}</TextBody>
                        </>
                    ),
                    title: t('wizard.filter'),
                    disableBeacon: true,
                    placement: 'bottom' as Placement,
                },
            ]
        }
    }, [t])

    const bulkActionsSteps: Step[] = useMemo(() => {
        {
            return [
                {
                    target: '#checkbox_cell_0',
                    content: (
                        <>
                            <TextBody>{t('wizard.bulkActionsContent.step3')}</TextBody>
                        </>
                    ),
                    title: t('wizard.bulkActions'),
                    disableBeacon: true,
                    placement: 'right' as Placement,
                },
                {
                    target: '#bulkActions',
                    content: (
                        <>
                            <TextBody>{t('wizard.bulkActionsContent.step1')}</TextBody>
                        </>
                    ),
                    title: t('wizard.bulkActions'),
                    disableBeacon: true,
                },
                {
                    target: '#bulkActions',
                    content: (
                        <>
                            <TextBody>{t('wizard.bulkActionsContent.step2')}</TextBody>
                        </>
                    ),
                    title: t('wizard.bulkActions'),
                    disableBeacon: true,
                    placement: 'right' as Placement,
                },
            ]
        }
    }, [t])

    const [searchWizard, setSearchWizard] = useState<WizardState>({
        run: false,
        steps: [],
    })

    const [filterWizard, setFilterWizard] = useState<WizardState>({
        run: false,
        steps: [],
    })

    const [bulkActionsWizard, setBulkActionsWizard] = useState<WizardState>({
        run: false,
        steps: [],
    })

    useEffect(() => {
        setTimeout(() => {
            if (currentPreferences[WizardTypes.SEARCH]) {
                setSearchWizard({ run: currentPreferences[WizardTypes.SEARCH], steps: searchSteps })
            } else if (currentPreferences[WizardTypes.FILTER]) {
                setFilterWizard({ run: currentPreferences[WizardTypes.FILTER], steps: filterSteps })
            } else if (currentPreferences[WizardTypes.ACTIONS]) {
                setBulkActionsWizard({ run: currentPreferences[WizardTypes.ACTIONS], steps: bulkActionsSteps })
            }
        }, 500)
    }, [currentPreferences, searchSteps, filterSteps, bulkActionsSteps])

    const searchCallback = (data: CallBackProps) => {
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.FINISHED) {
            setSearchWizard({ steps: [], run: false })
            updateUserPreferences({ ...currentPreferences, [WizardTypes.SEARCH]: false })
            if (currentPreferences[WizardTypes.FILTER]) {
                setFilterWizard({ steps: filterSteps, run: true })
            } else if (currentPreferences[WizardTypes.ACTIONS]) {
                setBulkActionsWizard({ steps: bulkActionsSteps, run: true })
            }
        }
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.RUNNING) {
            setSearchWizard({ steps: [], run: false })
        }
    }

    const filterCallback = (data: CallBackProps) => {
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.FINISHED) {
            setFilterWizard({ steps: [], run: false })
            updateUserPreferences({ ...currentPreferences, [WizardTypes.FILTER]: false })
            if (currentPreferences[WizardTypes.SEARCH]) {
                setSearchWizard({ steps: searchSteps, run: true })
            } else if (currentPreferences[WizardTypes.ACTIONS]) {
                setBulkActionsWizard({ steps: bulkActionsSteps, run: true })
            }
        }
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.RUNNING) {
            setFilterWizard({ steps: [], run: false })
        }
    }

    const bulkActionsCallback = (data: CallBackProps) => {
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.FINISHED) {
            setBulkActionsWizard({ steps: [], run: false })
            updateUserPreferences({ ...currentPreferences, [WizardTypes.ACTIONS]: false })
            if (currentPreferences[WizardTypes.SEARCH]) {
                setSearchWizard({ steps: searchSteps, run: true })
            } else if (currentPreferences[WizardTypes.FILTER]) {
                setFilterWizard({ steps: filterSteps, run: true })
            }
        }
        if (data.action === ACTIONS.CLOSE && data.status === STATUS.RUNNING) {
            setBulkActionsWizard({ steps: [], run: false })
        }
    }
    return (
        <>
            {currentPreferences[WizardTypes.SEARCH] && !filterWizard.run && !bulkActionsWizard.run && (
                <Wizard state={searchWizard} setState={setSearchWizard} type={WizardTypes.SEARCH} callback={searchCallback} />
            )}
            {currentPreferences[WizardTypes.FILTER] && !searchWizard.run && !bulkActionsWizard.run && (
                <Wizard state={filterWizard} setState={setFilterWizard} type={WizardTypes.FILTER} callback={filterCallback} />
            )}
            {currentPreferences[WizardTypes.ACTIONS] && !searchWizard.run && !filterWizard.run && (
                <Wizard state={bulkActionsWizard} setState={setBulkActionsWizard} type={WizardTypes.ACTIONS} callback={bulkActionsCallback} />
            )}
        </>
    )
}
