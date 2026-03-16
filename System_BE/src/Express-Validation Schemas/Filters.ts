const FiltersSchema = {
  filters: {
    exists: true, 
    isArray: true,  
  }, 
  'filters.*.filterKey': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }, 
  'filters.*.value': {
    exists: true, 
    isString: true, 
    notEmpty: true, 
  }
}

export default FiltersSchema;