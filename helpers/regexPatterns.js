var offersPagePattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=currentcharactertrades&filter_profession=0&filter_levelrangefrom=0&filter_levelrangeto=0&filter_world=&filter_worldpvptype=9&filter_worldbattleyestate=0&filter_skillid=&filter_skillrangefrom=0&filter_skillrangeto=0&order_column=101&order_direction=1&currentpage=(\d+)/;
var auctionIdPattern = /https:\/\/www\.tibia\.com\/charactertrade\/\?subtopic=currentcharactertrades&page=details&auctionid=(\d+)&source=overview/;
var auctionHeaderPattern = /([A-Za-z\s\']*)Level:\s(\d+)\s\|\sVocation:\s([a-zA-Z\s]*)\s\|\s(Male|Female)\s\|\sWorld:\s([A-Z][a-z]*)/;
var auctionDatesAndBidPattern = /Auction Start:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCESTAuction\sEnd:([A-Z][a-z]*)\s(\d\d)\s(\d\d\d\d),\s(\d\d):(\d\d)\sCEST(Current Bid|Minimum Bid):([0-9,]*)\s?/;

module.exports.offersPagePattern = offersPagePattern;
module.exports.auctionIdPattern = auctionIdPattern;
module.exports.auctionHeaderPattern = auctionHeaderPattern;
module.exports.auctionDatesAndBidPattern = auctionDatesAndBidPattern;
