import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

import styles from './tabs.module.scss'

import { ButtonPopup } from '@/components/button-popup/ButtonPopup'

interface ITabItemDesktop {
    handleSelect: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: string) => void
    title: string
    id: string
    isSelected: boolean
    className?: string
}

const TabItemDesktop: React.FC<ITabItemDesktop> = ({ handleSelect, title, id, isSelected, className }) => {
    return (
        <li key={id} className={classnames(className, 'idsk-tabs__list-item', { 'idsk-tabs__list-item--selected': isSelected })}>
            <a className="idsk-tabs__tab" href={`#${id}`} title={id} onClick={(event) => handleSelect(event, id)}>
                {title}
            </a>
        </li>
    )
}

interface ITabItemMobile {
    id: string
    handleMobileSelect: (value: string) => void
    title: string
    isSelected: boolean
    content: React.ReactNode
}

const TabItemMobile: React.FC<ITabItemMobile> = ({ id, handleMobileSelect, title, isSelected, content }) => {
    return (
        <li key={id} className="idsk-tabs__list-item--mobile" role="presentation">
            <button
                className={classnames('govuk-caption-l', 'idsk-tabs__mobile-tab', isSelected && 'idsk-tabs__mobile-tab--selected')}
                role="tab"
                aria-controls={id}
                aria-selected={isSelected}
                onClick={() => handleMobileSelect(id)}
            >
                {title}
                <span className="idsk-tabs__tab-arrow-mobile" />
            </button>
            <section className={classnames('idsk-tabs__panel', { 'idsk-tabs__panel--hidden': !isSelected })} id={id}>
                <div className="idsk-tabs__panel-content">{content}</div>
                <div
                    className={classnames('idsk-tabs__mobile-tab-content', {
                        'idsk-tabs__mobile-tab-content--hidden': !isSelected,
                    })}
                >
                    {content}
                </div>
            </section>
        </li>
    )
}

interface Tab {
    id: string
    title: string
    content: React.ReactNode
}

interface ITabs extends PropsWithChildren {
    tabList: Tab[]
}

export const Tabs: React.FC<ITabs> = ({ tabList }) => {
    const { t } = useTranslation()
    const [selected, setSelected] = useState<string>(tabList[0].id)
    const [showOthersButton, setShowOthersButton] = useState(false)

    const MAX_SHOWN_TABS = 5

    useEffect(() => {
        if (tabList.length > MAX_SHOWN_TABS) {
            setShowOthersButton(true)
        } else {
            setShowOthersButton(false)
        }
    }, [tabList.length])

    const array_insert = <T,>(arr: T[], element: T, index: number): T[] => {
        if (index < 0 || index >= arr.length) {
            return arr
        }
        arr.splice(arr.indexOf(element), 1)
        arr.push(element)

        for (let i = arr.length - 1; i > index; i--) {
            arr[i] = arr[i - 1]
        }

        arr[index] = element
        return arr
    }

    const handleSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: string) => {
        event.preventDefault()
        setSelected(value)
    }

    const handleSubListSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: string, tab: Tab) => {
        event.preventDefault()
        array_insert<Tab>(tabList, tab, MAX_SHOWN_TABS - 1)
        setSelected(value)
    }

    const handleMobileSelect = (value: string) => {
        if (value === selected) {
            setSelected('')
        } else {
            setSelected(value)
        }
    }

    return (
        <div className="idsk-tabs" data-module="idsk-tabs">
            <h2 className="idsk-tabs__title">{t('tab.contents')}</h2>
            <ul className={classnames('idsk-tabs__list', styles.list)}>
                {tabList.slice(0, MAX_SHOWN_TABS).map((tab) => (
                    <TabItemDesktop key={tab.id} handleSelect={handleSelect} isSelected={selected === tab.id} id={tab.id} title={tab.title} />
                ))}
                {showOthersButton && (
                    <li className={styles.subListButton}>
                        <ButtonPopup
                            popupPosition="right"
                            buttonLabel={t('tab.moreTabs')}
                            popupContent={(closePopup): ReactNode => {
                                return (
                                    <ul className={styles.subList}>
                                        {tabList.slice(MAX_SHOWN_TABS, tabList.length).map((tab) => (
                                            <TabItemDesktop
                                                key={tab.id}
                                                handleSelect={(event, value) => {
                                                    handleSubListSelect(event, value, tab)
                                                    closePopup()
                                                }}
                                                isSelected={selected === tab.id}
                                                id={tab.id}
                                                title={tab.title}
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
            <ul className="idsk-tabs__list--mobile" role="tablist">
                {tabList.map((tab) => (
                    <TabItemMobile
                        key={tab.id}
                        handleMobileSelect={handleMobileSelect}
                        id={tab.id}
                        title={tab.title}
                        content={tab.content}
                        isSelected={selected === tab.id}
                    />
                ))}
            </ul>
        </div>
    )
}
