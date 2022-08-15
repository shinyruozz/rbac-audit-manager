import storage from "../utils/storage";
export default {
    saveUserInfo(store, userInfo) {
        store.userInfo = userInfo;
        storage.setStorage("userInfo", userInfo);
    },
    saveAuditCount(store, count) {
        store.auditCount = count;
    },
    saveActionList(store, actionList) {
        store.actionList = actionList;
        storage.setStorage("actionList", actionList);
    },
    saveMenuList(store, MenuList) {
        store.menuList = MenuList;
        storage.setStorage("menuList", MenuList);
    },
};