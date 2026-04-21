import pageSeo from '../data/page-seo.json';

type PageSeoMap = typeof pageSeo;
export type PageSeoKey = keyof PageSeoMap;

export function getPageSeo(key: PageSeoKey) {
  return pageSeo[key];
}
