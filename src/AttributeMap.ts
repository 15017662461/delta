import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';

interface AttributeMap {
  [key: string]: unknown;
}

namespace AttributeMap {
  /**
   *
   * @param a 对象a
   * @param b 对象b
   * @param keepNull
   * @returns b的所有内容和a中b没有的，即用b覆盖掉a中的内容
   */
  export function compose(
    a: AttributeMap = {},
    b: AttributeMap = {},
    keepNull: boolean,
  ): AttributeMap | undefined {
    if (typeof a !== 'object') {
      a = {};
    }
    if (typeof b !== 'object') {
      b = {};
    }
    let attributes = cloneDeep(b);
    if (!keepNull) {
      attributes = Object.keys(attributes).reduce<AttributeMap>((copy, key) => {
        if (attributes[key] != null) {
          copy[key] = attributes[key];
        }
        return copy;
      }, {});
    }
    for (const key in a) {
      if (a[key] !== undefined && b[key] === undefined) {
        attributes[key] = a[key];
      }
    }
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }

  /**
   *
   * @param a 对象a
   * @param b 对象b
   * @returns b中与a不同的,a有b没有返回null
   */
  export function diff(
    a: AttributeMap = {},
    b: AttributeMap = {},
  ): AttributeMap | undefined {
    if (typeof a !== 'object') {
      a = {};
    }
    if (typeof b !== 'object') {
      b = {};
    }
    const attributes = Object.keys(a)
      .concat(Object.keys(b))
      .reduce<AttributeMap>((attrs, key) => {
        if (!isEqual(a[key], b[key])) {
          attrs[key] = b[key] === undefined ? null : b[key];
        }
        return attrs;
      }, {});
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }

  /**
   *
   * @param attr 对象a
   * @param base 对象b
   * @returns ab都有的用b的，a有b没有的返回null，a没有b有的不返回
   */
  export function invert(
    attr: AttributeMap = {},
    base: AttributeMap = {},
  ): AttributeMap {
    attr = attr || {};
    const baseInverted = Object.keys(base).reduce<AttributeMap>((memo, key) => {
      if (base[key] !== attr[key] && attr[key] !== undefined) {
        memo[key] = base[key];
      }
      return memo;
    }, {});
    return Object.keys(attr).reduce<AttributeMap>((memo, key) => {
      if (attr[key] !== base[key] && base[key] === undefined) {
        memo[key] = null;
      }
      return memo;
    }, baseInverted);
  }

  /**
   *
   * @param a 对象a
   * @param b 对象b
   * @param priority 优先级
   * @returns 返回b,priority为true则返回b中除了a中有的
   */
  export function transform(
    a: AttributeMap | undefined,
    b: AttributeMap | undefined,
    priority = false,
  ): AttributeMap | undefined {
    if (typeof a !== 'object') {
      return b;
    }
    if (typeof b !== 'object') {
      return undefined;
    }
    if (!priority) {
      return b; // b simply overwrites us without priority
    }
    const attributes = Object.keys(b).reduce<AttributeMap>((attrs, key) => {
      if (a[key] === undefined) {
        attrs[key] = b[key]; // null is a valid value
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : undefined;
  }
}

export default AttributeMap;
