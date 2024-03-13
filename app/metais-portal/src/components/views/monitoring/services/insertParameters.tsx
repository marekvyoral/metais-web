import { CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, GridCol, GridRow, InfoIconWithText, Input, TextBody, TextHeading, TransparentButtonWrapper } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useSearchParams } from 'react-router-dom'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { ENTITY_AS, ENTITY_ISVS, ENTITY_KS } from '@isdd/metais-common/constants'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { FieldValues, useForm } from 'react-hook-form'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { CiFilterUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { number, object, string } from 'yup'
import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'

import styles from './service.module.scss'
import { paramTypeEnum } from './utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IInsertMonitoringView, IValueParam } from '@/components/containers/MonitoringServiceImportContainer'
export interface MonitoringInsertFilterData extends IFilterParams, FieldValues, IFilterParams, IFilter {
    isvs?: string
    serviceType?: string
}

let count = 1

export const InsertParametersView: React.FC<IInsertMonitoringView> = ({ isLoading, isError, isSuccess, paramTypeData, handleAddParams }) => {
    const { t } = useTranslation()
    const [urlParams] = useSearchParams()
    const [services, setServices] = useState<ConfigurationItemUi[] | undefined>()
    const [isvs, setIsvs] = useState<ConfigurationItemUi>()
    const [serviceFilter, setServiceFilter] = useState<CiFilterUi>()
    const [valueParams, setValueParams] = useState<IValueParam[]>([])
    const serviceType = urlParams.get('serviceType') ?? ''
    const {
        state: { user },
    } = useAuth()

    const schema = object().shape(
        {
            valueParams: yup.array().of(
                yup.object().shape({
                    dateFrom: string().required(t('validation.required')),
                    name: string(),
                    id: number(),
                    value: string().required(t('validation.required')),
                }),
            ),
        },
        [['valueParams', 'valueParams']],
    )

    const { handleSubmit, register, formState, control, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            valueParams: valueParams.map((param) => {
                return { ...param, dateFrom: param.dateFrom.toISOString() }
            }),
        },
    })

    const insertParams = () => {
        const params = paramTypeData?.results?.map((param) => {
            count = count + 1
            return {
                id: count,
                description: param.description,
                name: param.name,
                paramType: param.id,
                unit: param.unit,
                value: '',
                dateFrom: new Date(),
            } as IValueParam
        })

        setValueParams([...valueParams, ...(params ?? [])])
    }

    const getUnitMark = (unit: string) => {
        switch (unit) {
            case paramTypeEnum.PARAM_TYPE_UNIT_SECONDS:
                return 's'
            case paramTypeEnum.PARAM_TYPE_UNIT_MILLISECONDS:
                return 'ms'
            case paramTypeEnum.PARAM_TYPE_UNIT_PERCENTAGE:
                return '%'
            case paramTypeEnum.PARAM_TYPE_UNIT_HOURS:
                return 'hod'
            default:
                return ''
        }
    }

    const removeParam = (id: number) => {
        if (valueParams.find((param) => param.id === id)) {
            const rem = valueParams.filter((param) => param.id !== id)
            setValueParams(rem)
        }
    }

    const getGuids = () => {
        const organizations = user?.groupData
        const gids: string[] = []

        organizations?.forEach((org) => {
            org.roles.forEach((role) => {
                if (role.roleName === 'MON_SPRAVA') {
                    gids.push(role.gid)
                }
            })
        })

        return gids
    }

    const getUserPo = () => {
        const organizations = user?.groupData
        return organizations?.map((org) => {
            return org.orgId
        })
    }

    const getPOsWithRoles = () => {
        const pos: string[] = []
        const gids = getGuids()
        const userPOs = getUserPo()

        userPOs?.forEach((userPO) => {
            gids.forEach((gid) => {
                if (gid.indexOf(userPO) > -1) {
                    pos.push(userPO)
                }
            })
        })

        return pos
    }

    const onSubmit = (formValues: FieldValues) => {
        const mappedVal = formValues.valueParams.map((param: IValueParam) => {
            return {
                ...param,
                dateFrom: new Date(param.dateFrom),
                value: param.value,
            }
        })
        handleAddParams(mappedVal)
    }
    const errors = formState?.errors

    return (
        <MainContentWrapper>
            <QueryFeedback loading={isLoading} error={isError} withChildren>
                <MutationFeedback success={isSuccess} successMessage={t('mutationFeedback.monitoringInsert')} />
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('titles.monitoringInsert')}</TextHeading>
                </FlexColumnReverseWrapper>
                <GridRow>
                    <GridCol setWidth="full">
                        <SelectPOForFilter
                            isMulti={false}
                            ciType={ENTITY_ISVS}
                            label={t('monitoringServices.filter.isvs')}
                            name="isvs"
                            valuesAsUuids={[]}
                            onChange={(val) => {
                                const sel = Array.isArray(val) ? val[0] : val
                                setIsvs(sel)
                                const filter = {
                                    metaAttributes: {
                                        state: ['DRAFT'],
                                        liableEntity: getPOsWithRoles(),
                                        liableEntityByHierarchy: true,
                                    },
                                    type: [serviceType === ENTITY_AS ? ENTITY_AS : ENTITY_KS],
                                    relTypeFilters: [{ relCiUuids: [sel?.uuid], relType: 'ISVS_realizuje_AS' }],
                                } as CiFilterUi

                                setServiceFilter(filter)
                            }}
                        />
                    </GridCol>
                    <GridCol setWidth="full">
                        <SelectPOForFilter
                            required
                            disabled={!isvs}
                            isMulti
                            ciType={serviceType === ENTITY_AS ? ENTITY_AS : ENTITY_KS}
                            label={t('monitoringServices.filter.service')}
                            name="service"
                            valuesAsUuids={isvs?.uuid ? [isvs?.uuid] : []}
                            onChange={(val) => {
                                const items: ConfigurationItemUi[] = []
                                val?.map((item) => {
                                    if (item?.uuid) {
                                        items.push(item)
                                    }
                                })
                                if (items.length) {
                                    setServices([...items])
                                } else {
                                    setServices(undefined)
                                }
                            }}
                            ciFilter={serviceFilter}
                        />
                    </GridCol>
                </GridRow>
                <GridRow>
                    <GridCol setWidth="full">
                        {services && (
                            <div className={styles.buttonGroupStart}>
                                <CreateEntityButton
                                    onClick={() => {
                                        return insertParams()
                                    }}
                                    label={t('insertMonitoring.buttonInsertParam')}
                                />
                                <TextBody>{t('insertMonitoring.buttonInsertDescParam')}</TextBody>
                            </div>
                        )}
                    </GridCol>
                </GridRow>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.topSpace} noValidate>
                    {valueParams.length > 0 && (
                        <GridRow key={`row0-column`}>
                            <GridCol key={`name-column`} setWidth="one-third">
                                <TextBody>{t('insertMonitoring.columns.parameterType')}</TextBody>
                            </GridCol>
                            <GridCol key={`date-column`} setWidth="one-third">
                                <TextBody>{t('insertMonitoring.columns.parameterDate')}</TextBody>
                            </GridCol>
                            <GridCol key={`value-column`} setWidth="one-third">
                                <TextBody>{t('insertMonitoring.columns.parameterValue')}</TextBody>
                            </GridCol>
                        </GridRow>
                    )}
                    {valueParams?.map((param, index) => {
                        return (
                            <GridRow key={`row-${index}`} className={styles.paramGroup}>
                                <GridCol key={`name-${index}`} setWidth="one-third">
                                    <TextBody>
                                        <InfoIconWithText
                                            key={`${param.name}-${index}`}
                                            {...register(`valueParams.${index}.name`)}
                                            tooltip={param.description}
                                        >
                                            {param.name}
                                        </InfoIconWithText>
                                    </TextBody>
                                </GridCol>
                                <GridCol key={`dateFrom-${index}`} setWidth="one-third">
                                    <DateInput
                                        {...register(`valueParams.${index}.dateFrom`)}
                                        error={errors?.valueParams?.[index]?.dateFrom?.message?.toString()}
                                        className="marginBottom0"
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                                <GridCol key={`value-${index}`} setWidth="one-third">
                                    <div className={styles.buttonGroupStart}>
                                        <Input
                                            type="number"
                                            key={`${param.name}-value-${index}`}
                                            {...register(`valueParams.${index}.value`)}
                                            error={errors?.valueParams?.[index]?.value?.message?.toString()}
                                            className="marginBottom0"
                                        />
                                        <TextBody className="marginBottom0">{getUnitMark(param.unit)}</TextBody>
                                        <TransparentButtonWrapper
                                            type="button"
                                            onClick={() => {
                                                removeParam(param?.id)
                                            }}
                                        >
                                            <img src={ImportDeleteIcon} className={styles.clickable} />
                                        </TransparentButtonWrapper>

                                        <input
                                            readOnly
                                            hidden
                                            {...register(`valueParams.${index}.id`)}
                                            key={`${param.name}-id-${index}`}
                                            value={param?.id}
                                        />
                                    </div>
                                </GridCol>
                            </GridRow>
                        )
                    })}
                    {valueParams.length > 0 && (
                        <div className={styles.buttonGroupEnd}>
                            <Button label={t('insertMonitoring.buttonSendForm')} disabled={!formState.isValid} type="submit" />
                        </div>
                    )}
                </form>
            </QueryFeedback>
        </MainContentWrapper>
    )
}
