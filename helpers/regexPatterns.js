var currentOffertsPagePattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&searchtype=1&currentpage=(\d+)/;
var pastOffertsPagePattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=pastcharactertrades&currentpage=(\d+)/;
var auctionIdPattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=(?:currentcharactertrades|pastcharactertrades)&page=details&auctionid=(\d+)&source=overview/;
//var auctionHeaderPattern = /([A-Za-z\s\'-\\u0080-\\uFFFF]*)Level:\s(\d+)\s\|\sVocation:\s([a-zA-Z\s]*)\s\|\s(Male|Female)\s\|\sWorld:\s([A-Z][a-z]*)/;
var auctionHeaderPattern = /<div class=\"AuctionCharacterName\"><a href=\"https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=pastcharactertrades&page=details&auctionid=(\d+)&source=overview\">([A-Za-z\s\'-\\u0080-\\uFFFF]*)<\/a><\/div>Level:\s?(\d+)\s?\|\s?Vocation:\s?([a-zA-Z\s]*)\s?\|\s?(Male|Female)\s?\|\s?World:\s?<a target=\"_blank\" href=\"https:\/\/www\.tibia\.com\/community\/\?subtopic=worlds&world=([A-Z][a-z]*)\">[A-Z][a-z]*<\/a>/;
var auctionHeaderPatternDetailed = /<div class=\"AuctionCharacterName\">([A-Za-z\s\'-\\u0080-\\uFFFF]*)<\/div>Level:\s?(\d+)\s?\|\s?Vocation:\s?([a-zA-Z\s]*)\s\|\s?(Male|Female)\s\|\s?World:\s?<a target=\"_blank\" href=\"https:\/\/www\.tibia\.com\/community\/\?subtopic=worlds&(?:amp;)?world=([A-Z][a-z]*)\">[A-Z][a-z]*<\/a>/;
//var auctionHeaderPattern = /([A-Za-z\s\'-\\u0080-\\uFFFF]*)Level:\s(\d+)\s\|\sVocation:\s([a-zA-Z\s]*)\s\|\s(Male|Female)\s\|\sWorld:\s([A-Z][a-z]*)/;
var auctionDatesAndBidPattern = /Auction Start:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCESTAuction\sEnd:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCEST(Current Bid|Minimum Bid|Winning Bid):([0-9,]*)\s?/;
var characterSkillsPattern = /<td class=\"LabelColumn\"><b>([a-zA-Z\s]*)<\/b><\/td><td class=\"LevelColumn\">(\d+)<\/td><td class=\"PercentageColumn\"><div id=\"SkillBar\" class=\"PercentageBar\" style=\"width: (\d?\d\.\d\d)/;
var charmPointsPattern = /<span class=\"LabelV\">Charm Expansion:<\/span><div style=\"float:right; text-align: right;\"><img src=\"https:\/\/static\.tibia\.com\/images\/premiumfeatures\/icon_(?:yes|no)\.png\"\s?\/?>\s?(yes|no)<\/div><\/td><\/tr><tr class=\"Even\"><td><span class=\"LabelV\">Available Charm Points:<\/span><div style=\"float:right; text-align: right;\">([0-9,]*)<\/div><\/td><\/tr><tr class=\"Odd\"><td><span class=\"LabelV\">Spent Charm Points:<\/span><div style=\"float:right; text-align: right;\">([0-9,]*)<\/div>/;
var obtainedCharmsPattern = /<tr class=\"(?:Odd|Even)\"><td style=\"text-align: right; white-space: nowrap;\">[0-9\,]*<\/td><td>([a-zA-Z\\s\\']*)<\/td><\/tr>/;
var imbuementsPattern = /<tr class=\"(?:Odd|Even)\"><td>([a-zA-Z\s]*)<\/td><\/tr>/;
var itemsPattern = /<tr>\n?\s?<td><a\s?href=\"\/wiki\/[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_\%]*\"\s?title=\"[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*\">([A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*)<\/a><\/td>\n?\s?<td>([0-9\s\,]*)<\/td>\n?<\/tr>/;
var storeItemsPattern = /<td>\s?<a href=\"\/wiki\/[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*\"\s?title=\"[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*\">([A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*)<\/a>\s?<\/td><td>\s?<a href=\".*<\/a>\s? <\/td><td>\s?([0-9]*)\s?/;

module.exports.currentOffertsPagePattern = currentOffertsPagePattern;
module.exports.pastOffertsPagePattern = pastOffertsPagePattern;
module.exports.auctionIdPattern = auctionIdPattern;
module.exports.auctionHeaderPattern = auctionHeaderPattern;
module.exports.auctionHeaderPatternDetailed = auctionHeaderPatternDetailed;
module.exports.auctionDatesAndBidPattern = auctionDatesAndBidPattern;
module.exports.characterSkillsPattern = characterSkillsPattern;
module.exports.charmPointsPattern = charmPointsPattern;
module.exports.obtainedCharmsPattern = obtainedCharmsPattern;
module.exports.imbuementsPattern = imbuementsPattern;
module.exports.itemsPattern = itemsPattern;
module.exports.storeItemsPattern = storeItemsPattern;

//<td>\s?<a href=\"\/wiki\/[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*\"\s?title=\"[A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*\">([A-Za-z\s\'-\\u0080-\\uFFFF\(\)\_]*)<\/a>\s?<\/td><td>\s?<a href=\".*<\/a>\s? <\/td><td>\s?([0-9]*)\s?
