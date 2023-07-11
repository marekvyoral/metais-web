import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { NavMenuItem } from './NavMenuItem'

import { NavigationSubRoutes, RouteNames } from '@/navigation/routeNames'

interface INavMenuList {
    activeTab: RouteNames | undefined
    setActiveTab: React.Dispatch<React.SetStateAction<RouteNames | undefined>>
}

export const NavMenuList: React.FC<INavMenuList> = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation()

    return (
        <ul className="idsk-header-web__nav-list " aria-label={t('navMenu.mainNav')}>
            <NavMenuItem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                path={RouteNames.HOW_TO_PUBLIC_AUTHORITIES}
                title={t('navMenu.publicAuthorities')}
                list={[
                    { title: t('navMenu.lists.processorsOfITDevelopmentConcepts'), path: NavigationSubRoutes.PROCESSORS_OF_IT_DEVELOPMENT_CONCEPTS },
                    { title: t('navMenu.lists.subordinates'), path: NavigationSubRoutes.SUBORDINATES },
                    { title: t('navMenu.lists.ISoperators'), path: NavigationSubRoutes.IS_OPERATORS },
                ]}
            />
            <NavMenuItem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                path={RouteNames.HOW_TO_EGOV_COMPONENTS}
                title={t('navMenu.egovComponents')}
                list={[
                    { title: t('navMenu.lists.programs'), path: NavigationSubRoutes.PROGRAM },
                    { title: t('navMenu.lists.projects'), path: NavigationSubRoutes.PROJEKT },
                    { title: t('navMenu.lists.endServices'), path: NavigationSubRoutes.KONCOVE_SLUZBY },
                    { title: t('navMenu.lists.applicationServices'), path: NavigationSubRoutes.APLIKACNE_SLUZBY },
                    { title: t('navMenu.lists.isvs'), path: NavigationSubRoutes.ISVS },
                    { title: t('navMenu.lists.evidenceObjects'), path: NavigationSubRoutes.OBJEKTY_EVIDENCIE },
                    { title: t('navMenu.lists.attributesEvidenceObjects'), path: NavigationSubRoutes.ATRIBUTY_OBJEKTY_EVIDENCIE },
                    { title: t('navMenu.lists.infrastructures'), path: NavigationSubRoutes.INFRASCTRUCTURES },
                    { title: t('navMenu.lists.authorities'), path: NavigationSubRoutes.AUTORITY },
                    { title: t('navMenu.lists.servers'), path: NavigationSubRoutes.SERVERY },
                    { title: t('navMenu.lists.virtualMachines'), path: NavigationSubRoutes.VIRTUALNE_STROJE },
                    { title: t('navMenu.lists.operationPlace'), path: NavigationSubRoutes.MIESTO_PREVADZKY },
                    { title: t('navMenu.lists.notInOVM'), path: NavigationSubRoutes.NIE_SU_OVM },
                    { title: t('navMenu.lists.licenses'), path: NavigationSubRoutes.LICENCIE },
                ]}
            />
            <NavMenuItem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                path={RouteNames.HOW_TO_STANDARDIZATION}
                title={t('navMenu.standardization')}
                list={[
                    { title: t('navMenu.lists.standards'), path: NavigationSubRoutes.STANDARDY_ISVS },
                    {
                        title: t('navMenu.lists.commission'),
                        path: NavigationSubRoutes.KOMISIA_NA_STANDARDIZACIU,
                    },
                    { title: t('navMenu.lists.groups'), path: NavigationSubRoutes.PRACOVNE_SKUPINY_KOMISIE },

                    {
                        title: t('navMenu.lists.concepts'),
                        path: NavigationSubRoutes.ZOZNAM_NAVRHOV,
                    },
                    {
                        title: t('navMenu.lists.votes'),
                        path: NavigationSubRoutes.ZOZNAM_HLASOV,
                    },
                    {
                        title: t('navMenu.lists.meetings'),
                        path: NavigationSubRoutes.ZOZNAM_ZASADNUTI,
                    },
                ]}
            />
            <NavMenuItem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                path={RouteNames.HOW_TO_DATA_OBJECTS}
                title={t('navMenu.dataObjects')}
                list={[
                    { title: t('navMenu.lists.registers'), path: NavigationSubRoutes.REFERENCE_REGISTRE },
                    { title: t('navMenu.lists.counters'), path: NavigationSubRoutes.CISELNIKY },
                    { title: t('navMenu.lists.centralModel'), path: NavigationSubRoutes.CENTRALNY_DATOVY_MODEL },
                    { title: t('navMenu.lists.prud'), path: NavigationSubRoutes.PRUD },
                    { title: t('navMenu.lists.sdg'), path: NavigationSubRoutes.JEDNOTNA_DIGITALNA_BRANA },
                ]}
            />
            <NavMenuItem
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                path={RouteNames.HOW_TO_MONITORING}
                title={t('navMenu.monitoring')}
                list={[
                    { title: t('navMenu.lists.overviews'), path: NavigationSubRoutes.PREHLADY },
                    { title: t('navMenu.lists.monitoringEnd'), path: NavigationSubRoutes.MONITORING_KS },
                    { title: t('navMenu.lists.monitoringApp'), path: NavigationSubRoutes.MONITORING_AS },
                    { title: t('navMenu.lists.monitoringSet'), path: NavigationSubRoutes.MONITORING_PARAMETRE_SET },
                ]}
            />

            <li className="idsk-header-web__nav-list-item">
                <Link className="govuk-link idsk-header-web__nav-list-item-link" to={RouteNames.PREHLADY_A_POSTUPY} title={t('navMenu.guides')}>
                    {t('navMenu.guides')}
                </Link>
            </li>
        </ul>
    )
}
