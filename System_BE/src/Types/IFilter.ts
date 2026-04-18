export default interface IFilter {
  filterKey: string, 
  value: string | IBinaryOpFilterValue, 
}

export interface IBinaryOpFilterValue {
  gt?: number, //>
  lt?: number, //<
  ge?: number, //>=
  le?: number, //<=
}