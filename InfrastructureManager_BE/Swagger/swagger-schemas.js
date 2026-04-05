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
      status: {
        type: 'object', 
        properties: {
          status: {type: 'string'}, 
        }, 
        required: ['status'], 
        example: {
          status: 'OPEN', 
        }
      }, 
      crowdUpdatesArr: {
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
      }, 
      statusUpdatesArr: {
        type: 'array', 
        items: {
          type: 'object', 
          properties: {
            id: {type: 'string'}, 
            status: {type: 'string'}, 
          }, 
          required: ['id', 'status'], 
          example: {
            id: '12345678', 
            status: 'OPEN'
          }
        }, 
        example: [
          {
            id: '12345678', 
            status: 'OPEN'
          }
        ]
      }, 
    }, 
  }
}

export default SWAGGER_components_schemas_and_examples;