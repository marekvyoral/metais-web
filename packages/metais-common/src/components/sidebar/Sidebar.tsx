import React, { SetStateAction } from 'react'
import StickyBox from 'react-sticky-box'
import classNames from 'classnames'

import { SidebarButton } from './SidebarButton'
import { SidebarSectionsContainer } from './SidebarSectionsContainer'

import styles from '@isdd/metais-common/components/GridView.module.scss'
import { NavigationItem } from '@isdd/metais-common/navigation/routeNames'

interface Props {
    sections: NavigationItem[]
    isSidebarExpanded: boolean
    setIsSidebarExpanded: React.Dispatch<SetStateAction<boolean>>
}

export const Sidebar = ({ sections, isSidebarExpanded, setIsSidebarExpanded }: Props) => {
    return (
        <StickyBox className={classNames(styles.sidebarContainer, !isSidebarExpanded && styles.closedSidebar)}>
            <SidebarButton isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <SidebarSectionsContainer isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} sections={sections} />
        </StickyBox>
    )
}
