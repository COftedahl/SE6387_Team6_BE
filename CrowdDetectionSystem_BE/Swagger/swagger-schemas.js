const SWAGGER_components_schemas_and_examples = {
  components:{
    'schemas': {
      id: {
        type: 'object', 
        properties: {
          id: {type: 'string'}
        }, 
        required: ['id'], 
        example: {
          id: '12345678'
        }
      }, 
      crowdLevel: {
        type: 'object', 
        properties: {
          crowdLevel: {type: 'string'}
        }, 
        required: ['crowdLevel'], 
        example: {
          crowdLevel: "HIGH", 
        }
      }, 
    }
  }
}

export default SWAGGER_components_schemas_and_examples;