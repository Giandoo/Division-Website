import { motion } from 'framer-motion';
import SplitText from '../components/SplitText.jsx';
import Scramble from '../components/Scramble.jsx';
import { IconArrowUpRight, IconDiscord, IconTikTok, IconYouTube } from '../components/Icons.jsx';
import { connectUrl, externalProps, links } from '../lib/config.js';
import { EASE, EASE_IO, pad3 } from '../lib/motion.js';

export default function Social() {
  const cells = [
    { name: 'Discord', handle: 'Community e supporto', href: links.discord, icon: <IconDiscord /> },
    { name: 'TikTok', handle: '@divisionrpofficial', href: links.tiktok, icon: <IconTikTok /> },
    { name: 'YouTube', handle: 'Video e trailer', href: links.youtube, icon: <IconYouTube /> },
  ].filter((c) => c.href);

  return (
    <section className="social">
      <div className="social__head">
        <SplitText as="h2" className="social__title t-head" parts={[{ t: 'Resta', dim: true }, { t: 'connesso.' }]} />
      </div>
      <div className="cols4 social__cells">
        {cells.map((c, i) => (
          <motion.a
            key={c.name}
            href={c.href}
            {...externalProps(c.href)}
            className="social__cell"
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.3, ease: EASE_IO, delay: i * 0.12 }}
          >
            <span className="t-idx">{pad3(i + 1)}</span>
            <span className="social__icon">{c.icon}</span>
            <span className="social__meta">
              <Scramble className="social__name" text={c.name.toUpperCase()} delay={0.3 + i * 0.12} />
              <span className="social__handle">{c.handle}</span>
            </span>
            <span className="social__arrow" aria-hidden="true">
              <IconArrowUpRight />
            </span>
          </motion.a>
        ))}
        <motion.a
          href={connectUrl()}
          {...externalProps(connectUrl())}
          className={`social__cell social__cell--play${cells.length % 4 === 2 ? ' social__cell--wide' : ''}`}
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.3, ease: EASE_IO, delay: cells.length * 0.12 }}
        >
          <span className="t-idx">{pad3(cells.length + 1)}</span>
          <img className="social__logo" src="/assets/img/logo.png" alt="" width="52" height="52" />
          <span className="social__meta">
            <Scramble className="social__name" text="GIOCA ORA" delay={0.3 + cells.length * 0.12} />
            <span className="social__handle">Entra nel 2077</span>
          </span>
          <motion.span
            className="social__arrow"
            aria-hidden="true"
            initial={{ x: 0 }}
            whileInView={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, ease: EASE, repeat: Infinity, repeatDelay: 1.4 }}
          >
            <IconArrowUpRight />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
