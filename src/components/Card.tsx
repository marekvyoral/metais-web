import React from 'react'

interface Tag {
  title: string
  href: string
}

interface ICardProps {
  className?: 'basic' | 'secondary' | 'secondary-horizontal' | 'simple' | 'hero' | 'basic-variant' | 'profile-vertical' | 'profile-horizontal'
  tag1?: Tag
  tag2?: Tag
  title: string
  description?: string
  date?: string
  imgSrc?: string
  imgAlt?: string
  cardHref: string
}

export const Card: React.FC<ICardProps> = ({ className = 'basic', tag1, tag2, title, description, date, imgSrc, imgAlt, cardHref }) => {
  return (
    <div className={`idsk-card idsk-card-${className}`}>
      {imgSrc && (
        <a href={cardHref} title={title}>
          <img className={`idsk-card-img idsk-card-img-${className}`} src={imgSrc} alt={imgAlt} aria-hidden="true" />
        </a>
      )}

      <div className={`idsk-card-content idsk-card-content-${className}`}>
        <div className="idsk-card-meta-container">
          {date && (
            <span className="idsk-card-meta idsk-card-meta-date">
              <a href={cardHref} className="govuk-link" title={`Pridané dňa: ${date}`}>
                {date + ' '}
              </a>
            </span>
          )}
          {tag1?.title && (
            <span className="idsk-card-meta idsk-card-meta-tag">
              <a href={tag1.href} className="govuk-link" title={tag1.title}>
                {tag1.title}
              </a>
            </span>
          )}
          {tag2?.title && (
            <span className="idsk-card-meta idsk-card-meta-tag">
              <a href={tag2.href} className="govuk-link" title={tag2.title}>
                {tag2.title}
              </a>
            </span>
          )}
        </div>

        <div className={`idsk-heading idsk-heading-${className}`}>
          <a href={cardHref} className="idsk-card-title govuk-link" title={title}>
            {title}
          </a>
        </div>
        {description &&
          (className.includes('profile') ? (
            <div className="idsk-body idsk-body-profile-vertical">
              <a href="#" className="idsk-card-title govuk-link" title={description}>
                {description}
              </a>
            </div>
          ) : (
            <p className={`idsk-body idsk-body-${className}`}>{description}</p>
          ))}
      </div>
    </div>
  )
}
