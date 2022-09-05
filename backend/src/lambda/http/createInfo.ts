import 'source-map-support/register'
import { APIGatewayProxyEvent,  APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { CreateInfoRequest } from '../../requests/CreateInfoRequest'
import { createInfo } from '../../businessLogic/infos'
import { getUserId } from '../utils'

const logger = createLogger('createInfoHandler')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {    

      logger.info('Authorizing a user', event)

      const newInfo: CreateInfoRequest = JSON.parse(event.body)
      const userId =   getUserId(event); 
      
      logger.info('create info ini..', event)
      logger.info('create new info', newInfo)

      const item = await createInfo( newInfo, userId)
  
      return{
        statusCode: 201,
        body: JSON.stringify({
          item
        })
      }
    }
)
handler.use(
  cors({
    credentials: true
  })
)