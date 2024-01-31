import { BaseModal, Button, TextArea } from '@isdd/idsk-ui-kit/index'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalButtons } from '@isdd/metais-common/index'

interface ICancelVoteButton {
    disabled?: boolean
    hidden?: boolean
    cancelVote: (description: string) => Promise<void>
}

export const CancelVoteButton: React.FC<ICancelVoteButton> = ({ cancelVote, disabled = false, hidden = false }) => {
    const { t } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [reasonText, setReasonText] = useState<string>('')

    const handleOpenModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleDoCancelVote = () => {
        cancelVote(reasonText)
        setIsModalOpen(false)
    }

    return (
        <>
            {!hidden && <Button type="submit" label={t('votes.voteDetail.cancel')} onClick={handleOpenModal} disabled={disabled} />}
            <BaseModal isOpen={isModalOpen} close={handleCloseModal}>
                <TextArea
                    name={'cancelVoteDescription'}
                    label={t('votes.voteDetail.description')}
                    rows={3}
                    onChange={(text) => setReasonText(text.target.value)}
                />
                <ModalButtons
                    submitButtonLabel={t('votes.voteDetail.cancelVote')}
                    onSubmit={handleDoCancelVote}
                    closeButtonLabel={t('votes.voteDetail.back')}
                    onClose={handleCloseModal}
                />
            </BaseModal>
        </>
    )
}
