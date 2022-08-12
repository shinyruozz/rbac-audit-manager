/**
 * storage 二次封装
 */

export default {
    getItem(target, key) {
        return this.getStorage(target)[key];
    },
    getStorage(target) {
        let storage = window.localStorage.getItem(target) || "{}";
        return JSON.parse(storage);
    },
    setItem(target, key, value) {
        let storage = this.getStorage(target);
        storage = storage[key] = value;
        window.localStorage.setItem(target, JSON.stringify(storage));
    },
    setStorage(target, value) {
        window.localStorage.setItem(target, JSON.stringify(value));
    },
    delItem(target, key) {
        let storage = this.getStorage(target);
        delete storage[key];
        window.localStorage.setItem(target, JSON.stringify(storage));
    },
    clearStorage(target) {
        window.localStorage.clear();
    },
};