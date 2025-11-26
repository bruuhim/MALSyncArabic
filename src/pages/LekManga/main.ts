import { pageInterface } from '../pageInterface';

export const LekManga: pageInterface = {
  name: 'LekManga',
  domain: 'https://lekmanga.net',
  languages: ['Arabic'],
  type: 'manga',

  isSyncPage(url) {
    return url.indexOf('/manga/') > -1 && url.indexOf('/chapter-') > -1;
  },

  isOverviewPage(url) {
    return url.indexOf('/manga/') > -1 && url.indexOf('/chapter-') === -1;
  },

  sync: {
    getTitle(url) {
      return j.$('div.allc a, div.breadcrumb a').first().text().trim();
    },
    getIdentifier(url) {
      const urlParts = url.split('/manga/')[1];
      return urlParts ? urlParts.split('/')[0] : '';
    },
    getOverviewUrl(url) {
      const identifier = LekManga.sync.getIdentifier(url);
      return `${LekManga.domain}/manga/${identifier}`;
    },
    getEpisode(url) {
      const chapterMatch = url.match(/chapter-(\d+)/);
      return chapterMatch ? Number(chapterMatch[1]) : 1;
    },
    nextEpUrl(url) {
      const nextLink = j.$('a.ch-next-btn, a:contains("التالي")').attr('href');
      return nextLink ? utils.absoluteLink(nextLink, LekManga.domain) : undefined;
    },
  },

  overview: {
    getTitle(url) {
      return j.$('h1.entry-title, div.post-title h1').text().trim();
    },
    getIdentifier(url) {
      const urlParts = url.split('/manga/')[1];
      return urlParts ? urlParts.split('/')[0] : '';
    },
    uiSelector(selector) {
      j.$('div.post-title, h1.entry-title').first().after(j.html(selector));
    },
    list: {
      offsetHandler: false,
      elementsSelector() {
        return j.$('div.eplister ul li, div.chapter-list li');
      },
      elementUrl(selector) {
        return utils.absoluteLink(selector.find('a').first().attr('href'), LekManga.domain);
      },
      elementEp(selector) {
        const text = selector.find('a').first().text();
        const chapterMatch = text.match(/(\d+)/);
        return chapterMatch ? Number(chapterMatch[1]) : 0;
      },
    },
  },

  init(page) {
    api.storage.addStyle(
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    j.$(() => {
      page.handlePage();
    });
  },
};
