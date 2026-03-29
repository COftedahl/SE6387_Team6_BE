const SWAGGER_components_schemas_and_examples = {
  components:{
    'schemas': {
      endpoint: {
        type: 'object', 
        properties: {
          endpoint: {type: 'string'}, 
        }, 
        required: ['endpoint'], 
        example: {
          endpoint: 'http://localhost:5000/amenities/notification'
        }
      },
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
      oldID: {
        type: 'object', 
        oldID: {type: 'string'}, 
        required: ['oldID'], 
        example: {
          oldID: '98765432'
        }
      }, 
      amenityData: {
        type: 'object', 
        properties: {
          id: {type: 'string'}, 
          type: {type: 'string'}, 
          room: {type: 'string'}, 
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
          accessibilityClass: {type: 'string'}, 
        }, 
        required: ['id', 'type', 'room', 'location', 'accessibilityClass'], 
        example: {
          id: '12345678', 
          type: 'RESTROOM', 
          room: '99', 
          location: {x: '10.11', y: '12.13', }, 
          accessibilityClass: 'ACCESSIBLE'
        }
      }, 
      amenityDetails: {
        type: 'object', 
        properties: {
          id: {type: 'string'}, 
          type: {type: 'string'}, 
          room: {type: 'string'}, 
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
          accessibilityClass: {type: 'string'}, 
          currentOccupancy: {type: 'integer'}, 
          currentAvailableSlots: {type: 'integer'}, 
          capacity: {type: 'integer'}, 
          status: {type: 'string'}, 
          lastUpdated: {type: 'string'}, 
        }, 
        required: ['id', 'type', 'room', 'location', 'accessibilityClass', 'currentOccupancy', 'currentAvailableSlots', 'capacity', 'status', 'lastUpdated'], 
        example: {
          id: '12345678', 
          type: 'RESTROOM', 
          room: '99', 
          location: {x: '10.11', y: '12.13', }, 
          accessibilityClass: 'ACCESSIBLE', 
          currentOccupancy: 2, 
          currentAvailableSlots: 4, 
          capacity: 6, 
          status: 'OPEN', 
          lastUpdated: '03/29/26, 10:10:31'
        }
      }, 
      amenitiesArray: {
        type: 'object', 
        data: {
          type: 'array', 
          items: {
            type: 'object', 
            properties: {
              id: {type: 'string'}, 
              type: {type: 'string'}, 
              room: {type: 'string'}, 
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
              accessibilityClass: {type: 'string'}, 
            }, 
            required: ['id', 'type', 'room', 'location', 'accessibilityClass'], 
            example: {
              id: '12345678', 
              type: 'RESTROOM', 
              room: '99', 
              location: {x: '10.11', y: '12.13', }, 
              accessibilityClass: 'ACCESSIBLE'
            }
          }, 
        }, 
        required: ['data'], 
        example: {
          data: [{
            id: '12345678', 
            type: 'RESTROOM', 
            room: '99', 
            location: {x: '10.11', y: '12.13', }, 
            accessibilityClass: 'ACCESSIBLE'
          }]
        }
      }, 
      amenitiesDetailsArray: {
        type: 'object', 
        data: {
          type: 'array', 
          items: {
            type: 'object', 
            properties: {
              id: {type: 'string'}, 
              type: {type: 'string'}, 
              room: {type: 'string'}, 
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
              accessibilityClass: {type: 'string'}, 
              currentOccupancy: {type: 'integer'}, 
              currentAvailableSlots: {type: 'integer'}, 
              capacity: {type: 'integer'}, 
              status: {type: 'string'}, 
              lastUpdated: {type: 'string'}, 
            }, 
            required: ['id', 'type', 'room', 'location', 'accessibilityClass', 'currentOccupancy', 'currentAvailableSlots', 'capacity', 'status', 'lastUpdated'], 
            example: {
              id: '12345678', 
              type: 'RESTROOM', 
              room: '99', 
              location: {x: '10.11', y: '12.13', }, 
              accessibilityClass: 'ACCESSIBLE', 
              currentOccupancy: 2, 
              currentAvailableSlots: 4, 
              capacity: 6, 
              status: 'OPEN', 
              lastUpdated: '03/29/26, 10:10:31'
            }
          }, 
        }, 
        required: ['data'], 
        example: {
          data: [{
            id: '12345678', 
            type: 'RESTROOM', 
            room: '99', 
            location: {x: '10.11', y: '12.13', }, 
            accessibilityClass: 'ACCESSIBLE', 
            currentOccupancy: 2, 
            currentAvailableSlots: 4, 
            capacity: 6, 
            status: 'OPEN', 
            lastUpdated: '03/29/26, 10:10:31'
          }]
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
    }, 
  }
}

export default SWAGGER_components_schemas_and_examples;