// Legge public/assets/js/config.js (caricato in index.html): un solo posto dove
// cambiare link e server senza toccare il codice React.
const RAW = (typeof window !== 'undefined' && window.DIVISION_CONFIG) || {};

export const links = {
  discord: 'https://discord.gg/divisionroleplay',
  tiktok: 'https://www.tiktok.com/@divisionrpofficial',
  youtube: '',
  ...(RAW.links || {}),
};

export const server = { port: 30120, ...(RAW.server || {}) };

export function connectUrl() {
  if (server.cfxCode) return `fivem://connect/${server.cfxCode}`;
  if (server.host) return `fivem://connect/${server.host}:${server.port || 30120}`;
  return links.discord || '#';
}

export function externalProps(href) {
  return /^https?:/i.test(href || '') ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
