import { useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroupRow, ErrorBlock, Input, TextHeading } from '@isdd/idsk-ui-kit'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useGetUuidHook } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import styles from './findView.module.scss'
import { generateFindIcoSchema } from './schemas/findIcoSchema'

import { iFindView } from '@/components/containers/public-authorities/FindContainer'

export const FindView = ({ onSearchIco, data, isLoading, error, isSame, onCloseMessage }: iFindView) => {
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
        navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES_LIST}`, { state: { from: location } })
    }, [location, navigate])

    const handleOnCreateClick = useCallback(async () => {
        const ico = watch('ico')
        const generatedUUID = await getUUID()
        navigate(`${AdminRouteNames.PUBLIC_AUTHORITIES}/${generatedUUID}/${ico}/create`, { state: { from: location } })
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
                errorProps={{ errorMessage: error }}
                indicatorProps={{ label: findIco ? t('publicAuthorities.find.loading') : t('loading.loadingSubPage') }}
                withChildren
            >
                {isSame && <MutationFeedback success={false} error={t('publicAuthorities.find.icoExist')} onMessageClose={onCloseMessage} />}
                <div>
                    <TextHeading size="XL">{t('publicAuthorities.find.new')}</TextHeading>
                    <div className={styles.form}>
                        {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Input
                                {...register('ico')}
                                label={t('publicAuthorities.find.ico')}
                                placeholder={t('publicAuthorities.find.icoPlaceholder')}
                                error={formState?.errors?.ico?.message}
                            />
                            <ButtonGroupRow>
                                <Button label={t('publicAuthorities.find.search')} type="submit" />
                                <Button label={t('publicAuthorities.find.cancel')} onClick={handleOnCancelClick} />
                                {showCreateButton && <Button label={t('publicAuthorities.find.createNew')} onClick={handleOnCreateClick} />}
                            </ButtonGroupRow>
                        </form>
                    </div>
                </div>
            </QueryFeedback>
        </>
    )
}
