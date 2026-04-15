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
      occupancyDetails: {
        type: 'object', 
        properties: {
          currentOccupancy: {type: 'number'}, 
          currentAvailableSlots: {type: 'number'}, 
          capacity: {type: 'number'}, 
          status: {type: 'string'}, 
          lastUpdated: {type: 'string'}, 
        }, 
        required: ['currentOccupancy', 'currentAvailableSlots', 'capacity', 'status', 'lastUpdated'], 
        example: {
          currentOccupancy: 2, 
          currentAvailableSlots: 4, 
          capacity: 6, 
          status: 'OPEN', 
          lastUpdated: '03/29/26, 10:10:31'
        }
      }
    }
  }
}

export default SWAGGER_components_schemas_and_examples;