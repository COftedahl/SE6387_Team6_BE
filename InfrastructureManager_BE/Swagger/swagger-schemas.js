const SWAGGER_components_schemas_and_examples = {
  components:{
    'schemas': {
      id: {
        type: 'object', 
        properties: {
          id: {type: 'string'}, 
        }, 
        required: ['id'], 
        example: {
          id: '12345678', 
        }
      }, 
      crowdLevel: {
        type: 'object', 
        properties: {
          crowdLevel: {type: 'string'}, 
        }, 
        required: ['crowdLevel'], 
        example: {
          crowdLevel: 'HIGH', 
        }
      }, 
      updatesArr: {
        type: 'array', 
        items: {
          type: 'object', 
          properties: {
            id: {type: 'string'}, 
            crowdLevel: {type: 'string'}, 
          }, 
          required: ['id', 'crowdLevel'], 
          example: {
            id: '12345678', 
            crowdLevel: 'HIGH'
          }
        }, 
        example: [
          {
            id: '12345678', 
            crowdLevel: 'HIGH'
          }
        ]
      }
    }, 
  }
}

export default SWAGGER_components_schemas_and_examples;