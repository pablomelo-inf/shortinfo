import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as AWS  from 'aws-sdk'

import { createAttachmentPresignedUrl } from '../../businessLogic/infos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const bucketName = process.env.ATTACHMENT_S3_BUCKET;


const s3 = new AWS.S3({
    signatureVersion: 'v4'
  });

const logger = createLogger('createInfoHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const infoId = event.pathParameters.infoId


    logger.info('ATTACHMENT_S3_BUCKET', event)

   const userId =   getUserId(event); 
    const uploadUrl = await getPressignUrl(infoId);
    await createAttachmentPresignedUrl(userId,infoId)

    return {
        statusCode: 200,     
        body: JSON.stringify({
            uploadUrl
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


  function getPressignUrl(infoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: infoId,
      Expires: 300
    })
  };
