const offerTitleJoin = (offerTitle) => offerTitle.split(' ').join('-');

const toSentenceCase = (string) => string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();

export { offerTitleJoin, toSentenceCase };
