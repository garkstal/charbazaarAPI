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

  return months.indexOf(shortcut.toLowerCase()) + 1;
}

module.exports.convertMonthShortcutToNumber = convertMonthShortcutToNumber;
