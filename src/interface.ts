import { Application, Request, Response, } from 'express';

export interface WebMiddleware {
  resolve(): (context: any, next: () => Promise<any>) => any;
}

export type PowerPartial<T> = {
  [U in keyof T]?: T[U] extends object
  ? PowerPartial<T[U]>
  : T[U]
};

export type RequestHandler<TRequest = any, TResponse = any> = (
  req: TRequest,
  res: TResponse,
  next?: () => void,
) => any;

export abstract class AbstractHttpAdapter {

  application?: Application;
  request?: Request;
  response?: Response;
  Helper?: any;

  use?(...args: any[]);

  get?(handler: RequestHandler);
  get?(path: any, handler: RequestHandler);
  get?(...args: any[]);

  post?(handler: RequestHandler);
  post?(path: any, handler: RequestHandler);
  post?(...args: any[]);

  head?(handler: RequestHandler);
  head?(path: any, handler: RequestHandler);
  head?(...args: any[]);

  delete?(handler: RequestHandler);
  delete?(path: any, handler: RequestHandler);
  delete?(...args: any[]);

  put?(handler: RequestHandler);
  put?(path: any, handler: RequestHandler);
  put?(...args: any[]);

  patch?(handler: RequestHandler);
  patch?(path: any, handler: RequestHandler);
  patch?(...args: any[]);

  options?(handler: RequestHandler);
  options?(path: any, handler: RequestHandler);
  options?(...args: any[]);

  listen?(port: string | number, callback?: () => void);
  listen?(port: string | number, hostname: string, callback?: () => void);
  listen?(port: any, hostname?: any, callback?: any);

  abstract ready();

}



