import { RadioButton, RadioGroupWithLabel } from '@isdd/idsk-ui-kit/index'
import { ApiVote } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/index'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ICastVote {
    voteProcessing: boolean
    voteData: ApiVote | undefined
    handleCastVote: (voteId: number | undefined, choiceId: number | undefined, description: string | undefined) => Promise<void>
    handleVetoVote: (voteId: number | undefined, description: string | undefined) => Promise<void>
    canCast: boolean
    canVeto: boolean
}

interface IChoise {
    id: number
    value: string
    description: string
    isVeto: boolean
    disabled: boolean
    handleOnChange: () => void
}

export const VotesHandling: React.FC<ICastVote> = ({ voteData, handleCastVote, handleVetoVote, canCast, canVeto, voteProcessing }) => {
    const { t } = useTranslation()
    const [votesProcessingError, setVotesProcessingError] = useState<boolean>(false)
    const handleOnChange = useCallback(
        async (voteId: number | undefined, choiceId: number | undefined, description: string | undefined, isVeto: boolean) => {
            try {
                setVotesProcessingError(false)
                if (isVeto) {
                    await handleVetoVote(voteId, description)
                    return
                }
                await handleCastVote(voteId, choiceId, description)
            } catch {
                setVotesProcessingError(true)
            }
        },
        [handleCastVote, handleVetoVote],
    )
    const vetoId = useMemo((): number => {
        return 99999 + Math.random() * 1000
    }, [])

    const choisesDataArrayFactory = useCallback(
        (voteApiData: ApiVote | undefined, canDoCast: boolean, canDoVeto: boolean): Array<IChoise> => {
            const voteChoisesFromApi = voteApiData?.voteChoices?.map((choise, index) => {
                const choiseData: IChoise = {
                    id: choise.id ?? index,
                    value: choise.value ?? '',
                    description: choise.description ?? '',
                    isVeto: false,
                    disabled: !canDoCast,
                    handleOnChange: () => {
                        handleOnChange(voteApiData?.id, choise?.id, choise?.description, false)
                    },
                }
                return choiseData
            })
            if (!canDoVeto) {
                return voteChoisesFromApi ?? []
            }

            const vetoChoiseData: IChoise = {
                id: vetoId,
                value: t('votes.voteDetail.voteVetoChoiseLabel'),
                description: 'veto',
                isVeto: true,
                disabled: !canDoVeto,
                handleOnChange: () => {
                    handleOnChange(voteApiData?.id, undefined, undefined, true)
                },
            }
            const voteHandlingChoisesData = voteChoisesFromApi?.concat(vetoChoiseData)
            return voteHandlingChoisesData ?? []
        },
        [handleOnChange, t, vetoId],
    )

    const choisesDataArray = useMemo((): IChoise[] => {
        return choisesDataArrayFactory(voteData, canCast, canVeto)
    }, [canCast, canVeto, choisesDataArrayFactory, voteData])

    return (
        <>
            <QueryFeedback
                withChildren
                loading={voteProcessing}
                error={votesProcessingError}
                indicatorProps={{ transparentMask: true, layer: 'dialog', label: t('votes.voteDetail.voteProcessing') }}
            >
                <RadioGroupWithLabel hint={!canCast ? t('votes.voteDetail.voteChoiseLabel.cannotCast') : ''}>
                    <>
                        {choisesDataArray.map((choise) => {
                            return (
                                <RadioButton
                                    key={choise.id}
                                    id={choise.id.toString()}
                                    value={choise.value ?? ''}
                                    label={choise.value ?? ''}
                                    name={'voteHandling'}
                                    onChange={() => handleOnChange(voteData?.id, choise?.id, choise?.description, choise.isVeto)}
                                    disabled={choise.disabled}
                                />
                            )
                        })}
                    </>
                </RadioGroupWithLabel>
            </QueryFeedback>
        </>
    )
}
