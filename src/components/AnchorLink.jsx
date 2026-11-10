import { Link, useLocation } from 'react-router-dom';
import { useScrollTo } from '../lib/smooth.jsx';

// Link a una sezione della home (#storia, #faq): scroll morbido se sei già in home,
// altrimenti porta in home e scorre lì.
export default function AnchorLink({ hash, children, onClick, ...rest }) {
  const { pathname } = useLocation();
  const scrollTo = useScrollTo();
  const onHome = pathname === '/' || pathname === '/index.html';

  if (onHome) {
    return (
      <a
        href={hash}
        {...rest}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(e);
          scrollTo(hash);
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={`/${hash}`} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
