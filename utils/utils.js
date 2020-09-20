function convertMonthShortcutToNumber(shortcut) {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const monthNumber = months.indexOf(shortcut.toLowerCase()) + 1;
  return monthNumber < 10 ? "0" + monthNumber : monthNumber;
}

function createDateObject(year, month, day, hour, minute) {
  const date =
    year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":00.000Z";

  return new Date(date);
}

module.exports.convertMonthShortcutToNumber = convertMonthShortcutToNumber;
module.exports.createDateObject = createDateObject;
