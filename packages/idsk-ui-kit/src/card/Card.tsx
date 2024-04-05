import React, { PropsWithChildren, ReactElement } from 'react'
import { Link } from 'react-router-dom'

import styles from './styles.module.scss'

export interface Tag {
    title: string
    href: string
}
interface Image {
    src: string
    alt: string
}

interface ICardProps extends PropsWithChildren {
    variant?: 'basic' | 'secondary' | 'secondary-horizontal' | 'simple' | 'hero' | 'basic-variant' | 'profile-vertical' | 'profile-horizontal'
    tag1?: Tag
    tag2?: Tag
    headerTag1?: { label: string; value: string }
    headerTag2?: { label: string; value: string }
    title: string
    description?: string
    date?: string | ReactElement
    img?: Image
    cardHref: string
}

export const Card: React.FC<ICardProps> = ({
    variant = 'basic',
    tag1,
    tag2,
    title,
    description,
    date,
    img,
    cardHref,
    children,
    headerTag1,
    headerTag2,
}) => {
    return (
        <div className={`idsk-card idsk-card-${variant} ${styles.fullWidth}`}>
            {img && (
                <a href={cardHref} title={title}>
                    <img className={`idsk-card-img idsk-card-img-${variant}`} src={img.src} alt={img.alt} aria-hidden="true" />
                </a>
            )}

            <div className={`idsk-card-content idsk-card-content-${variant}`}>
                <div className="idsk-card-meta-container">
                    {date && <span className="idsk-card-meta idsk-card-meta-date">{date}</span>}
                    {tag1?.title && (
                        <span className="idsk-card-meta idsk-card-meta-tag">
                            <Link to={tag1.href} className="govuk-link" title={tag1.title}>
                                {tag1.title}
                            </Link>
                        </span>
                    )}
                    {tag2?.title && (
                        <span className="idsk-card-meta idsk-card-meta-tag">
                            <Link to={tag2.href} className="govuk-link" title={tag2.title}>
                                {tag2.title}
                            </Link>
                        </span>
                    )}
                </div>
                <div className={`idsk-heading idsk-heading-${variant} ${styles.headerWithTags}`}>
                    <Link to={cardHref} className="idsk-card-title govuk-link" title={title}>
                        {title}
                    </Link>
                    <dl className={styles.tagWrapper}>
                        {headerTag1?.value && (
                            <>
                                <dt className="govuk-visually-hidden">{headerTag1.label}</dt>
                                <dd className="govuk-tag govuk-tag--inactive">{headerTag1.value}</dd>
                            </>
                        )}
                        {headerTag2?.value && (
                            <>
                                <dt className="govuk-visually-hidden">{headerTag2.label}</dt>
                                <dd className="govuk-tag">{headerTag2.value}</dd>
                            </>
                        )}
                    </dl>
                </div>
                {description &&
                    (variant.includes('profile') ? (
                        <div className="idsk-body idsk-body-profile-vertical">
                            <a href="#" className="idsk-card-title govuk-link" title={description}>
                                {description}
                            </a>
                        </div>
                    ) : (
                        <p className={`idsk-body idsk-body-${variant}`}>{description}</p>
                    ))}

                {children}
            </div>
        </div>
    )
}
