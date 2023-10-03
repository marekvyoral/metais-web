import { useCallback, useEffect, useState } from 'react'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetUuidHook } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'

import styles from './findView.module.scss'
import { generateFindIcoSchema } from './schemas/findIcoSchema'

import { iFindView } from '@/components/containers/organizations/FindContainer'

export const FindView = ({ onSearchIco, data, isLoading, error, isSame }: iFindView) => {
    const { t } = useTranslation()
    const formMethods = useForm({
        resolver: yupResolver(generateFindIcoSchema(t)),
        mode: 'onChange',
    })
    const navigate = useNavigate()
    const location = useLocation()
    const [showCreateButton, setShowCreateButton] = useState<boolean>(false)
    const [findIco, setFindIco] = useState<boolean>(false)
    const { handleSubmit, register, formState, watch } = formMethods
    const getUUID = useGetUuidHook()

    const onSubmit = (formValues: FieldValues) => {
        setFindIco(true)
        onSearchIco(formValues?.ico)
    }

    const handleOnCancelClick = useCallback(() => {
        navigate('/organizations', { state: { from: location } })
    }, [location, navigate])

    const handleOnCreateClick = useCallback(async () => {
        const ico = watch('ico')
        const generatedUUID = await getUUID()
        navigate(`/organizations/${generatedUUID}/${ico}/create`, { state: { from: location } })
    }, [watch, getUUID, navigate, location])

    useEffect(() => {
        if (data?.foundCiType?.configurationItemSet?.length == 0) setShowCreateButton(true)
        else setShowCreateButton(false)
    }, [data?.foundCiType?.configurationItemSet?.length])

    return (
        <>
            <QueryFeedback
                loading={isLoading}
                error={!!error}
                indicatorProps={{ label: findIco ? t('organizations.find.loading') : t('loading.loadingSubPage') }}
                withChildren
            >
                {isSame && <MutationFeedback success={false} error={t('organizations.find.icoExist')} />}
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
            </QueryFeedback>
        </>
    )
}
