export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const saveTokens = (data) => {
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  if (data.email) {
    localStorage.setItem("userEmail", data.email);
  }

  if (data.role) {
    localStorage.setItem("userRole", data.role);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const getUserEmail = () => {
  return localStorage.getItem("userEmail");
};