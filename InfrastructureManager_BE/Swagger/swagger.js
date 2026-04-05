import swaggerAutogen from 'swagger-autogen';
import { SWAGGER_outputFile, SWAGGER_doc, SWAGGER_routes } from './swagger-constants.js';

swaggerAutogen(SWAGGER_outputFile, SWAGGER_routes, SWAGGER_doc);