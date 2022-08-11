<template>
    <div class='content-wrapper'>
        <div class="query-form">
            <el-form :model="queryUserForm" ref="queryForm" :inline="true">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="queryUserForm.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="queryUserForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-select v-model="queryUserForm.state">
                        <el-option :value="0" label="全部"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getUsersList">查询</el-button>
                    <el-button @click="handleReset('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-base">
            <div class="action">
                <el-button type="primary" @click="handleAdd">创建</el-button>
                <el-button type="danger" @click="batchDel">批量删除</el-button>
            </div>
            <el-table :data="userList" ref="multipleTableRef" @selection-change="selectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleEdit(row)">编辑</el-button>
                        <el-button type="danger" @click=delUser([row.userId])>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pager.pageSize" :pager-count="5" :current-page="pager.pageNum"
                layout="prev, pager, next" :total="total" background class="pagination"
                @current-change="handleCurrentChange" />
        </div>


        <!-- 弹框 -->
        <el-dialog v-model="modalShow" center :title="dialogTitle" width="45%">
            <el-form :model="userForm" ref="userForm" label-width="100px">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="userEmail">
                    <el-input v-model="userForm.userEmail" placeholder="用户邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="userForm.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="userForm.job" placeholder="岗位"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="userForm.state">
                        <el-option label="在职" :value="1"></el-option>
                        <el-option label="离职" :value="2"></el-option>
                        <el-option label="试用期" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select v-model="userForm.roleList">
                        <el-option label="在职" :value="1"></el-option>
                        <!-- <el-option label="离职" :value="2"></el-option>
                        <el-option label="试用期" :value="3"></el-option> -->
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
    data() {
        return {
            modalShow: false,
            action: '',
            queryUserForm: {  //用户查询表单
                state: 0
            },
            userForm: {
                state: 3
            },
            userRules: [

            ],
            userList: [],// 用户列表数据
            //分页
            pager: {
                pageSize: 10,
                pageNum: 1
            },
            checkUserId: [], //选中的id
            total: 20,
            columns: [
                {
                    label: '用户ID',
                    property: "userId",
                    width: '200',
                    align: 'center'
                },
                {
                    label: '用户名称',
                    property: "userName",
                    width: '200',
                    align: 'center'
                },
                {
                    label: '用户邮箱',
                    property: "userEmail",
                    width: '250',
                    align: 'center'
                },
                {
                    label: '手机号',
                    property: "mobile",
                    width: '250',
                    align: 'center'
                },
                {
                    label: '用户角色',
                    property: "role",
                    width: '200',
                    align: 'center',
                    formatter(row, column, value) {
                        return {
                            0: '管理员',
                            1: '普通用户'
                        }[value]
                    }
                },
                {
                    label: "岗位",
                    property: 'job',
                    width: '200',
                    align: 'center'
                },
                {
                    label: '创建时间',
                    property: 'createTime',
                    align: 'center',
                    formatter(row, column, value) {
                        return tools.dateFormat(value)
                    }
                },

            ]
        };
    },
    computed: {
        dialogTitle() {
            return this.action == 'add' ? '创建用户' : '编辑用户'
        }
    },
    mounted() {
        this.getUsersList()
    },
    methods: {
        // 表单重置
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        // 创建用户
        handleAdd() {
            this.action = 'add';
            this.modalShow = true;
        },
        //编辑用户
        handleEdit(row) {
            this.action = 'edit';
            this.modalShow = true;
            this.$nextTick(() => {
                Object.assign(this.userForm, row);
            });
        },
        // 删除用户
        delUser(userIds) {
            console.log(userIds);
            this.$confirm('您确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async (res) => {
                await this.$api.delUsers(userIds);
                this.$message.success('删除成功')
            })

            // this.$api.delUsers([userId])
        },
        // 批量删除
        batchDel() {
            this.checkUserId.length && this.delUser(this.checkUserId)
        },
        // 关闭对话框
        handleClose() {
            this.modalShow = false;
            this.handleReset('userForm')
        },
        // 提交表单
        handleSubmit() {

        },
        // 页码改变
        handleCurrentChange(pageNum) {
            this.pager.pageNum = pageNum;
        },
        //批量选择
        selectionChange(vals) {
            this.checkUserId = vals.map(item => {
                return item.userId
            })
        },
        // 获取用户列表
        async getUsersList() {
            try {
                const { queryUserForm, pager } = this;
                const params = { ...queryUserForm, ...pager };
                const { list, page } = await this.$api.getUsersList(params);
                this.total = page.total;
                this.userList = list
            } catch (e) {
                console.log(e);
            }
        },

        async getUsersAllList() {
            const list = await this.$api.getUsersAllList();
            this.userList = list
        }

    },
}
</script>

<style lang='scss' scoped>
</style>