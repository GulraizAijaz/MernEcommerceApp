
export const getSearchParams = (locationSearch) => {
  const params = new URLSearchParams(locationSearch);
  return {
    querySearch: params.get("query") || "",
    categoryId: params.get("categoryId") || ""
  };
};