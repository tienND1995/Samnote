import { TOKEN, USER } from "./constant";

export const handleLogOut = () => {
  localStorage.removeItem(USER);
  localStorage.removeItem(TOKEN);
  window.location.href = "/";
};

export const getCurrentFormattedDateTime = () => {
  const date = new Date()

  // Lấy các thành phần của ngày và giờ
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng tính từ 0-11, cần +1
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // Xác định AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // Giờ 0 thành 12
  const formattedHours = String(hours).padStart(2, '0')

  // Lấy múi giờ
  const timeZoneOffset = -date.getTimezoneOffset()
  const offsetSign = timeZoneOffset >= 0 ? '+' : '-'
  const offsetHours = String(
    Math.floor(Math.abs(timeZoneOffset) / 60)
  ).padStart(2, '0')
  const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(2, '0')

  // Tạo chuỗi thời gian định dạng
  const formattedDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm} ${offsetSign}${offsetHours}:${offsetMinutes}`

  return formattedDateTime
}

export const getTimeDifference = (time1, time2) => {
  const realTime = time1 + '+0700'
  const diffInMs = new Date(time2).getTime() - new Date(realTime).getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return `${diffInMinutes} min`
  } else if (diffInDays < 1) {
    return `${diffInHours} hours`
  } else if (diffInDays < 30) {
    return `${diffInDays} day`
  } else {
    return `more 30 day`
  }
}

export const getFormattedDate = (datetime) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Kiểm tra nếu input là chuỗi, chuyển đổi thành đối tượng Date
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Thêm hậu tố cho ngày
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Kiểm tra nếu input là đối tượng Date thì trả về với dayName, nếu không thì bỏ dayName
  if (typeof datetime === 'string') {
    return `${day}${daySuffix(day)} ${month} ${year}`;
  } else {
    return `${dayName}, ${day}${daySuffix(day)} ${month} ${year}`;
  }
}

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  if (diffInWeeks > 0) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};
