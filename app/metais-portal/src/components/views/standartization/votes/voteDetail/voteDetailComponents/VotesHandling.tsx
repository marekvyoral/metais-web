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

    const voteChoisesFactory = useCallback(
        (voteApiData: ApiVote | undefined, canDoCast: boolean, canDoVeto: boolean): Array<IChoise> => {
            const voteChoisesFromApi = voteApiData?.voteChoices?.map((choise, index) => {
                const choiseData: IChoise = {
                    id: choise.id ?? index,
                    value: choise.value ?? '',
                    description: choise.description ?? '',
                    isVeto: false,
                    disabled: !canDoCast || alreadyVoted,
                }
                return choiseData
            })
            if (!canDoVeto) {
                return voteChoisesFromApi ?? []
            }

            const vetoChoiseData: IChoise = {
                id: VETO_VOTE_ID,
                value: t('votes.voteDetail.voteVetoChoiseLabel'),
                description: 'veto',
                isVeto: true,
                disabled: !canDoVeto || alreadyVoted,
            }
            const voteHandlingChoisesData = voteChoisesFromApi?.concat(vetoChoiseData)
            return voteHandlingChoisesData ?? []
        },
        [alreadyVoted, t],
    )

    const voteChoisesData = useMemo((): IChoise[] => {
        return voteChoisesFactory(voteData, canCast, canVeto)
    }, [canCast, canVeto, voteChoisesFactory, voteData])

    const onSubmit = async (formData: FieldValues) => {
        if (voteData === undefined || voteData?.id === undefined) {
            return
        }
        const voteId = voteData.id
        const choiseId: number | undefined | null = formData['voteChoise']
        const choiseDescription: string | undefined = formData['voteDescription']
        if (choiseId == undefined) {
            return
        }
        const isVeto = choiseId === VETO_VOTE_ID

        try {
            setVotesProcessingError(false)
            if (isVeto) {
                await handleVetoVote(voteId, choiseDescription)
                return
            }
            await handleCastVote(voteId, choiseId, choiseDescription)
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
                                ? t('votes.voteDetail.voteChoiseLabel.alreadyVoted')
                                : t('votes.voteDetail.voteChoiseLabel.canCast')
                            : t('votes.voteDetail.voteChoiseLabel.cannotCast')
                    }
                >
                    {voteChoisesData.map((choise) => {
                        return (
                            <RadioButton
                                key={choise.id}
                                id={choise.id.toString()}
                                value={choise.id}
                                label={choise.value ?? ''}
                                {...register('voteChoise')}
                                disabled={choise.disabled}
                                defaultChecked={choise.id == castedVoteId}
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
