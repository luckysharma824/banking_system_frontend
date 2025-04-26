// Utility to handle storing, retrieving, and removing token
export const saveToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const removeToken = () => {
  localStorage.removeItem("authToken");
  console.log(getToken());
};

export const savePermissions = (permissions) => {
  localStorage.setItem("permissions", JSON.stringify(permissions));
};

export const getPermissions = () => {
  const permissions = localStorage.getItem("permissions");
  if (permissions && permissions !== "undefined") {
    return JSON.parse(permissions);
  }
  return {};
};

export const removePermissions = () => {
  localStorage.removeItem("permissions");
};
