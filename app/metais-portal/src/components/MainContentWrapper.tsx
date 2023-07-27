import classNames from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { DataObjectsIcon, EgovComponentsIcon, InstructionsIcon, MonitoringIcon, StandartsIcon } from '@isdd/metais-common/assets/images'
import StickyBox from 'react-sticky-box'

import { SidebarItems } from './sidebar/SidebarItems'
import { Sidebar } from './sidebar/Sidebar'

import styles from '@/components/GridView.module.scss'
import { SidebarButton } from '@/components/sidebar/SidebarButton'
export const MainContentWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation()

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
    return (
        <div className={classNames(styles.container)} id="main-content">
            <StickyBox className={classNames(styles.sidebarContainer, !isSidebarExpanded && styles.closedSidebar)}>
                <SidebarButton isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
                <Sidebar
                    isSidebarExpanded={isSidebarExpanded}
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    sections={[
                        {
                            title: t('navMenu.egovComponents'),
                            path: RouteNames.HOW_TO_EGOV_COMPONENTS,
                            icon: EgovComponentsIcon,
                            content: (
                                <SidebarItems
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
                            ),
                        },
                        {
                            path: RouteNames.HOW_TO_STANDARDIZATION,
                            title: t('navMenu.standardization'),
                            icon: StandartsIcon,
                            content: (
                                <SidebarItems
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
                            ),
                        },
                        {
                            path: RouteNames.HOW_TO_DATA_OBJECTS,
                            title: t('navMenu.dataObjects'),
                            icon: DataObjectsIcon,
                            content: (
                                <SidebarItems
                                    list={[
                                        { title: t('navMenu.lists.registers'), path: NavigationSubRoutes.REFERENCE_REGISTRE },
                                        { title: t('navMenu.lists.counters'), path: NavigationSubRoutes.CISELNIKY },
                                        { title: t('navMenu.lists.centralModel'), path: NavigationSubRoutes.CENTRALNY_DATOVY_MODEL },
                                        { title: t('navMenu.lists.prud'), path: NavigationSubRoutes.PRUD },
                                        { title: t('navMenu.lists.sdg'), path: NavigationSubRoutes.JEDNOTNA_DIGITALNA_BRANA },
                                    ]}
                                />
                            ),
                        },
                        {
                            path: RouteNames.HOW_TO_MONITORING,
                            title: t('navMenu.monitoring'),
                            icon: MonitoringIcon,
                            content: (
                                <SidebarItems
                                    list={[
                                        { title: t('navMenu.lists.overviews'), path: NavigationSubRoutes.PREHLADY },
                                        { title: t('navMenu.lists.monitoringEnd'), path: NavigationSubRoutes.MONITORING_KS },
                                        { title: t('navMenu.lists.monitoringApp'), path: NavigationSubRoutes.MONITORING_AS },
                                        { title: t('navMenu.lists.monitoringSet'), path: NavigationSubRoutes.MONITORING_PARAMETRE_SET },
                                    ]}
                                />
                            ),
                        },
                        {
                            path: RouteNames.PREHLADY_A_POSTUPY,
                            title: t('navMenu.guides'),
                            icon: InstructionsIcon,
                        },
                    ]}
                />
            </StickyBox>
            <main
                className={classNames(
                    'govuk-main-wrapper govuk-main-wrapper--auto-spacing',
                    styles.content,
                    !isSidebarExpanded && styles.closedContent,
                )}
            >
                {children}
            </main>
        </div>
    )
}
