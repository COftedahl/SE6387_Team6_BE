const EndpointSchema = {
  endpoint: {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }
}

export default EndpointSchema;