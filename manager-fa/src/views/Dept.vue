<template>
    <div class='content-wrapper'>
        <div class="query-form">
            <el-form :model="queryForm" ref="queryForm" :inline="true">
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model.trim="queryForm.deptName" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getDeptList">查询</el-button>
                    <el-button @click="handleReset('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-base">
            <div class="action">
                <el-button type="primary" @click="handleAdd()">新增</el-button>
            </div>
            <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }">
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" @click=deldept(row._id)>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>


        <!-- 弹框 -->
        <el-dialog v-model="modalShow" center :title="dialogTitle" width="45%" @close="handleReset('dialogForm')">
            <el-form :model="deptForm" ref="dialogForm" label-width="100px" :rules='rules'>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="deptForm.deptName" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item label="父级部门" prop="parentId">
                    <el-cascader v-model="deptForm.parentId" :options="deptList"
                        :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable style="width: 100%">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="部门负责人" prop="userName">
                    <el-select v-model="deptForm.userId">
                        <el-option v-for="item of userList" label="item.userName" :id="item.userId"
                            :value="item.userId"></el-option>
                    </el-select>
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
    setup() {

    },
    data() {
        return {
            modalShow: false,
            action: '',
            queryForm: {  //用户查询表单
                deptState: 1 // 
            },
            deptForm: {
                deptType: 1,
                deptState: 1
            },
            rules: { //校验规则

            },
            deptList: [], //部门列表
            columns: [
                {
                    label: '部门名称',
                    property: "deptName",
                    align: 'center'
                },
                {
                    label: '权限标识',
                    property: "deptCode",
                    align: 'center',
                    width: "100"
                },
                {
                    label: '部门路由',
                    property: "path",
                    align: 'center'
                },
                {
                    label: '部门图标',
                    property: "icon",
                    align: 'center'
                },
                {
                    label: '部门类型',
                    property: "deptType",
                    align: "center",
                    formatter(row, column, value) {
                        return {
                            1: '部门',
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
                    label: "部门状态",
                    prop: "deptState",
                    width: 100,
                    align: "center",
                    formatter(row, column, value) {
                        return {
                            1: "正常",
                            2: "停用",
                        }[value];
                    },
                },

            ],
            userList: [] //用户列表
        };
    },
    computed: {
        dialogTitle() {
            return this.action == 'add' ? '创建部门' : '编辑部门'
        }
    },
    mounted() {
        this.getDeptList();
        this.getUserList();
    },
    methods: {
        // 表单重置
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        // 创建部门
        handleAdd(level, row) {
            this.action = 'add';
            this.modalShow = true;

        },
        //编辑部门
        handleEdit(row) {
            this.action = 'edit';
            this.modalShow = true;
            this.$nextTick(() => {
                Object.assign(this.deptForm, row);
            });
        },
        deldept(_id) {
            this.$confirm('您确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async res => {

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
                    // const res = await this.$api.operatedept({
                    //     ...this.deptForm,
                    //     action: this.action
                    // });
                    // this.$message.success(`${this.action == 'add' ? '新增' : '修改'}成功`);
                    // this.modalShow = false;
                    // this.getdeptList()
                }
            })
        },
        //获取部门列表
        async getDeptList() {
            const list = await this.$api.getDeptList(this.queryForm);
            console.log(list);
            this.deptList = list
        },

        async getUserList() {
            const res = await this.$api.getUserAllList();
            this.userList = res

        }
    },
}
</script>

<style lang='scss' scoped>
</style>