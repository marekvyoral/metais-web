import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

interface Tag {
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
    title: string
    description?: string
    date?: string
    img?: Image
    cardHref: string
}

export const Card: React.FC<ICardProps> = ({ variant = 'basic', tag1, tag2, title, description, date, img, cardHref, children }) => {
    return (
        <div className={`idsk-card idsk-card-${variant}`}>
            {img && (
                <a href={cardHref} title={title}>
                    <img className={`idsk-card-img idsk-card-img-${variant}`} src={img.src} alt={img.alt} aria-hidden="true" />
                </a>
            )}

            <div className={`idsk-card-content idsk-card-content-${variant}`}>
                <div className="idsk-card-meta-container">
                    {date && (
                        <span className="idsk-card-meta idsk-card-meta-date">
                            <Link to={cardHref} className="govuk-link" title={`Pridané dňa: ${date}`}>
                                {date}
                            </Link>
                        </span>
                    )}
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

                <div className={`idsk-heading idsk-heading-${variant}`}>
                    <Link to={cardHref} className="idsk-card-title govuk-link" title={title}>
                        {title}
                    </Link>
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
