<template>
    <div class='content-wrapper'>
        <div class="query-form">
            <el-form :model="queryForm" ref="queryForm" :inline="true">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model.trim="queryForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态">
                    <el-select v-model="queryForm.menuState">
                        <el-option :value="1" label="正常"></el-option>
                        <el-option :value="2" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMenuList">查询</el-button>
                    <el-button @click="handleReset('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-base">
            <div class="action">
                <el-button type="primary" @click="handleAdd(1, row)">新增</el-button>
            </div>
            <el-table :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleAdd(2, row)" type="primary" :disabled="row.menuType == 2">新增
                        </el-button>
                        <el-button @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" @click=delMenu(row._id)>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>


        <!-- 弹框 -->
        <el-dialog v-model="modalShow" center :title="dialogTitle" width="45%" @close="handleReset('dialogForm')">
            <el-form :model="menuForm" ref="dialogForm" label-width="100px" :rules='rules'>
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="menuForm.menuName" placeholder="菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader v-model="menuForm.parentId" :options="menuList"
                        :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menuForm.menuType">
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单标识" prop="menuCode" v-if="menuForm.menuType == 2">
                    <el-input v-model="menuForm.menuCode" placeholder="菜单标识"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.path" placeholder="菜单路径"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.icon" placeholder="菜单图标"></el-input>
                </el-form-item>
                <el-form-item label="组件地址" prop="component" v-if="menuForm.menuType == 1">
                    <el-input v-model="menuForm.component" placeholder="组件地址"></el-input>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-radio-group v-model="menuForm.menuState">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import tools from '../utils/tools.js';
export default {
    name: '',
    components: {

    },
    data() {
        return {
            modalShow: false,
            action: '',
            queryForm: {  //用户查询表单
                menuState: 1 // 
            },
            menuForm: {
                menuType: 1,
                menuState: 1
            },
            rules: { //校验规则

            },
            menuList: [], //菜单列表
            columns: [
                {
                    label: '菜单名称',
                    property: "menuName",
                    align: 'center'
                },
                {
                    label: '权限标识',
                    property: "menuCode",
                    align: 'center',
                    width: "100"
                },
                {
                    label: '菜单路由',
                    property: "path",
                    align: 'center'
                },
                {
                    label: '菜单图标',
                    property: "icon",
                    align: 'center'
                },
                {
                    label: '菜单类型',
                    property: "menuType",
                    align: "center",
                    formatter(row, column, value) {
                        return {
                            1: '菜单',
                            2: '按钮'
                        }[value]
                    }
                },
                {
                    label: '组件地址',
                    property: "component",
                    align: 'center'
                },

                {
                    label: "菜单状态",
                    prop: "menuState",
                    width: 100,
                    align: "center",
                    formatter(row, column, value) {
                        return {
                            1: "正常",
                            2: "停用",
                        }[value];
                    },
                },

            ]
        };
    },
    computed: {
        dialogTitle() {
            return this.action == 'add' ? '创建菜单' : '编辑菜单'
        }
    },
    mounted() {
        this.getMenuList()
    },
    methods: {
        // 表单重置
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        // 创建菜单
        handleAdd(level, row) {
            this.action = 'add';
            this.modalShow = true;
            //不是一级菜单
            if (level == 2) {
                this.menuForm.parentId = [...row.parentId, row._id]
            }
        },
        //编辑菜单
        handleEdit(row) {
            this.action = 'edit';
            this.modalShow = true;
            this.$nextTick(() => {
                Object.assign(this.menuForm, row);
            });
        },
        delMenu(_id) {
            this.$confirm('您确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async res => {
                await this.$api.operateMenu({
                    action: 'delete',
                    _id
                })

                this.$message.success('删除成功');
                this.getMenuList()
            })
        },
        // 关闭对话框
        handleClose() {
            this.modalShow = false;
            this.handleReset('dialogForm')
        },
        // 提交表单
        handleSubmit() {
            this.$refs.dialogForm.validate(async (valid) => {
                if (valid) {
                    const res = await this.$api.operateMenu({
                        ...this.menuForm,
                        action: this.action
                    });
                    this.$message.success(`${this.action == 'add' ? '新增' : '修改'}成功`);
                    this.modalShow = false;
                    this.getMenuList()
                }
            })
        },
        //获取菜单列表
        async getMenuList() {
            const list = await this.$api.getMenuList(this.queryForm);
            console.log(list);
            this.menuList = list
        },
    },
}
</script>

<style lang='scss' scoped>
</style>