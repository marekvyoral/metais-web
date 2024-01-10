import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FieldErrors, FieldValues, UseFormRegister, UseFormUnregister } from 'react-hook-form'
import { DynamicElements } from '@isdd/metais-common/components/DynamicElements/DynamicElements'
import { Input, TextHeading } from '@isdd/idsk-ui-kit/index'

import styles from '../monitoring.module.scss'

type HttpHeadersType = {
    register: UseFormRegister<FieldValues>
    unregister: UseFormUnregister<FieldValues>
    errors: FieldErrors<{ httpRequestHeader: string[][] }>
    initialData?: {
        httpRequestHeader?: string[]
    }[]
}

type HttpRequestHeaderLineType = {
    index?: number
    register: UseFormRegister<FieldValues>
    unregister?: UseFormUnregister<FieldValues>
    errors: FieldErrors<{ httpRequestHeader: string[][] }>
}

const HttpRequestHeaderLine: React.FC<HttpRequestHeaderLineType> = ({ index, errors, register, unregister }) => {
    const { t } = useTranslation()
    useEffect(
        () => () => {
            unregister?.(`httpRequestHeader.${index ?? 0}.${0}`)
            unregister?.(`httpRequestHeader.${index ?? 0}.${1}`)
        },
        [index, unregister],
    )

    return (
        <div className={styles.inline}>
            <Input
                placeholder={t('monitoring.compose.generalInputPlaceholder')}
                {...register(`httpRequestHeader.${index ?? 0}.${0}`)}
                error={errors?.httpRequestHeader?.[index ?? 0]?.[0]?.message}
                label={t('monitoring.compose.name')}
                className={styles.inlineItem}
            />
            <Spacer horizontal />
            <Input
                placeholder={t('monitoring.compose.generalInputPlaceholder')}
                {...register(`httpRequestHeader.${index ?? 0}.${1}`)}
                error={errors?.httpRequestHeader?.[index ?? 0]?.[1]?.message}
                label={t('monitoring.compose.value')}
                className={styles.inlineItem}
            />
        </div>
    )
}
export const HttpRequestHeaders: React.FC<HttpHeadersType> = ({ initialData, errors, register, unregister }) => {
    const { t } = useTranslation()

    return (
        <>
            <TextHeading size={'M'} className="marginBottom0">
                {t('monitoring.compose.httpRequestHeader')}
            </TextHeading>

            <DynamicElements<{ httpRequestHeader?: string[] }>
                renderableComponent={(index) => <HttpRequestHeaderLine index={index} register={register} errors={errors} unregister={unregister} />}
                defaultRenderableComponentData={{}}
                addItemButtonLabelText={'+  ' + t('monitoring.compose.addNextHttpHeaderItem')}
                initialElementsData={initialData}
            />
        </>
    )
}
