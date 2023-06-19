import { Response } from "express";

const handleHttp = (res: Response, error: string, errorRaw?: any) => {
  console.log(errorRaw);
  res.status(500);
  res.send({ error });
};

const successResponse = <T>(response: Response, data: T) => {
  return response.status(200).json(data);
};

const errorServerResponse = (response: Response, error: any, message: string = 'Internal Server Error') => {
  return response.status(500).json({ message, error });
};

const errorResponse = (response: Response, status = 400, error: any) => {
  return response.status(status).json({ error });
};

export interface IResponseList<T> {
  data: T;
}

export { handleHttp, successResponse, errorServerResponse, errorResponse };