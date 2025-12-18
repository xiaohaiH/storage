import { beforeEach, describe, expect, it, vi } from 'vitest';
import { noop, parse, StorageCore, stringify } from './storage';

describe('storageCore', () => {
    let mockStorage: any;
    let storage: StorageCore<any>;

    beforeEach(() => {
        mockStorage = {
            store: {} as Record<string, any>,
            setItem: vi.fn(function (this: typeof mockStorage, key, value) { this.store[key] = value; }),
            getItem: vi.fn(function (this: typeof mockStorage, key) { return this.store[key] || null; }),
            removeItem: vi.fn(function (this: typeof mockStorage, key) { delete this.store[key]; }),
            clear: vi.fn(function (this: typeof mockStorage) { this.store = {}; }),
        };
        storage = new StorageCore({ storageProvider: mockStorage });
    });

    it('setItem 应该调用 storageProvider.setItem 并存储数据', () => {
        storage.setItem('foo', 'bar');
        expect(mockStorage.setItem).toHaveBeenCalledWith('foo', '"bar"');
        expect(mockStorage.store.foo).toBe('"bar"');
    });

    it('getItem 应该获取已存储的数据并反序列化', () => {
        mockStorage.store.foo = '"bar"';
        const value = storage.getItem('foo');
        expect(mockStorage.getItem).toHaveBeenCalledWith('foo');
        expect(value).toBe('bar');
    });

    it('getItem 获取不到时返回 null 或默认值', () => {
        const value = storage.getItem('not-exist');
        expect(value).toBeNull();
        const valueWithDefault = storage.getItem('not-exist', 'default');
        expect(valueWithDefault).toBe('default');
    });

    it('removeItem 应该调用 storageProvider.removeItem 并删除数据', () => {
        mockStorage.store.foo = '"bar"';
        storage.removeItem('foo');
        expect(mockStorage.removeItem).toHaveBeenCalledWith('foo');
        expect(mockStorage.store.foo).toBeUndefined();
    });

    it('clear 应该调用 storageProvider.clear 并清空数据', () => {
        mockStorage.store.foo = '"bar"';
        storage.clear();
        expect(mockStorage.clear).toHaveBeenCalled();
        expect(Object.keys(mockStorage.store).length).toBe(0);
    });
});

describe('工具函数', () => {
    it('noop 应该原样返回输入', () => {
        expect(noop(123)).toBe(123);
        expect(noop('abc')).toBe('abc');
    });

    it('stringify 应该正确序列化为 JSON 字符串', () => {
        expect(stringify({ a: 1 })).toBe('{"a":1}');
        expect(stringify([1, 2])).toBe('[1,2]');
    });

    it('parse 应该正确解析 JSON 字符串', () => {
        expect(parse('{"a":1}')).toEqual({ a: 1 });
        expect(parse('[1,2]')).toEqual([1, 2]);
    });

    it('parse 解析失败时返回默认值或 null', () => {
        expect(parse('not-json')).toBeNull();
        expect(parse('not-json', 'default')).toBe('default');
    });
});
