import { FieldErrors, FieldValues, UseFormRegister, UseFormUnregister, UseFormWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@isdd/idsk-ui-kit/index'
import { ApiVoteChoice } from '@isdd/metais-common/api/generated/standards-swagger'
import { useEffect } from 'react'
import { DynamicElements } from '@isdd/metais-common/components/DynamicElements/DynamicElements'

import styles from './AnswerDefinitions.module.scss'

type AnswerDefinitionLineType = {
    index?: number
    initialValue?: ApiVoteChoice
    register: UseFormRegister<FieldValues>
    unregister?: UseFormUnregister<FieldValues>
    errors: FieldErrors<{ answerDefinitions: ApiVoteChoice[] }>
}

interface IAnswerDefinitions {
    initialValues?: ApiVoteChoice[]
    register: UseFormRegister<FieldValues>
    unregister?: UseFormUnregister<FieldValues>
    watch: UseFormWatch<FieldValues>
    errors: FieldErrors<{ answerDefinitions: ApiVoteChoice[] }>
}

const AnswerDefinitionLine: React.FC<AnswerDefinitionLineType> = ({ index, errors, register, unregister }) => {
    const { t } = useTranslation()

    // useEffect(() => () => unregister?.(`answerDefinitions.${index}.value`), [index, unregister])
    return (
        <div>
            <Input
                placeholder={t('votes.voteEdit.documents.generalInputPlaceholder')}
                {...register(`answerDefinitions.${index}.value`)}
                error={errors?.answerDefinitions?.[index ?? 0]?.value?.message}
                className="marginBottom0"
            />
        </div>
    )
}

export const AnswerDefinitions: React.FC<IAnswerDefinitions> = ({ register, unregister, watch, errors, initialValues }) => {
    const { t } = useTranslation()
    console.log('initialValues', initialValues)
    return (
        <div className={styles.flex}>
            <DynamicElements<ApiVoteChoice>
                renderableComponent={(index) => <AnswerDefinitionLine index={index} register={register} errors={errors} unregister={unregister} />}
                defaultRenderableComponentData={{}}
                nonRemovableElementIndexes={[0, 1]}
                addItemButtonLabelText={'+  ' + t('votes.voteEdit.answers.addNext')}
                removeLabelSubject={(index) => {
                    const value = watch(`answerDefinitions.${index}.value`)
                    return t('votes.voteEdit.answers.removeAnswer', { answer: value ?? '' })
                }}
                initialElementsData={initialValues}
                unregister={unregister}
            />
        </div>
    )
}
