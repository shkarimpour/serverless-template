import * as AWS from "aws-sdk";

import ResponseModel from "../models/response.model";

import { StatusCode } from "../enums/status-code.enum";
import { ResponseMessage } from "../enums/response-message.enum";
import IConfig from "../interfaces/config.interface";

type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutput = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutput = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

type Item = {[index: string]: string};

const {
  STAGE,
  DYNAMODB_LOCAL_STAGE,
  DYNAMODB_LOCAL_ACCESS_KEY_ID,
  DYNAMODB_LOCAL_SECRET_ACCESS_KEY,
  DYNAMODB_LOCAL_ENDPOINT
} = process.env;
const config: IConfig = {
  region: "ap-northeast-1",
};

if (STAGE === DYNAMODB_LOCAL_STAGE) {
  console.log("dynamodb-local mode");
  config.accessKeyId = DYNAMODB_LOCAL_ACCESS_KEY_ID;
  config.secretAccessKey = DYNAMODB_LOCAL_SECRET_ACCESS_KEY;
  config.endpoint = DYNAMODB_LOCAL_ENDPOINT;
}
AWS.config.update(config);

const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DatabaseService {

  getItem = async({key, hash, hashValue, tableName}: Item): Promise<GetItemOutput> => {
    const params = {
      TableName: tableName,
      Key: {
        id: key,
      },
    };
    if (hash) {
      params.Key[hash] = hashValue;
    }
    const results = await this.get(params);
    if (Object.keys(results).length) {
      return results;
    }
    //console.error("item does not exist");
    throw new ResponseModel({ id: key}, StatusCode.BAD_REQUEST, ResponseMessage.INVALID_REQUEST);
  };

  create = async(params: PutItem): Promise<PutItemOutput> => {
    try {
      //console.log("create-param", params)
      return await documentClient.put(params).promise();
    } catch (error) {
      console.error("create-error", error);
      throw new ResponseModel({}, 500, `create-error: ${error}`);
    }
  };

  batchCreate = async (params: BatchWrite): Promise<BatchWriteOutput> => {
    try {
      return await documentClient.batchWrite(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500 , `batch-write-error: ${error}`);
    }
  };

  update = async (params: UpdateItem): Promise<UpdateItemOutput> => {
    try {
      return await documentClient.update(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `update-error: ${error}`);
    }
  };

  query = async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  get = async (params: GetItem): Promise<GetItemOutput> => {
    try {
      return await documentClient.get(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `get-error: ${error}`);
    }
  };

  delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
    try {
      return await documentClient.delete(params).promise();
    } catch (error) {
      throw new ResponseModel({}, 500, `delete-error: ${error}`);
    }
  };
}