import { apiEndpoint } from '../config'
import { Info } from '../types/Info';
import { CreateInfoRequest } from '../types/CreateInfoRequest';
import Axios from 'axios'
import { UpdateInfoRequest } from '../types/UpdateInfoRequest';

export async function getInfos(idToken: string): Promise<Info[]> {
  console.log('Fetching infos')

  const response = await Axios.get(`${apiEndpoint}/infos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Infos:', response.data)
  return response.data.items
}


export async function getAllInfos(idToken: string): Promise<Info[]> {
  console.log('Fetching infos')

  const response = await Axios.get(`${apiEndpoint}/all_infos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Infos:', response.data)
  return response.data.items
}


export async function createInfo(
  idToken: string,
  newInfo: CreateInfoRequest
): Promise<Info> {


  console.log(newInfo)

  const response = await Axios.post(`${apiEndpoint}/infos`,  JSON.stringify(newInfo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log(response)
  return response.data.item
}



export async function patchInfo(
  idToken: string,
  infoId: string,
  updatedInfo: UpdateInfoRequest
): Promise<void> {
  console.log(updatedInfo)
  await Axios.patch(`${apiEndpoint}/infos/${infoId}`, JSON.stringify(updatedInfo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteInfo(
  idToken: string,
  infoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/infos/${infoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  infoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/infos/${infoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
