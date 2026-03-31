const SWAGGER_components_schemas_and_examples = {
  components:{
    'schemas': {
      weightsUpdate: {
        type: 'object',
        properties: {
          fileContents: {type: 'string'},
        },
        required: ['fileContents'],
        example: {
          fileContents: "277675936,4053752421,24",
        }
      },
    },
  }
}

export default SWAGGER_components_schemas_and_examples;