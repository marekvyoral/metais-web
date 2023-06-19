import React, { PropsWithChildren } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useNavigate, matchPath, useLocation } from 'react-router-dom'

interface ITabItemDesktop {
    handleSelect: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: string) => void
    title: string
    id: string
    isSelected: boolean
}

const TabItemDesktop: React.FC<ITabItemDesktop> = ({ handleSelect, title, id, isSelected }) => {
    return (
        <li key={id} className={classnames('idsk-tabs__list-item', { 'idsk-tabs__list-item--selected': isSelected })}>
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

export interface Tab {
    id: string
    title: string
    content: React.ReactNode
}

interface ITabs extends PropsWithChildren {
    tabList: Tab[]
}

export const Tabs: React.FC<ITabs> = ({ tabList }) => {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const activeTab = tabList.find((tab) => {
        const match = matchPath(
            {
                path: tab.id,
                caseSensitive: false,
                end: true,
            },
            pathname,
        )
        return match !== null
    })

    const handleSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: string) => {
        event.preventDefault()
        navigate(value)
    }

    const handleMobileSelect = (value: string) => {
        navigate(value)
    }

    return (
        <div className="idsk-tabs" data-module="idsk-tabs">
            <h2 className="idsk-tabs__title">{t('tab.contents')}</h2>
            <ul className="idsk-tabs__list">
                {tabList.map((tab) => (
                    <TabItemDesktop
                        key={tab?.id}
                        handleSelect={handleSelect}
                        isSelected={activeTab?.id === tab?.id}
                        id={tab?.id}
                        title={tab?.title}
                    />
                ))}
            </ul>
            <ul className="idsk-tabs__list--mobile" role="tablist">
                {tabList.map((tab) => (
                    <TabItemMobile
                        key={tab?.id}
                        handleMobileSelect={handleMobileSelect}
                        id={tab?.id}
                        title={tab?.title}
                        content={tab?.content}
                        isSelected={activeTab?.id === tab?.id}
                    />
                ))}
            </ul>
        </div>
    )
}
