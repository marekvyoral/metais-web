import classnames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useWindowWidthBreakpoints } from '@isdd/metais-common/src/hooks/window-size/useWindowWidthBreakpoints'

import styles from './tabs.module.scss'
import { changeTabOrder } from './tabsUtils'

import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'

export interface Tab {
    id: string
    path?: string
    title: string
    content: React.ReactNode
    meta?: { [key: string]: string | number | boolean }
}

interface ITabItemDesktop {
    tab: Tab
    handleSelect: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: Tab) => void
    isSelected: boolean
    className?: string
}

const TabItemDesktop: React.FC<ITabItemDesktop> = ({ handleSelect, tab, isSelected, className }) => {
    return (
        <li key={tab.id} className={classnames(className, 'idsk-tabs__list-item', { 'idsk-tabs__list-item--selected': isSelected })}>
            <a
                className={classnames('idsk-tabs__tab')}
                href={`#${tab.id}`}
                onClick={(event) => handleSelect(event, tab)}
                role="tab"
                aria-selected={isSelected}
                aria-controls={tab.id}
            >
                {tab.title}
            </a>
        </li>
    )
}

interface ITabItemContent {
    tab: Tab
    handleMobileSelect: (value: Tab) => void
    isSelected: boolean
}

const TabItemContent: React.FC<ITabItemContent> = ({ tab, handleMobileSelect, isSelected }) => {
    const windowWidth = useWindowWidthBreakpoints()
    const sectionId = `${tab.id}-section`
    return (
        <li key={tab.id} className="idsk-tabs__list-item--mobile" role="presentation">
            <button
                className={classnames('govuk-caption-l', 'idsk-tabs__mobile-tab', isSelected && 'idsk-tabs__mobile-tab--selected')}
                role="tab"
                aria-controls={tab.id}
                aria-selected={isSelected}
                onClick={() => handleMobileSelect(tab)}
            >
                <span id={tab.id}>{tab.title}</span>
                <span className="idsk-tabs__tab-arrow-mobile" />
            </button>
            <section
                className={classnames('idsk-tabs__panel', { 'idsk-tabs__panel--hidden': !isSelected })}
                id={sectionId}
                role="tabpanel"
                aria-labelledby={tab.id}
            >
                {windowWidth &&
                    (windowWidth.desktop || windowWidth.tablet ? (
                        <div className="idsk-tabs__panel-content">{tab.content}</div>
                    ) : (
                        <div
                            className={classnames('idsk-tabs__mobile-tab-content', {
                                'idsk-tabs__mobile-tab-content--hidden': !isSelected,
                            })}
                        >
                            {tab?.content}
                        </div>
                    ))}
            </section>
        </li>
    )
}

interface ITabs {
    tabList: Tab[]
    onSelect?: (selected: Tab) => void
    id?: string
}

export const Tabs: React.FC<ITabs> = ({ tabList, onSelect: onSelected, id }) => {
    const { t, i18n } = useTranslation()
    const { pathname } = useLocation()
    const location = useLocation()
    const navigate = useNavigate()
    const [selected, setSelected] = useState<Tab | null>(tabList[0])
    const shouldNavigate = !!tabList[0]?.path
    const [newTabList, setNewTabList] = useState(tabList)
    const MAX_SHOWN_TABS = 5

    const activeTab = shouldNavigate
        ? tabList.find((tab) => {
              const match = matchPath(
                  {
                      path: tab.path ?? '',
                      caseSensitive: false,
                      end: true,
                  },
                  pathname,
              )
              return match !== null
          })
        : selected

    const handleSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: Tab) => {
        event.preventDefault()
        if (value.path) {
            navigate(value.path, { state: { from: location } })
        } else {
            onSelected?.(value)
            setSelected(value)
        }
    }

    const onSelectedCallback = useCallback((tab: Tab) => {
        onSelected?.(tab)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        activeTab && onSelectedCallback?.(activeTab)
    }, [activeTab, onSelectedCallback])

    useEffect(() => {
        if (tabList.length != newTabList.length) {
            setNewTabList(tabList)
        }
        setSelected((prev) => {
            if (prev === undefined || !tabList?.find((tab: Tab) => tab?.id === prev?.id)) return tabList[0]
            return prev
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabList])

    useEffect(() => {
        setNewTabList(tabList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])

    const handleSubListSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: Tab) => {
        event.preventDefault()
        changeTabOrder(value, MAX_SHOWN_TABS - 1, newTabList, setNewTabList)

        if (value.path) {
            navigate(value.path, { state: { from: location } })
        } else {
            onSelected?.(value)
            setSelected(value)
        }
    }

    const handleMobileSelect = (value: Tab) => {
        if (value.path) {
            navigate(value.path, { state: { from: location } })
        } else {
            if (value === selected) {
                setSelected(null)
            } else {
                onSelected?.(value)
                setSelected(value)
            }
        }
    }

    return (
        <div className="idsk-tabs" data-module="idsk-tabs">
            <h2 className="idsk-tabs__title">{t('tab.contents')}</h2>
            <ul className={classnames('idsk-tabs__list')} role="tablist" id={id}>
                {newTabList?.slice(0, MAX_SHOWN_TABS).map((tab) => (
                    <TabItemDesktop key={tab.id} handleSelect={handleSelect} isSelected={activeTab?.id === tab.id} tab={tab} />
                ))}
                {tabList?.length > MAX_SHOWN_TABS && (
                    <li className={styles.subListButton}>
                        <ButtonPopup
                            popupPosition="right"
                            buttonClassName={styles.subListButton}
                            buttonLabel={t('tab.moreTabs')}
                            popupContent={(closePopup) => {
                                return (
                                    <ul className={styles.subList}>
                                        {newTabList?.slice(MAX_SHOWN_TABS, tabList?.length).map((tab) => (
                                            <TabItemDesktop
                                                key={tab.id}
                                                handleSelect={(event) => {
                                                    handleSubListSelect(event, tab)
                                                    closePopup()
                                                }}
                                                isSelected={selected === tab}
                                                tab={tab}
                                                className={styles.subListItem}
                                            />
                                        ))}
                                    </ul>
                                )
                            }}
                        />
                    </li>
                )}
            </ul>
            <ul className="idsk-tabs__list--mobile" role="tablist" id={id}>
                {tabList.map((tab) => (
                    <TabItemContent key={tab.id} handleMobileSelect={handleMobileSelect} tab={tab} isSelected={activeTab?.id === tab.id} />
                ))}
            </ul>
        </div>
    )
}
