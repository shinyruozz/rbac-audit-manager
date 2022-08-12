const mode =
    import.meta.env.MODE || "prodction";

const envConfig = {
    development: {
        baseApi: "/api",
        mockApi: "https://www.fastmock.site/mock/8c0d1db3d02abcd021e70d8c5f911be7/api",
    },
    test: {
        baseApi: "",
        mockApi: "https://www.fastmock.site/mock/8c0d1db3d02abcd021e70d8c5f911be7/api",
    },
    prodction: {
        baseApi: "",
        mockApi: "https://www.fastmock.site/mock/8c0d1db3d02abcd021e70d8c5f911be7/api",
    },
};

export default {
    ...envConfig[mode],
    isMock: false,
};