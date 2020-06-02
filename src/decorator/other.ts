import { saveMethodDataToClass, attachPropertyDataToClass, RENDER_KEY, HTTP_CODE_KEY, HEADER_KEY, REDIRECT_KEY } from './common';

export function Header(name: string, value: string) {
    return (target, key, descriptor) => {
        attachPropertyDataToClass(HEADER_KEY, { name, value }, target, key);
    };
}

export function Render(template: string) {
    return (target, key, descriptor) => {
        saveMethodDataToClass(RENDER_KEY, template, target, key);
    };
}

export function HttpCode(statusCode: number) {
    return (target, key, descriptor) => {
        saveMethodDataToClass(HTTP_CODE_KEY, statusCode, target, key);
    };
}

export function Redirect(url: string, statusCode?: number) {
    return (target, key, descriptor) => {
        saveMethodDataToClass(REDIRECT_KEY, { statusCode, url }, target, key);
    };
}
