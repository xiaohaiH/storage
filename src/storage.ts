export interface StorageOption<Provider extends LikeStorage> {
    /** 序列化存储的键 */
    serializeKey?: (key: any) => any;
    /** 反序列化存储的键 */
    deserializeKey?: (key: any) => any;
    /** 序列化存储的值 */
    serializeValue?: (value: any) => any;
    /** 反序列化存储的值 */
    deserializeValue?: (value: any, defaultValue?: any) => any;
    /**
     * 存储提供者
     * 只要提供类似 localStorage 的实现即可
     * @default {Storage}
     */
    storageProvider?: Provider;
}

export interface LikeStorage {
    /** 新增缓存信息 */
    setItem: (key: any, value: any) => any;
    /** 获取缓存信息 */
    getItem: (key: any) => any;
    /** 删除缓存信息 */
    removeItem: (key: any) => any;
    /** 清空缓存信息 */
    clear?: (...args: any) => any;
}

/** 存储的核心实现 */
export class StorageCore<Provider extends LikeStorage = typeof window['localStorage']> {
    public option!: Required<StorageOption<Provider>>;

    constructor(option?: StorageOption<Provider>) {
        this.option = {
            serializeKey: noop,
            deserializeKey: noop,
            serializeValue: stringify,
            deserializeValue: parse,
            storageProvider: (typeof window !== 'undefined' ? window.localStorage : {}) as unknown as Provider,
            ...option,
        };
    }

    /**
     * 添加存储内容到指定的类型
     * @param {any} key 添加的键
     * @param {any} value 添加的值
     */
    setItem(key: any, value: any) {
        const { storageProvider, serializeKey, serializeValue } = this.option;
        return storageProvider.setItem(serializeKey(key), serializeValue(value)) as ReturnType<Provider['setItem']>;
    }

    /**
     * 获取指定的存储内容
     * @param {any} key 添加的键
     * @param {any} [defaultValue] 默认值
     */
    getItem<T = unknown>(key: any): T | null;
    getItem<T = unknown>(key: any, defaultValue: T): T;
    getItem<T = unknown>(key: any, defaultValue?: T): T | null {
        const { storageProvider, serializeKey, deserializeValue } = this.option;
        return deserializeValue(storageProvider.getItem(serializeKey(key)), defaultValue);
    }

    /**
     * 删除指定类型中存储的值
     * @param {any} key 删除的键
     */
    removeItem(key: any) {
        const { storageProvider, serializeKey } = this.option;
        return storageProvider.removeItem(serializeKey(key)) as ReturnType<Provider['removeItem']>;
    }

    /**
     * 清空指定类型的存储内容
     */
    clear(...args: Parameters<NonNullable<Provider['clear']>>) {
        const { storageProvider } = this.option;
        return storageProvider.clear?.() as ReturnType<NonNullable<Provider['clear']>>;
    }
}

const target = typeof window !== 'undefined'
    ? window
    : { localStorage: {} as unknown as Storage, sessionStorage: {} as unknown as Storage };

/** locationStorage */
export const local = new StorageCore({ storageProvider: target.localStorage });
/** sessionStorage */
export const session = new StorageCore({ storageProvider: target.sessionStorage });

/** 空函数, 给啥返啥 */
export function noop(value: any) {
    return value;
}
/** 转为 JSON字符串 */
export function stringify(val: any) {
    return JSON.stringify(val);
}
/**
 * 解析 JSON字符串, 解析失败时返回默认值
 * (由于 null 可被 JSON.parse 解析且 localStorage 未设置值时会返回 null, 因此对 null 做特殊处理)
 */
export function parse<T>(val: any, defaultValue?: T): T | null {
    try {
        const r = JSON.parse(val);
        if (r !== null) return r;
    }
    catch (error) {}
    return defaultValue === undefined ? null : defaultValue;
}
