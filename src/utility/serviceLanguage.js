export const saveCurrentUserLanguage = (language) => {
    localStorage.setItem("miniPortalLanguage", language);
};

export const getCurrentUserLanguage = () => {
    return localStorage.getItem("miniPortalLanguage");
};