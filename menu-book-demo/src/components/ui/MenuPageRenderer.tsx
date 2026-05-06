import React from 'react';
import type { MenuPageData } from './menuData';

/* ─── Decorative SVG ornament ─── */
function Ornament() {
  return (
    <svg className="mp-ornament" viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8h45c2-4 6-7 15-7s13 3 15 7h45" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="60" cy="8" r="2.5" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M48 8c3-3 7-5 12-5M72 8c-3-3-7-5-12-5" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

/* ─── Logo divider page (page 6) ─── */
function LogoPage() {
  const logoBase = import.meta.env.BASE_URL;
  const logoRoot = logoBase.endsWith('/') ? logoBase : `${logoBase}/`;

  return (
    <div className="mp-page mp-logo-page">
      <div className="mp-decor-circle mp-decor-purple" />
      <div className="mp-decor-circle mp-decor-yellow" />
      <div className="mp-logo-content">
        <img src={`${logoRoot}bemata-logo.svg`} alt="Bemata" className="mp-logo-img" draggable={false} />
      </div>
    </div>
  );
}

/* ─── Single Menu Page Renderer ─── */
interface PageProps {
  data: MenuPageData;
  pageIndex: number;
  isTwo?: boolean; // hint for two-column layout
}

const MenuPageContent = React.forwardRef<HTMLDivElement, PageProps>(
  ({ data, pageIndex, isTwo }, ref) => {
    // Page 6 (index 5) is the logo divider
    if (!data.title && data.sections.length === 0) {
      return (
        <div ref={ref} data-density="soft">
          <LogoPage />
        </div>
      );
    }

    // Determine layout: page 1 (Alkoholna) and page 11 (Pića) use two columns
    const isWine = pageIndex === 0;
    const isDrinks = pageIndex === 12;
    const twoCol = isTwo || isWine || isDrinks;

    return (
      <div ref={ref} data-density="soft">
        <div className={`mp-page ${twoCol ? 'mp-two-col' : ''}`}>
          {/* Background decorations */}
          <div className="mp-decor-circle mp-decor-purple" />
          <div className="mp-decor-circle mp-decor-yellow" />

          {/* Title */}
          {data.title && (
            <header className="mp-header">
              <h2 className="mp-title">{data.title}</h2>
              {data.subtitle && <p className="mp-subtitle">{data.subtitle}</p>}
              <Ornament />
            </header>
          )}

          {/* Sections container */}
          <div className={`mp-sections ${twoCol ? 'mp-sections-grid' : ''}`}>
            {data.sections.map((section, si) => (
              <div key={si} className="mp-section">
                {(section.title || section.header) && (
                  <div className="mp-section-header">
                    {section.title && <h3 className="mp-section-title">{section.title}</h3>}
                    {section.header && <span className="mp-section-macros-label">{section.header}</span>}
                  </div>
                )}
                <ul className="mp-items">
                  {section.items.map((item, ii) => (
                    <li key={ii} className={`mp-item ${item.bold ? 'mp-item-bold' : ''}`}>
                      <div className="mp-item-left">
                        <span className="mp-item-name">{item.name}</span>
                        {item.desc && <span className="mp-item-desc">{item.desc}</span>}
                      </div>
                      <div className="mp-item-right">
                        <span className="mp-item-price">{item.price}</span>
                        {item.macros && <span className="mp-item-macros">{item.macros}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footnote */}
          {data.footnote && (
            <div className="mp-footnote">
              <p>{data.footnote}</p>
            </div>
          )}

          {/* Bottom ornament */}
          <div className="mp-bottom-ornament">
            <Ornament />
          </div>
        </div>
      </div>
    );
  }
);

MenuPageContent.displayName = 'MenuPageContent';
export { MenuPageContent };
