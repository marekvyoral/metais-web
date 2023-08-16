import React, { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import styles from './findView.module.scss'
import { generateFindIcoSchema } from './schemas/findIcoSchema'

import { iFindView } from '@/components/containers/organizations/FindContainer'

export const FindView = ({ setIcoToSearch, data }: iFindView) => {
    const { t } = useTranslation()
    const formMethods = useForm({
        resolver: yupResolver(generateFindIcoSchema(t)),
        mode: 'onChange',
    })
    const navigate = useNavigate()
    const [showCreateButton, setShowCreateButton] = useState<boolean>(false)
    const { handleSubmit, register, formState, watch } = formMethods

    const onSubmit = useCallback(
        (formValues: FieldValues) => {
            setIcoToSearch(formValues?.ico)
        },
        [setIcoToSearch],
    )

    const handleOnCancelClick = useCallback(() => {
        navigate('/organizations')
    }, [navigate])

    const handleOnCreateClick = useCallback(() => {
        const ico = watch('ico')
        if (data?.generatedUUID) navigate(`/organizations/${data?.generatedUUID}/${ico}/create`)
    }, [navigate, watch, data?.generatedUUID])

    useEffect(() => {
        if (data?.foundCiType?.configurationItemSet?.length == 0) setShowCreateButton(true)
        else setShowCreateButton(false)
    }, [data?.foundCiType?.configurationItemSet?.length])

    return (
        <div>
            <h1>{t('organizations.find.new')}</h1>
            <div className={styles.form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        {...register('ico')}
                        label={t('organizations.find.ico')}
                        placeholder={t('organizations.find.icoPlaceholder')}
                        error={formState?.errors?.ico?.message}
                    />
                    <div className={styles.buttonsGroup}>
                        <Button label={t('organizations.find.search')} type="submit" />
                        <Button label={t('organizations.find.cancel')} onClick={handleOnCancelClick} />
                    </div>
                </form>
            </div>
            <div>{showCreateButton && <Button label={t('organizations.find.createNew')} onClick={handleOnCreateClick} />}</div>
        </div>
    )
}