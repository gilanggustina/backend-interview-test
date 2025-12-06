export function buildPagination(page: number, perPage: number, total: number) {
  return {
    total,
    per_page: perPage,
    current_page: page,
    last_page: Math.ceil(total / perPage),
  };
}
