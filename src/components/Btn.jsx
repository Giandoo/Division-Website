import { useState } from 'react';
import { Link } from 'react-router-dom';
import Scramble from './Scramble.jsx';
import { externalProps } from '../lib/config.js';

/**
 * variant: "cell" (grigio scuro, stile pannello), "red" (azione principale), "ghost" (solo bordo).
 * to → link interno React; href → link normale; nessuno dei due → <button>.
 */
export default function Btn({ to, href, variant = 'cell', icon, children, className = '', onClick }) {
  const [replay, setReplay] = useState(0);
  const label = String(children).toUpperCase();
  const cls = `btn btn--${variant} ${className}`.trim();
  const inner = (
    <>
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <Scramble className="btn__label" text={label} replay={replay} />
    </>
  );
  const common = { className: cls, onMouseEnter: () => setReplay((r) => r + 1) };

  if (to) {
    return (
      <Link to={to} onClick={onClick} {...common}>
        {inner}
      </Link>
    );
  }
  if (!href) {
    return (
      <button type="button" onClick={onClick} {...common}>
        {inner}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} {...common} {...externalProps(href)}>
      {inner}
    </a>
  );
}
