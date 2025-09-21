// Helper

function getUserInfo() {
    const session = sessionStorage.getItem('userInfo');
    if (session) return JSON.parse(session);

    const local = localStorage.getItem('userInfo');
    if (local) return JSON.parse(local);

    return null;
}

function setUserInfo(user, remember = false) {
  const json = JSON.stringify(user);
  if (remember) {
    localStorage.setItem('userInfo', json);
    sessionStorage.removeItem('userInfo');
  } else {
    sessionStorage.setItem('userInfo', json);
    localStorage.removeItem('userInfo');
  }
}

function clearUserInfo() {
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('userInfo');
}
