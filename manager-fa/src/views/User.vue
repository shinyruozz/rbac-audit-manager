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
                    <el-button type="primary" @click="querySearch">查询</el-button>
                    <el-button @click="handleReset('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-base">
            <div class="action">
                <el-button type="primary" @click="handleAdd">创建</el-button>
                <el-button type="danger" @click="batchDel">批量删除</el-button>
            </div>
            <el-table :data="userList" @selection-change="selectionChange">
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
                layout="prev, pager, next" :total="pager.total" background class="pagination"
                @current-change="handleCurrentChange" />
        </div>


        <!-- 弹框 -->
        <el-dialog v-model="modalShow" center :title="dialogTitle" width="45%" @close="handleReset('userForm')">
            <el-form :model="userForm" ref="userForm" label-width="100px" :rules="userRules">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="userForm.userName" placeholder="用户名称" :disabled="action == 'edit'"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="userPwd" v-if="action == 'add'">
                    <el-input v-model="userForm.userPwd" type="password" placeholder="密码"></el-input>
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
                    <el-select v-model="userForm.roleList" multiple>
                        <el-option :label="role.roleName" :value="role._id" v-for="role of roleList" :key="role._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptId">
                    <el-cascader v-model="userForm.deptId" placeholder="请选择所属部门" :options="deptList"
                        :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable style="width: 100%">
                    </el-cascader>
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
            userRules: { //校验规则
                userName: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请填写用户名'
                    },

                ],
                userPwd: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请填写密码'
                    },
                    {
                        min: 6,
                        max: 18,
                        message: '密码长度在6-18'
                    }
                ],
                userEmail: [{

                    required: true,
                    trigger: 'blur',
                    message: '请填写邮箱'
                }
                ],
                mobile: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请填写手机号'
                    }
                ],
                job: [
                    {
                        required: true,
                        trigger: 'blur',
                        message: '请填写岗位'
                    }
                ]
            },
            userList: [],// 用户列表数据
            deptList: [], //部门列表
            //分页
            pager: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
            roleList: [],//角色数据
            checkUserId: [], //选中的id

            columns: [
                {
                    label: '用户ID',
                    property: "userId",
                    width: '130',
                    align: 'center'
                },
                {
                    label: '用户名称',
                    property: "userName",
                    width: '150',
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
                    width: '200',
                    align: 'center'
                },
                {
                    label: '状态',
                    property: "state",
                    width: '150',
                    align: 'center',
                    formatter(row, column, value) {
                        return {
                            1: '在职',
                            2: '离职',
                            3: '试用期'
                        }[value]
                    }
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
                    property: 'createdAt',
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
        this.getUsersList();
        this.getRolesList();
        this.getDeptList()
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
            this.$confirm('您确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async (res) => {
                await this.$api.delUsers({ userIds });
                this.$message.success('删除成功')
            })

            // this.$api.delUsers([userId])
        },
        // 搜索
        querySearch() {
            // const  state = this.queryUserForm.state;
            this.pager.pageNum = 1;
            this.getUsersList()
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
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    const res = await this.$api.userSubmit({
                        ...this.userForm,
                        action: this.action
                    });
                    this.$message.success(`${this.action == 'add' ? '新增' : '修改'}成功`);
                    this.modalShow = false;
                    this.getUsersList()
                }
            })
        },
        // 页码改变
        handleCurrentChange(pageNum) {
            this.pager.pageNum = pageNum;
            this.getUsersList()
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
                this.pager = page

                this.userList = list
            } catch (e) {
                console.log(e);
            }
        },



        async getUsersAllList() {
            const list = await this.$api.getUsersAllList();
            this.userList = list
        },

        async getRolesList() {
            const res = await this.$api.getRoleAllList();
            this.roleList = res;
        },

        async getDeptList() {
            const res = await this.$api.getDeptList();
            this.deptList = res;
        }

    },
}
</script>

<style lang='scss' scoped>
</style>