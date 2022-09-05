import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { deleteInfo } from '../../businessLogic/infos'
import { getUserId } from '../utils'

const logger = createLogger('deleteInfoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const infoId = event.pathParameters.infoId
    
    const userId =   getUserId(event); 
    const infoDeleted = await deleteInfo(userId, infoId)
    
    logger.info('info deleted', infoDeleted)

    return{
        statusCode: 201,
        body: JSON.stringify({
          infoDeleted
        })
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
