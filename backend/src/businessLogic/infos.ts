import * as uuid from 'uuid'
import { InfosResponse } from '../models/InfoItemsResponse'
import { InfoItem } from '../models/InfoItem';
import { InfoAccess } from '../dataLayer/infosAcess';
import { CreateInfoRequest } from '../requests/CreateInfoRequest';
import { UpdateInfoRequest } from '../requests/UpdateInfoRequest';
const infosAccess = new InfoAccess();

export async function getAllInfosByUserId(userId: string, params) : Promise<InfosResponse> {
  return infosAccess.getAllInfosByUserId(userId, params);
}

export async function getAllInfos() : Promise<InfosResponse> {
  return infosAccess.getAllInfos();
}


export async function getAllInfosData(): Promise<InfosResponse> {
  return await getAllInfos();
}



export async function getInfosForUser(userId: string): Promise<InfosResponse> {
  return await getAllInfosByUserId(userId, {});
}

export async function createInfo(infoItem: CreateInfoRequest, userId: string) : Promise<InfoItem> {
   
    const newInfoId = uuid.v4(); 
    const item : InfoItem = {
      ...infoItem,
      infoId: newInfoId,
      userId,
      createdAt: new Date().toISOString(),
      done: false
    }
  return infosAccess.createInfo(item);
}


export async function updateInfo(userId: string, infoId: string, updateInfo: UpdateInfoRequest) : Promise<UpdateInfoRequest> {
  return infosAccess.updateInfo(userId, infoId, updateInfo);
}

export async function deleteInfo(userId: string, infoId: string) {
  return infosAccess.deleteInfo(userId, infoId);
}

export async function checkInfoExists(currentUserId: string, infoId: string) {
  return infosAccess.checkInfoExists(currentUserId, infoId);
}

export async function getInfoItem(currentUserId: string, infoId: string) {
  return infosAccess.getInfoItem(currentUserId, infoId);
}

export async function createAttachmentPresignedUrl(userId: string, infoId: string) {
  const bucketName = process.env.ATTACHMENT_S3_BUCKET;
  const attachmentUrl =  `https://${bucketName}.s3.amazonaws.com/${infoId}`;
  return infosAccess.addInfoAttachmentUrl(userId, infoId, attachmentUrl);
}