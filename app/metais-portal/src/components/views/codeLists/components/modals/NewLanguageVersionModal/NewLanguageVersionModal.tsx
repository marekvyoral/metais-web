import { BaseModal, Input, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import {
    useGetOriginalCodelistHeader,
    useUpdateCodelistLanguageVersion,
    useCreateCodelistLanguageVersion,
    ApiCodelistLanguageVersion,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { QueryFeedback, MutationFeedback, ModalButtons } from '@isdd/metais-common/index'
import { useCallback, useEffect } from 'react'

import styles from './newLanguageVersionModal.module.scss'

import { NewLanguageFormData, useNewLanguageSchema, AddNewLanguageList } from '@/components/views/codeLists/useCodeListSchemas'
import { getErrorTranslateKeys } from '@/componentHelpers'

export interface NewLanguageVersionModalProps {
    code: string
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export const NewLanguageVersionModal: React.FC<NewLanguageVersionModalProps> = ({ code, isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation()
    const { schema } = useNewLanguageSchema()

    const { register, formState, handleSubmit, setValue, reset, watch, control } = useForm<NewLanguageFormData>({
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

    const { isFetching: isLoadingOriginal, isError, data: codeListOriginalData } = useGetOriginalCodelistHeader(code)

    const queryOnSuccess = () => {
        onSuccess()
    }
    const {
        mutateAsync: updateLanguageMutation,
        error: errorUpdateLanguageMutation,
        isLoading: isLoadingUpdateLanguageMutation,
    } = useUpdateCodelistLanguageVersion({
        mutation: {
            onSuccess: queryOnSuccess,
        },
    })
    const {
        mutateAsync: createLanguageMutation,
        error: errorCreateLanguageMutation,
        isLoading: isLoadingCreateLanguageMutation,
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

    const onSubmit = async (formValues: NewLanguageFormData) => {
        const translationAlreadyExists = names?.some((name) => name.language === selectedLanguage) ?? false
        const requestData: ApiCodelistLanguageVersion = {
            language: formValues.language,
            codelistNames: formValues.names.map((item) => ({
                language: formValues.language,
                value: item.name,
                effectiveFrom: item.from,
                effectiveTo: item.to ?? '',
            })),
        }

        if (translationAlreadyExists) {
            await updateLanguageMutation({ code, data: requestData })
        } else {
            await createLanguageMutation({ code, data: requestData })
        }
    }

    const isLoading = [isLoadingOriginal, isLoadingCreateLanguageMutation, isLoadingUpdateLanguageMutation].some((item) => item)
    const errorMessages = getErrorTranslateKeys([errorCreateLanguageMutation, errorUpdateLanguageMutation].map((item) => item as { message: string }))

    if (!names) return <></>

    return (
        <BaseModal isOpen={isOpen} close={handleOnClose}>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.modalContainer}>
                        <div className={styles.content}>
                            <TextHeading size="L" className={styles.heading}>
                                {t('codeListDetail.modal.title.addLanguageVersion')}
                            </TextHeading>
                            {isError && <QueryFeedback error={isError} loading={false} />}
                            {errorMessages.map((errorMessage, index) => (
                                <MutationFeedback
                                    success={false}
                                    key={index}
                                    showSupportEmail
                                    error={t([errorMessage, 'feedback.mutationErrorMessage'])}
                                />
                            ))}

                            <SimpleSelect
                                label={t('codeListDetail.form.label.language')}
                                name="language"
                                setValue={setValue}
                                options={Object.values(AddNewLanguageList).map((lang) => ({
                                    label: t(`codeListDetail.languages.${lang}`),
                                    value: lang,
                                }))}
                                className={styles.stretch}
                            />
                            {selectedLanguage && (
                                <>
                                    {fields.map((item, index) => {
                                        return (
                                            <Input
                                                key={index}
                                                {...register(`names.${index}.name`)}
                                                hint={t('codeListDetail.form.hint.name', {
                                                    name: item.slovakName,
                                                })}
                                                label={t('codeListDetail.form.label.name')}
                                                error={formState.errors.names?.message}
                                            />
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                    <ModalButtons
                        submitButtonLabel={t('codeListDetail.form.label.submit')}
                        closeButtonLabel={t('confirmationModal.cancelButtonLabel')}
                        onClose={handleOnClose}
                        disabled={!formState.isValid}
                    />
                </form>
            </QueryFeedback>
        </BaseModal>
    )
}
