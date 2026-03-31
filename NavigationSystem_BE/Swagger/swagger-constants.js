import SWAGGER_components_schemas_and_examples from './swagger-schemas.js';

export const SWAGGER_startupFilepath = '../dist/src/index.js';
export const SWAGGER_outputFile = './swagger-output.json';
export const SWAGGER_routes = ['./src/index.ts'];
export const SWAGGER_doc = {
  info: {
    title: 'Navigation Backend API',
    description: 'Backend API\nReference https://swagger-autogen.github.io/docs/ for details on configuring the swagger output. '
  },
  host: 'localhost:5002', 
  schemes: [
    "http", 
  ], 
  ...SWAGGER_components_schemas_and_examples, 
};