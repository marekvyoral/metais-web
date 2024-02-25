import { Button, RadioButton, RadioGroupWithLabel, TextArea } from '@isdd/idsk-ui-kit/index'
import { ApiVote } from '@isdd/metais-common/api/generated/standards-swagger'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ICastVote {
    voteProcessing: boolean
    voteData: ApiVote | undefined
    handleCastVote: (choiceId: number | undefined, description: string | undefined) => Promise<void>
    handleVetoVote: (description: string | undefined) => Promise<void>
    canCast: boolean
    canVeto: boolean
    castedVoteId: number | undefined
    vetoed: boolean
}

interface IChoise {
    id: number
    value: string
    description: string
    isVeto: boolean
    disabled: boolean
}

const VETO_VOTE_ID = -1

export const VotesHandler: React.FC<ICastVote> = ({
    voteData,
    handleCastVote,
    handleVetoVote,
    canCast,
    canVeto,
    castedVoteId,
    voteProcessing,
    vetoed,
}) => {
    const { t } = useTranslation()
    const [votesProcessingError, setVotesProcessingError] = useState<boolean>(false)
    const [voted, setVoted] = useState<boolean>(false)
    const { register, handleSubmit } = useForm()

    const alreadyVoted = !!castedVoteId

    const voteChoicesFactory = useCallback(
        (voteApiData: ApiVote | undefined, canDoCast: boolean, canDoVeto: boolean): Array<IChoise> => {
            const voteChoicesFromApi = voteApiData?.voteChoices?.map((choice, index) => {
                const choiceData: IChoise = {
                    id: choice.id ?? index,
                    value: choice.value ?? '',
                    description: choice.description ?? '',
                    isVeto: false,
                    disabled: !canDoCast || alreadyVoted,
                }
                return choiceData
            })
            if (!canDoVeto) {
                return voteChoicesFromApi ?? []
            }

            const vetoChoiceData: IChoise = {
                id: VETO_VOTE_ID,
                value: t('votes.voteDetail.voteVetoChoiceLabel'),
                description: 'veto',
                isVeto: true,
                disabled: !canDoVeto || alreadyVoted,
            }
            const voteHandlingChoicesData = voteChoicesFromApi?.concat(vetoChoiceData)
            return voteHandlingChoicesData ?? []
        },
        [alreadyVoted, t],
    )

    const voteChoicesData = useMemo((): IChoise[] => {
        return voteChoicesFactory(voteData, canCast, canVeto)
    }, [canCast, canVeto, voteChoicesFactory, voteData])

    const onSubmit = async (formData: FieldValues) => {
        if (voteData === undefined || voteData?.id === undefined) {
            return
        }
        const choiceId: number | undefined | null = formData['voteChoice']
        const choiceDescription: string | undefined = formData['voteDescription']
        if (choiceId == undefined) {
            return
        }
        const isVeto = choiceId == VETO_VOTE_ID

        try {
            if (isVeto) {
                await handleVetoVote(choiceDescription)
            } else {
                await handleCastVote(choiceId, choiceDescription)
            }
            setVoted(true)
        } catch {
            setVotesProcessingError(true)
            setVoted(false)
        }
    }

    return (
        <QueryFeedback
            withChildren
            loading={voteProcessing}
            error={votesProcessingError}
            indicatorProps={{ transparentMask: true, layer: 'dialog', label: t('votes.voteDetail.voteProcessing') }}
        >
            {voted && (
                <MutationFeedback
                    success={voted}
                    error={votesProcessingError && t('votes.actions.failedToSend')}
                    successMessage={t('votes.actions.sent')}
                    onMessageClose={() => setVotesProcessingError(false)}
                />
            )}
            <form onSubmit={handleSubmit(onSubmit)} className={classNames('govuk-!-font-size-19')}>
                <RadioGroupWithLabel
                    label={t('votes.voteDetail.votesHandlingRadioLabel')}
                    hint={
                        vetoed
                            ? t('votes.voteDetail.vetoed')
                            : canCast
                            ? alreadyVoted
                                ? t('votes.voteDetail.voteChoiceLabel.alreadyVoted')
                                : t('votes.voteDetail.voteChoiceLabel.canCast')
                            : t('votes.voteDetail.voteChoiceLabel.cannotCast')
                    }
                >
                    {voteChoicesData.map((choice) => {
                        return (
                            <RadioButton
                                key={choice.id}
                                id={choice.id.toString()}
                                value={choice.id}
                                label={choice.value ?? ''}
                                {...register('voteChoice')}
                                disabled={choice.disabled || voted || vetoed}
                                defaultChecked={choice.id == castedVoteId}
                            />
                        )
                    })}
                </RadioGroupWithLabel>
                {canCast && (
                    <TextArea rows={3} label={t('votes.voteDetail.description')} {...register('voteDescription')} disabled={alreadyVoted || voted} />
                )}

                {canCast && <Button type="submit" label={t('votes.voteDetail.submitVote')} disabled={alreadyVoted || voted} />}
            </form>
        </QueryFeedback>
    )
}
