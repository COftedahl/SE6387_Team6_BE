const SWAGGER_components_schemas_and_examples = {
  components:{
    'schemas': {
      location: {
        type: 'object',
        properties: {
          x: {type: 'string'},
          y: {type: 'string'},
        },
        required: ['x', 'y'],
        example: {
          x: "10.11",
          y: "12.13",
        }
      },
      amenityID: {
        type: 'object',
        properties: {
          id: {type: 'string'},
        },
        required: ['id'],
        example: {
          id: "AM2",
        }
      }, 
      filters: {
        type: 'object',
        properties: {
          filters: {
            type: 'array', 
            items: {
              type: 'object',
              properties: {
                filterKey: {type: 'string'},
                value: {type: 'string'},
              },
              required: ['filterKey', 'value'],
              example: {
                filterKey: 'type',
                value: 'RESTROOM',
              }
            }
          },
        },
        required: ['filters'],
        example: [{
          filterKey: 'type',
          value: 'RESTROOM',
        }],
      }, 
      amenityType: {
        type: 'object',
        properties: {
          amenityType: {type: 'string'},
        },
        required: ['amenityType'],
        example: {
          amenityType: "RESTROOM",
        }
      },
    }, 
  }
}

export default SWAGGER_components_schemas_and_examples;