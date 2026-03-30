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
      sortMethod: {
        type: 'object',
        properties: {
          sortMethod: {type: 'string'},
        },
        required: ['sortMethod'],
        example: {
          sortMethod: "BEST_ROUTE",
        }
      },
      locationWithZoom: {
        type: 'object',
        properties: {
          x: {type: 'string'},
          y: {type: 'string'},
          zoom: {type: 'number'},
        },
        required: ['x', 'y', 'zoom'],
        example: {
          x: "10.11",
          y: "12.13",
          zoom: 15,
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
      }, 
    }, 
  }
}

export default SWAGGER_components_schemas_and_examples;