const formatDate = (initialDate) => {
  const date = new Date(initialDate);

  //RETURN RESPONSE FROM BACKEND IF DATE IS INVALID
  if (!Date.parse(date)) {
    return initialDate;
  }

  const day = date.getDate();
  const monthNumber = date.getMonth() + 1;
  let monthTitle;

  switch (monthNumber) {
    case 1:
      monthTitle = 'января';
      break;
    case 2:
      monthTitle = 'февраля';
      break;
    case 3:
      monthTitle = 'марта';
      break;
    case 4:
      monthTitle = 'апреля';
      break;
    case 5:
      monthTitle = 'мая';
      break;
    case 6:
      monthTitle = 'июня';
      break;
    case 7:
      monthTitle = 'июля';
      break;
    case 8:
      monthTitle = 'августа';
      break;
    case 9:
      monthTitle = 'сентября';
      break;
    case 10:
      monthTitle = 'октября';
      break;
    case 11:
      monthTitle = 'ноября';
      break;
    case 12:
      monthTitle = 'декабря';
      break;
  }

  const year = date.getFullYear();

  return `${day} ${monthTitle} ${year}`;
};

export default formatDate;
