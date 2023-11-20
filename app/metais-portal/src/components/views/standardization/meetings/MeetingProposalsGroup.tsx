import { Button, GridCol, GridRow } from '@isdd/idsk-ui-kit'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormSetValue } from 'react-hook-form'

import { SelectMeetingProposals } from './SelectMeetingProposals'
import styles from './createEditView.module.scss'
import { MeetingFormEnum } from './meetingSchema'

interface IMeetingProposalsGroup {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<any>
    selectedProposals: string[]
    setSelectedProposals: React.Dispatch<React.SetStateAction<string[]>>
    openModalProposal: () => void
}

export const MeetingProposalsGroup = ({ setValue, selectedProposals, setSelectedProposals, openModalProposal }: IMeetingProposalsGroup) => {
    const { t } = useTranslation()

    useEffect(() => {
        setValue(MeetingFormEnum.MEETING_PROPOSAL, selectedProposals)
    }, [selectedProposals, setValue])

    return (
        <GridRow className={styles.proposalsButtonGridRow}>
            <GridCol setWidth="two-thirds" className={styles.proposalsButtonGrid}>
                <SelectMeetingProposals
                    meetingProposals={selectedProposals}
                    id={MeetingFormEnum.MEETING_PROPOSAL}
                    label={`${t('meetings.form.proposalsSelect')}:`}
                    setSelectedProposals={setSelectedProposals}
                />
            </GridCol>
            <GridCol setWidth="one-third" className={styles.proposalsButtonGrid}>
                <Button
                    variant="secondary"
                    label={t('meetings.form.proposalsButton')}
                    onClick={openModalProposal}
                    className={styles.proposalsButton}
                />
            </GridCol>
        </GridRow>
    )
}
