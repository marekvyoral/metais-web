import React from 'react';

interface ICardProps {
    className: 'basic' | 'secondary' | 'secondary-horizontal' | 'simple' | 'hero' | 'basic-variant' | 'profile-vertical' | 'profile-horizontal';
    tag1?: string;
    tag2?: string;
    title: string;
    description?: string;
    date: string;
    imgSrc?: string;
    imgAlt?: string;
    cardHref: string;
    tag1Href?: string;
    tag2Href?: string;
}

const Card = ({ className, tag1, tag2, title, description, date, imgSrc, imgAlt, cardHref, tag1Href, tag2Href }: ICardProps) => {
    return (
        <div className={`idsk-card idsk-card-${className}`}>
            {imgSrc && (
                <a href={cardHref} title={title}>
                    <img className={`idsk-card-img idsk-card-img-${className}`} src={imgSrc} alt={imgAlt} aria-hidden="true" />
                </a>
            )}

            <div className={`idsk-card-content idsk-card-content-${className}`}>
                <div className="idsk-card-meta-container">
                    <span className="idsk-card-meta idsk-card-meta-date">
                        <a href={cardHref} className="govuk-link" title={`Pridané dňa: ${date}`}>
                            {date}
                        </a>
                    </span>{' '}
                    {tag1 && (
                        <span className="idsk-card-meta idsk-card-meta-tag">
                            <a href={tag1Href} className="govuk-link" title={tag1}>
                                {tag1}
                            </a>
                        </span>
                    )}
                    {tag2 && (
                        <span className="idsk-card-meta idsk-card-meta-tag">
                            <a href={tag2Href} className="govuk-link" title={tag2}>
                                {tag2}
                            </a>
                        </span>
                    )}
                </div>

                <div className={`idsk-heading idsk-heading-${className}`}>
                    <a href={cardHref} className="idsk-card-title govuk-link" title={title}>
                        {title}
                    </a>
                </div>
                {className.includes('profile') ? (
                    <div className="idsk-body idsk-body-profile-vertical">
                        <a href="#" className="idsk-card-title govuk-link" title={description}>
                            {description}
                        </a>
                    </div>
                ) : (
                    <p className={`idsk-body idsk-body-${className}`}>{description}</p>
                )}
            </div>
        </div>
    );
};

export default Card;

