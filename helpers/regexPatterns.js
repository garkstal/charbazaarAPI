var offertsPagePattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&searchtype=1&currentpage=(\d+)/;
var auctionIdPattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=currentcharactertrades&page=details&auctionid=(\d+)&source=overview/;
var auctionHeaderPattern = /([A-Za-z\s\'-]*)Level:\s(\d+)\s\|\sVocation:\s([a-zA-Z\s]*)\s\|\s(Male|Female)\s\|\sWorld:\s([A-Z][a-z]*)/;
var auctionDatesAndBidPattern = /Auction Start:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCESTAuction\sEnd:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCEST(Current Bid|Minimum Bid):([0-9,]*)\s?/;
var characterSkillsPattern = /<td class=\"LabelColumn\"><b>([a-zA-Z\s]*)<\/b><\/td><td class=\"LevelColumn\">(\d+)<\/td><td class=\"PercentageColumn\"><div id=\"SkillBar\" class=\"PercentageBar\" style=\"width: (\d?\d\.\d\d)/;
var charmPointsPattern = /<span class=\"LabelV\">Charm Expansion:<\/span><div style=\"float:right; text-align: right;\"><img src=\"https:\/\/static\.tibia\.com\/images\/premiumfeatures\/icon_(?:yes|no)\.png\"\s?\/?>\s?(yes|no)<\/div><\/td><\/tr><tr class=\"Even\"><td><span class=\"LabelV\">Available Charm Points:<\/span><div style=\"float:right; text-align: right;\">([0-9,]*)<\/div><\/td><\/tr><tr class=\"Odd\"><td><span class=\"LabelV\">Spent Charm Points:<\/span><div style=\"float:right; text-align: right;\">([0-9,]*)<\/div>/;
var obtainedCharmsPattern = /<tr class=\"(?:Odd|Even)\"><td style=\"text-align: right; white-space: nowrap;\">[0-9\,]*<\/td><td>([a-zA-Z\\s\\']*)<\/td><\/tr>/;
var imbuementsPattern = /<tr class=\"(?:Odd|Even)\"><td>([a-zA-Z\s]*)<\/td><\/tr>/;

module.exports.offertsPagePattern = offertsPagePattern;
module.exports.auctionIdPattern = auctionIdPattern;
module.exports.auctionHeaderPattern = auctionHeaderPattern;
module.exports.auctionDatesAndBidPattern = auctionDatesAndBidPattern;
module.exports.characterSkillsPattern = characterSkillsPattern;
module.exports.charmPointsPattern = charmPointsPattern;
module.exports.obtainedCharmsPattern = obtainedCharmsPattern;
module.exports.imbuementsPattern = imbuementsPattern;
