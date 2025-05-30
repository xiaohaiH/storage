# 存储库说明

本项目提供了一个灵活的本地存储工具, 基于 `TypeScript` 实现, 支持 `localStorage`, `sessionStorage` 及自定义存储; 通过 `StorageCore` 类, 可以方便地进行数据的序列化, 反序列化, 存储和读取。

## 特性
- 支持 `localStorage`, `sessionStorage` 或自定义存储实现
- 支持键和值的序列化与反序列化
- 提供 `setItem`, `getItem`, `removeItem`, `clear` 等常用方法
- 可自定义序列化/反序列化逻辑

## 快速上手

```ts
import { local, session, StorageCore } from '@xiaohaih/storage';

// 使用 localStorage
local.setItem('key', { a: 1 });
const value = local.getItem('key'); // { a: 1 }
local.removeItem('key');
local.clear();

session.setItem('key', { a: 1 });
const value2 = session.getItem('key'); // { a: 1 }
session.removeItem('key');
session.clear();

// 使用自定义存储实现
const customProvider = {
    setItem: (key, value) => { /* ... */ },
    getItem: (key) => { /* ... */ },
    removeItem: (key) => { /* ... */ },
    clear: () => { /* ... */ },
};
const customStorage = new StorageCore({ storageProvider: customProvider });
```

### 构造参数 StorageOption
- `serializeKey`/`deserializeKey`: 键的序列化/反序列化函数
- `serializeValue`/`deserializeValue`: 值的序列化/反序列化函数
- `storageProvider`: 自定义存储实现, 需实现 `setItem`/`getItem`/`removeItem`/`clear` 接口

### 工具函数
- `noop(value)`：原样返回输入
- `stringify(val)`：将值序列化为 JSON 字符串
- `parse(val, defaultValue)`：将字符串解析为对象, 失败时返回默认值或 null

### 预设实例
- `local`: `localStorage` 封装实例
- `session`: `sessionStorage` 封装实例

## 运行测试

本项目使用 [Vitest](https://vitest.dev/) 进行单元测试

```bash
pnpm install
pnpm test
# 或
npx vitest
```

## 目录结构
- `src/storage.ts`：核心存储实现
- `src/storage.test.ts`：单元测试

---
如有建议或问题, 欢迎提 issue！
