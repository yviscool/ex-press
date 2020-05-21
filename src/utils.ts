export function safelyGet(list: string | string[], obj?: object): any {
    if (arguments.length === 1) {
      return (_obj: object) => safelyGet(list, _obj);
    }
  
    if (typeof obj === 'undefined' || typeof obj !== 'object' || obj === null) {
      return void 0;
    }
    const pathArrValue = typeof list === 'string' ? list.split('.') : list;
    let willReturn: any = obj;
  
    for (const key of pathArrValue) {
      if (typeof willReturn === 'undefined' || willReturn === null) {
        return void 0;
      } else if (typeof willReturn !== 'object') {
        return void 0;
      }
      willReturn = willReturn[key];
    }
  
    return willReturn;
  }