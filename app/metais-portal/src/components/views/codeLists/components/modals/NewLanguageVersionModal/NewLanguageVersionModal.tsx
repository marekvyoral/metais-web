import { BaseModal, Button, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import * as Yup from 'yup'
import { FieldValues, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import {
    useGetOriginalCodelistHeader,
    useUpdateCodelistLanguageVersion,
    useCreateCodelistLanguageVersion,
    ApiCodelistLanguageVersion,
    getGetOriginalCodelistHeaderQueryKey,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { QueryFeedback, MutationFeedback } from '@isdd/metais-common/index'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'

import styles from './newLanguageVersionModal.module.scss'

export interface NewLanguageVersionModalProps {
    code: string
    isOpen: boolean
    onClose: () => void
}

interface FormData {
    language: string
    names: {
        name: string
        slovakName: string
        from: string
        to?: string | null
    }[]
}

enum languages {
    'en' = 'en',
    'de' = 'de',
    'hu' = 'hu',
}

const schema: Yup.ObjectSchema<FormData> = Yup.object({
    language: Yup.string().trim().required().oneOf(Object.values(languages)),
    names: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().required(),
                slovakName: Yup.string().required(),
                from: Yup.string().required(),
                to: Yup.string().nullable().notRequired(),
            }),
        )
        .min(1)
        .required(),
}).defined()

export const NewLanguageVersionModal: React.FC<NewLanguageVersionModalProps> = ({ code, isOpen, onClose }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const { register, formState, handleSubmit, setValue, reset, watch, control } = useForm({
        shouldUnregister: true,
        resolver: yupResolver(schema),
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'names',
    })
    const selectedLanguage = watch('language')

    const handleOnClose = useCallback(() => {
        reset()
        onClose()
    }, [onClose, reset])

    const { isLoading: isLoadingOriginal, isError, data: codeListOriginalData } = useGetOriginalCodelistHeader(code)

    const queryOnSuccess = () => {
        queryClient.invalidateQueries([getGetOriginalCodelistHeaderQueryKey(code)])
        handleOnClose()
    }
    const {
        mutate: updateLanguageMutation,
        isLoading: isLoadingUpdateLanguageMutation,
        isError: isErrorUpdateLanguageMutation,
        isSuccess: isSuccessUpdateLanguageMutation,
    } = useUpdateCodelistLanguageVersion({
        mutation: {
            onSuccess: queryOnSuccess,
        },
    })
    const {
        mutate: createLanguageMutation,
        isLoading: isLoadingCreateLanguageMutation,
        isError: isErrorCreateLanguageMutation,
        isSuccess: isSuccessCreateLanguageMutation,
    } = useCreateCodelistLanguageVersion({
        mutation: {
            onSuccess: queryOnSuccess,
        },
    })

    const names = codeListOriginalData?.codelistNames

    useEffect(() => {
        remove()
        names
            ?.filter((name) => name.language === 'sk')
            .map((slovakName) => {
                const translatedName = names
                    .filter((name) => name.language === selectedLanguage)
                    .find((name) => name.effectiveFrom === slovakName.effectiveFrom && name.effectiveTo === slovakName.effectiveTo)

                append({
                    name: translatedName?.value ?? '',
                    slovakName: slovakName.value ?? '',
                    from: slovakName.effectiveFrom ?? '',
                    to: slovakName.effectiveTo,
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLanguage])

    const onSubmit = async (formValues: FieldValues) => {
        const translationAlreadyExists = names?.some((name) => name.language === selectedLanguage) ?? false
        const requestData: ApiCodelistLanguageVersion = {
            language: formValues.language,
            codelistNames: (formValues as FormData).names.map((item) => ({
                language: formValues.language,
                value: item.name,
                effectiveFrom: item.from,
                effectiveTo: item.to ?? '',
            })),
        }

        if (translationAlreadyExists) {
            updateLanguageMutation({ code, data: requestData })
        } else {
            createLanguageMutation({ code, data: requestData })
        }
    }

    const isLoading = [isLoadingOriginal, isLoadingCreateLanguageMutation, isLoadingUpdateLanguageMutation].some((item) => item)
    const isMutationError = [isErrorCreateLanguageMutation, isErrorUpdateLanguageMutation].some((item) => item)
    const isMutationSuccess = [isSuccessCreateLanguageMutation, isSuccessUpdateLanguageMutation].some((item) => item)

    if (!names) return <></>

    return (
        <BaseModal isOpen={isOpen} close={handleOnClose}>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <div className={styles.modalContainer}>
                    <div className={styles.content}>
                        {isError && <QueryFeedback error={isError} loading={false} />}
                        <MutationFeedback
                            success={isMutationSuccess}
                            successMessage={t('codeListDetail.feedback.translationCreated')}
                            error={isMutationError ? t('feedback.mutationErrorMessage') : undefined}
                        />
                        <TextHeading size="L" className={styles.heading}>
                            {t('codeListDetail.modal.title.addLanguageVersion')}
                        </TextHeading>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <SimpleSelect
                                label={t('codeListDetail.form.label.language')}
                                name="language"
                                setValue={setValue}
                                options={Object.values(languages).map((lang) => ({ label: t(`codeListDetail.languages.${lang}`), value: lang }))}
                            />
                            {selectedLanguage && (
                                <>
                                    {fields.map((item, index) => {
                                        return (
                                            <>
                                                <Input
                                                    key={index}
                                                    {...register(`names.${index}.name`)}
                                                    hint={t('codeListDetail.form.hint.name', {
                                                        name: item.slovakName,
                                                    })}
                                                    label={t('codeListDetail.form.label.name')}
                                                    error={formState.errors.names?.message}
                                                />
                                            </>
                                        )
                                    })}
                                    <div className={styles.buttonGroup}>
                                        <Button type="submit" disabled={!formState.isValid} label={t('codeListDetail.form.label.submit')} />
                                        <Button label={t('confirmationModal.cancelButtonLabel')} variant="secondary" onClick={onClose} />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </QueryFeedback>
        </BaseModal>
    )
}
