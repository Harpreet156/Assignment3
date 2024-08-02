const paginate = (items, pageIndex, itemsPerPage) => {
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

module.exports = { paginate };
