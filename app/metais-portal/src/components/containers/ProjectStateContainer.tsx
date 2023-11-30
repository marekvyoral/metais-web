import { IStep } from '@isdd/idsk-ui-kit/index'
import {
    ConfigurationItemUi,
    HistoryVersionsListUiConfigurationItemUi,
    useReadCiHistoryVersions,
    useReadCiHistoryVersionsActionsList,
} from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumItem, useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    ACTION_CREATE,
    ACTION_UPDATE,
    FINISHED_STATE,
    NOT_APPROVED_STATE,
    PROJECT_STATUS,
    RATED_STATE,
    RETURNED_STATE,
    RE_RATED_STATE,
    STAV_PROJEKTU,
} from '@isdd/metais-common/constants'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import React from 'react'

export interface IView {
    steps: IStep[]
    currentStep: number
    isLoading: boolean
}

interface IProjectStateContainer {
    configurationItemId: string
    ciData: ConfigurationItemUi
    View: React.FC<IView>
}

const mapHistory = (data?: HistoryVersionsListUiConfigurationItemUi, defaultProjectStates?: EnumItem[]) => {
    const uniqueValues = new Set<string>()

    return data?.historyVersions
        ?.filter((obj) => {
            const code: string = Object.values(obj.item?.attributes ?? {}).find((attr) => attr.name == PROJECT_STATUS)?.value
            if (!uniqueValues.has(code) && (obj.actions?.includes(ACTION_CREATE) || obj.actions?.includes(ACTION_UPDATE))) {
                uniqueValues.add(code)
                return true
            }
            return false
        })
        .sort((a, b) => new Date(a.actionTime ?? '').getTime() - new Date(b.actionTime ?? '').getTime())
        .map((i) => {
            return {
                date: formatDateTimeForDefaultValue(i.actionTime ?? ''),
                state: defaultProjectStates?.find(
                    (st) => st.code == Object.values(i.item?.attributes ?? {}).find((attr) => attr.name == PROJECT_STATUS)?.value,
                ),
            }
        })
}

export const ProjectStateContainer: React.FC<IProjectStateContainer> = ({ configurationItemId, ciData, View }) => {
    const { data: defaultProjectStates, isLoading: isDefaultStatesLoading } = useGetValidEnum(STAV_PROJEKTU)
    const projectsStates = defaultProjectStates?.enumItems?.sort((a, b) => (a.orderList ?? 0) - (b.orderList ?? 0))

    const { data: actions, isLoading: isActionsLoading } = useReadCiHistoryVersionsActionsList(configurationItemId)
    const { data: historyData, isLoading: isHistoryLoading } = useReadCiHistoryVersions(configurationItemId, {
        page: 1,
        perPage: 1000,
        action: actions?.filter((a) => a == ACTION_CREATE || a == ACTION_UPDATE),
    })

    const mappedHistory = mapHistory(historyData, projectsStates)

    const fullSteps: IStep[] =
        projectsStates?.map((ps) => {
            if (ps.code == FINISHED_STATE && ciData?.attributes?.EA_Profil_Projekt_termin_ukoncenia) {
                return { name: ps.value ?? '', date: formatDateForDefaultValue(ciData?.attributes?.EA_Profil_Projekt_termin_ukoncenia, 'dd.MM.yyyy') }
            }
            if (ps.code == RATED_STATE && ciData?.attributes?.EA_Profil_Projekt_status == RE_RATED_STATE) {
                return {
                    name: ps.value ?? '',
                    date: mappedHistory?.find((mp) => mp.state == ps.value)?.date,
                    description: projectsStates?.find((ps1) => ps1.code == RE_RATED_STATE)?.value,
                }
            }
            if (ps.code == RATED_STATE && ciData?.attributes?.EA_Profil_Projekt_status == RETURNED_STATE) {
                return {
                    name: ps.value ?? '',
                    date: mappedHistory?.find((mp) => mp.state == ps.value)?.date,
                    description: projectsStates?.find((ps2) => ps2.code == RETURNED_STATE)?.value,
                }
            }
            return { name: ps.value ?? '', date: mappedHistory?.find((mp) => mp.state == ps.value)?.date }
        }) ?? []
    const steps = fullSteps.filter((fs) => fs.name != defaultProjectStates?.enumItems?.find((e) => e.code == RETURNED_STATE)?.value)

    let currentStep = steps.indexOf(
        steps.find(
            (s) => s.name == defaultProjectStates?.enumItems?.find((dps) => dps.code == ciData?.attributes?.EA_Profil_Projekt_status)?.value,
        ) ?? steps[0],
    )

    if (ciData?.attributes?.EA_Profil_Projekt_status == RE_RATED_STATE || ciData?.attributes?.EA_Profil_Projekt_status == RETURNED_STATE) {
        currentStep = steps.indexOf(
            steps.find((s) => s.name == defaultProjectStates?.enumItems?.find((d) => d.code == RATED_STATE)?.value) ?? steps[0],
        )
    }
    const removedSteps = steps.splice(-2)
    if (ciData?.attributes?.EA_Profil_Projekt_status == NOT_APPROVED_STATE) {
        steps.splice(3, steps.length)

        removedSteps[removedSteps.length - 1] && steps.push({ ...removedSteps[removedSteps.length - 1], isRed: true })
        currentStep = steps.length
    }
    return <View steps={steps ?? []} currentStep={currentStep ?? 0} isLoading={isDefaultStatesLoading || isActionsLoading || isHistoryLoading} />
}
