import { pageInterface } from '../pageInterface';

export const OlympusStaff: pageInterface = {
  name: 'OlympusStaff',
  domain: 'https://olympustaff.com',
  languages: ['Arabic'],
  type: 'manga',

  isSyncPage(url) {
    return utils.urlPart(url, 3) !== '' && typeof utils.urlPart(url, 4) !== 'undefined';
  },

  isOverviewPage(url) {
    return (
      utils.urlPart(url, 3) !== '' &&
      typeof utils.urlPart(url, 4) === 'undefined' &&
      url.indexOf('/manga/') > -1
    );
  },

  sync: {
    getTitle(url) {
      return j.$('div.post-title h1').text().trim();
    },
    getIdentifier(url) {
      return utils.urlPart(url, 3);
    },
    getOverviewUrl(url) {
      return utils.absoluteLink(
        j.$('div.post-title h1 a').attr('href') || `/manga/${utils.urlPart(url, 3)}`,
        OlympusStaff.domain,
      );
    },
    getEpisode(url) {
      const chapterMatch = utils.urlPart(url, 4).match(/(\d+)/);
      return chapterMatch ? Number(chapterMatch[1]) : 1;
    },
    nextEpUrl(url) {
      return utils.absoluteLink(
        j.$('div.nextprev a:contains("الفصل التالي")').attr('href'),
        OlympusStaff.domain,
      );
    },
  },

  overview: {
    getTitle(url) {
      return j.$('div.post-title h1').text().trim();
    },
    getIdentifier(url) {
      return utils.urlPart(url, 3);
    },
    uiSelector(selector) {
      j.$('div.post-title').after(j.html(selector));
    },
    list: {
      offsetHandler: false,
      elementsSelector() {
        return j.$('div.eplister ul li');
      },
      elementUrl(selector) {
        return utils.absoluteLink(selector.find('a').attr('href'), OlympusStaff.domain);
      },
      elementEp(selector) {
        const chapterText = selector.find('.epl-num').text();
        const chapterMatch = chapterText.match(/(\d+)/);
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
