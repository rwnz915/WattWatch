// Helper

function getUserInfo() {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
}

function setUserInfo({ id, firstName, lastName, email, page }) {
    localStorage.setItem('userInfo', JSON.stringify({ id, firstName, lastName, email, page }));
}

function clearUserInfo() {
    localStorage.removeItem('userInfo');
}
