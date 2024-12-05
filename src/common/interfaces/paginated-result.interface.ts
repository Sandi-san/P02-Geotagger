//return Paginated result based on page
export interface PaginatedResult {
  data: any[]; //data_type (eg. users)
  meta: {
    total: number; //number of total pages
    page: number; //current page
    last_page: number;
  };
}
