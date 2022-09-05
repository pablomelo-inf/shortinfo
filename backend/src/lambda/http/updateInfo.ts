import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateInfo } from '../../businessLogic/infos'
import { UpdateInfoRequest } from '../../requests/UpdateInfoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const infoId = event.pathParameters.infoId
    const updatedInfo: UpdateInfoRequest = JSON.parse(event.body)
    const userId = getUserId(event);
   const infoUpdated = await updateInfo(userId, infoId, updatedInfo)

   return{
        statusCode: 201,
        body: JSON.stringify({
            infoUpdated
        })
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
