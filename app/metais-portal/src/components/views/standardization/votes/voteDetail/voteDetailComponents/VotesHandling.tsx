import { Button, RadioButton, RadioGroupWithLabel, TextArea } from '@isdd/idsk-ui-kit/index'
import { ApiVote } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ICastVote {
    voteProcessing: boolean
    voteData: ApiVote | undefined
    handleCastVote: (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => Promise<void>
    handleVetoVote: (voteId: number | undefined, description: string | undefined) => Promise<void>
    canCast: boolean
    canVeto: boolean
    castedVoteId: number | undefined
}

interface IChoise {
    id: number
    value: string
    description: string
    isVeto: boolean
    disabled: boolean
}

const VETO_VOTE_ID = -1

export const VotesHandler: React.FC<ICastVote> = ({ voteData, handleCastVote, handleVetoVote, canCast, canVeto, castedVoteId, voteProcessing }) => {
    const { t } = useTranslation()
    const [votesProcessingError, setVotesProcessingError] = useState<boolean>(false)
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
        const voteId = voteData.id
        const choiceId: number | undefined | null = formData['voteChoice']
        const choiceDescription: string | undefined = formData['voteDescription']
        if (choiceId == undefined) {
            return
        }
        const isVeto = choiceId === VETO_VOTE_ID

        try {
            setVotesProcessingError(false)
            if (isVeto) {
                await handleVetoVote(voteId, choiceDescription)
                return
            }
            await handleCastVote(voteId, choiceId, choiceDescription)
        } catch {
            setVotesProcessingError(true)
        }
    }

    return (
        <QueryFeedback
            withChildren
            loading={voteProcessing}
            error={votesProcessingError}
            indicatorProps={{ transparentMask: true, layer: 'dialog', label: t('votes.voteDetail.voteProcessing') }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className={classNames('govuk-!-font-size-19')}>
                <RadioGroupWithLabel
                    hint={
                        canCast
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
                                disabled={choice.disabled}
                                defaultChecked={choice.id == castedVoteId}
                            />
                        )
                    })}
                    {canCast && <TextArea rows={3} label={t('votes.voteDetail.description')} {...register('voteDescription')} />}
                </RadioGroupWithLabel>

                {canCast && <Button type="submit" label={t('votes.voteDetail.submitVote')} />}
            </form>
        </QueryFeedback>
    )
}
