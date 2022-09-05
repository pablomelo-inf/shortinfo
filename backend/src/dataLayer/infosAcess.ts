import * as AWS  from 'aws-sdk';
import {DocumentClient, GetItemOutput} from 'aws-sdk/clients/dynamodb';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

import { InfoItem } from '../models/InfoItem'
import { InfosResponse } from '../models/InfoItemsResponse'
import {UpdateInfoRequest} from '../requests/UpdateInfoRequest';


export class InfoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly infosTable = process.env.INFOS_TABLE,   
    private readonly infoIdIndex = process.env.INFO_ID_INDEX
  ) {}

  async getAllInfosByUserId(userId: string, params): Promise<InfosResponse> {
    const result = await this.docClient.query({
      TableName: this.infosTable,
      IndexName: this.infoIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: params.limit,
      ExclusiveStartKey: params.nextKey,
      ScanIndexForward: true 
    }).promise()

    const items = result.Items
    return {
      items: items as InfoItem[],   
      nextKey: encodeNextKey(result.LastEvaluatedKey),
    };
  }




  async getAllInfos(): Promise<InfosResponse> {
   
    var result = await this.docClient.scan({
      TableName: this.infosTable
    }).promise()

    
    const items = result.Items
    return {
      items: items as InfoItem[],   
      nextKey: null,
    };
  }

  async createInfo(infoItem: InfoItem): Promise<InfoItem> {
    await this.docClient.put({
      TableName: this.infosTable,
      Item: infoItem
    }).promise();

    return infoItem;
  }


  async updateInfo(userId: string, infoId: string, updatedInfo: UpdateInfoRequest) : Promise<UpdateInfoRequest> {
    await this.docClient.update({
      TableName: this.infosTable,
      Key: {
        infoId: infoId,
        userId: userId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedInfo.name,
        ':dueDate': updatedInfo.dueDate,
        ':done': updatedInfo.done,
      },
    }).promise();
    
    return updatedInfo;
  }

  async deleteInfo(userId: string, infoId: string) {
    await this.docClient.delete({
      TableName: this.infosTable,
      Key: {
        "infoId": infoId,
        "userId": userId
      }
    }).promise();
  }

  async checkInfoExists(userId: string, infoId: string) {
    const result = await this.getInfoItem(userId, infoId);
    return !!result.Item;
  }

  async getInfoItem(userId: string, infoId: string) : Promise<GetItemOutput> {
    return await this.docClient.get({
      TableName: this.infosTable,
      Key: {
        "userId": userId,
        "infoId": infoId
      }
    }).promise();
  }

  async addInfoAttachmentUrl(userId: string, infoId: string, attachmentUrl: string) {
    await this.docClient.update({
      TableName: this.infosTable,
      Key: {
        'infoId': infoId,
        'userId': userId
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl
      }
    }).promise();
  }
}

function encodeNextKey(lastEvaluatedKey) {
  if(!lastEvaluatedKey) {
    return null;
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}