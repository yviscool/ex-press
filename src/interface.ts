import * as express from 'express';

export interface WebMiddleware {
  resolve(): (context: any, next: () => Promise<any>) => any;
}

export interface ExpressApplication extends Partial<express.Application> {
  ready();
}

export type PowerPartial<T> = {
  [U in keyof T]?: T[U] extends object
    ? PowerPartial<T[U]>
    : T[U]
};
