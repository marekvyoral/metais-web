import { Button, ButtonGroupRow, InformationBar, RadioButton, RadioGroupWithLabel, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { getGetCurrentSystemStateQueryKey } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IView } from '@/components/system-status/SystemStatusContainer'

export const SystemStatusView: React.FC<IView> = ({
    currentSystemState,
    systemStates,
    systemStatesColors,
    saveInfoBar,
    deleteInfoBar,
    setCurrentData,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const stateKey = getGetCurrentSystemStateQueryKey()
    const queryClient = useQueryClient()

    const onSubmit = async () => {
        await saveInfoBar({
            data: {
                text: currentSystemState?.text,
                systemState: currentSystemState?.systemState?.code,
                systemStateColor: currentSystemState?.systemStateColor?.code,
            },
        })
        queryClient.invalidateQueries(stateKey)
    }

    const onDelete = async () => {
        await deleteInfoBar()
        queryClient.invalidateQueries(stateKey)
    }

    const saveButtonEnabled = currentSystemState?.text && currentSystemState?.systemState && currentSystemState?.systemStateColor

    return (
        <React.Fragment>
            <ButtonGroupRow>
                <TextHeading size={'XL'}>{t('navMenu.systemState.heading')}</TextHeading>
                <div style={{ marginLeft: 'auto' }} />
                <Tooltip
                    on={'focus'}
                    tooltipContent={(open, close) => (
                        <Button
                            onMouseOver={open}
                            onMouseOut={close}
                            key={0}
                            variant="secondary"
                            label={t('systemState.delete')}
                            onClick={async () => onDelete()}
                        />
                    )}
                    descriptionElement={t('systemState.deleteInfo')}
                    position={'bottom center'}
                    arrow={false}
                />
            </ButtonGroupRow>
            <InformationBar
                color={currentSystemState?.systemStateColor?.value}
                text={currentSystemState?.text ?? ''}
                status={
                    i18n.language == Languages.SLOVAK ? currentSystemState?.systemState?.value ?? '' : currentSystemState?.systemState?.engValue ?? ''
                }
            />
            {currentSystemState && (
                <React.Fragment>
                    <RadioGroupWithLabel label={t('systemState.status')} className="govuk-radios--small" inline>
                        {systemStates?.map((status, index) => (
                            <RadioButton
                                key={index}
                                id={status.code ?? ''}
                                name="systemState"
                                checked={currentSystemState.systemState?.code === status.code}
                                value={status.code ?? ''}
                                label={i18n.language == Languages.SLOVAK ? status?.value ?? '' : status?.engValue ?? ''}
                                onChange={() =>
                                    setCurrentData({
                                        ...currentSystemState,
                                        systemState: systemStates.at(index),
                                    })
                                }
                            />
                        ))}
                    </RadioGroupWithLabel>
                    <RadioGroupWithLabel label={t('systemState.color')} className="govuk-radios--small" inline>
                        {systemStatesColors?.map((status, index) => (
                            <RadioButton
                                key={index}
                                id={status.code ?? ''}
                                name="systemStateColor"
                                checked={currentSystemState.systemStateColor?.code === status.code}
                                value={status.code ?? ''}
                                label={i18n.language == Languages.SLOVAK ? status?.description ?? '' : status?.engDescription ?? ''}
                                onChange={() =>
                                    setCurrentData({
                                        ...currentSystemState,
                                        systemStateColor: systemStatesColors.at(index),
                                    })
                                }
                            />
                        ))}
                    </RadioGroupWithLabel>
                </React.Fragment>
            )}
            <RichTextQuill
                name={'text'}
                id={'text'}
                label={t('systemState.requiredText')}
                value={currentSystemState?.text}
                onChange={(newValue) => {
                    setCurrentData({ ...currentSystemState, text: newValue })
                }}
            />

            <ButtonGroupRow>
                <Button
                    key={1}
                    variant="secondary"
                    label={t('actionsInTable.cancel')}
                    onClick={() => {
                        navigate(-1)
                    }}
                />

                <Button key={3} label={t('codelists.save')} onClick={() => onSubmit()} disabled={!saveButtonEnabled} />
            </ButtonGroupRow>
        </React.Fragment>
    )
}
