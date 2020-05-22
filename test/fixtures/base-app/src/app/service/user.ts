import { Provide } from '../../../../../../src';

@Provide('userService')
export class UserService {

    async getUser(options): Promise<any> {
        return {
            id: options.id,
            username: 'mockedName',
            phone: '12345678901',
            email: 'xxx.xxx@xxx.com',
        };
    }
}
