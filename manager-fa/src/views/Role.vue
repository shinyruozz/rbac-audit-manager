<template>
    <div class='content-wrapper'>
        <div class="query-form">
            <el-form :model="queryForm" ref="queryForm" :inline="true">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model.trim="queryForm.roleName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getRoleList">查询</el-button>
                    <el-button @click="handleReset('queryForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table-base">
            <div class="action">
                <el-button type="primary" @click="handleAdd" v-has="'role-add'">新增</el-button>
            </div>
            <el-table :data="roleList">
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleSetPermission(row)" type="primary" v-has="'role-permission'">设置权限
                        </el-button>
                        <el-button @click="handleEdit(row)" v-has="'role-edit'">编辑</el-button>
                        <el-button type="danger" @click=delRole(row._id) v-has="'role-delete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="pager.pageSize" :current-page="pager.pageNum" :total="pager.total"
                :pager-count="5" layout="prev,pager,next" @current-change="handleCurrentChange" background>
            </el-pagination>
        </div>


        <!-- 弹框 -->
        <el-dialog v-model="modalShow" center :title="dialogTitle" width="45%" @close="handleReset('dialogForm')">
            <el-form :model="roleForm" ref="dialogForm" label-width="100px" :rules='rules'>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleForm.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色备注" prop="remark">
                    <el-input type='textarea' :rows="2" v-model="roleForm.remark" placeholder="角色备注" max-length="30">
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" v-has="'role-edit'">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="permissionShow" :title="curPermission.roleName" center>

            <el-form>
                <el-tree ref="tree" :data="menuList" show-checkbox default-expand-all node-key="_id" highlight-current
                    :props="defaultProps" />
            </el-form>

            <template #footer>
                <el-button @click="permissionShow = false">取消</el-button>
                <el-button type="primary" @click="handleSavePermisster">确定</el-button>

            </template>
        </el-dialog>

    </div>
</template>

<script>
import tools from '../utils/tools.js';
export default {
    name: 'Role',

    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'menuName'
            },
            modalShow: false,
            permissionShow: false,
            action: '',
            pager: {
                pageSize: 10,
                pageNum: 1,
                total: 0
            },
            queryForm: {  //用户查询表单
            },
            roleForm: {

            },
            rules: { //校验规则

            },
            roleList: [], //角色列表
            columns: [
                {
                    label: '角色名称',
                    property: "roleName",
                    align: 'center'
                },
                {
                    label: '角色备注',
                    property: "remark",
                    align: 'center',

                },
                {
                    label: '创建时间',
                    property: "createdAt",
                    formatter(row, column, value) {
                        return tools.dateFormat(value)
                    }

                },
                {
                    label: '权限列表',
                    property: "permissionList",
                    formatter: (row, column, value) => {
                        let arr = value.halfCheckedKeys.map((_id, i) => {
                            let menu = this.menuMap.find(item => item._id == _id) || {};
                            return menu.menuName
                        }).filter(item => item)
                        return arr.length > 0 ? arr.join(',') : '暂无'
                    }

                },
            ],
            curPermission: {
                _id: null,
            },
            menuList: [], //菜单权限
            menuMap: [] //菜单映射表 可以和halfCheckedKeys对应
        };
    },
    computed: {
        dialogTitle() {
            return this.action == 'add' ? '创建角色' : '编辑角色'
        }
    },
    mounted() {
        this.getRoleList()
        this.getMenuList()
    },
    methods: {
        // 表单重置
        handleReset(form) {
            this.$refs[form].resetFields();
        },
        // 创建角色
        handleAdd() {
            this.action = 'add';
            this.modalShow = true;
        },
        //编辑角色
        handleEdit(row) {
            this.action = 'edit';
            this.modalShow = true;
            this.$nextTick(() => {
                Object.assign(this.roleForm, row);
            });
        },
        handleSetPermission(row) {
            this.permissionShow = true;
            this.curPermission = row;
            let checkedKeys = row.permissionList.checkedKeys;
            // 点击设置权限 动态设置选中的值
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(checkedKeys)
            })
        },
        async handleSavePermisster() {
            const _id = this.curPermission._id;
            const treeRef = this.$refs.tree;
            let nodes = treeRef.getCheckedNodes();
            //半选中的key
            let halfKeys = treeRef.getHalfCheckedKeys();
            //半选中节点 //用来展示
            let halfCheckedKeys = [],
                checkedKeys = [];

            //最底层选中的权限
            nodes.map(item => {
                if (item.children) {
                    halfCheckedKeys.push(item._id)
                } else {
                    checkedKeys.push(item._id)
                }
            })

            const res = await this.$api.roleEditPermission({
                _id,
                permissionList: {
                    checkedKeys,
                    halfCheckedKeys: halfCheckedKeys.concat(halfKeys)
                }
            })
            this.permissionShow = false;
            this.getRoleList();
        },

        delRole(_id) {
            this.$confirm('您确定要删除吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(async res => {
                await this.$api.operateRole({
                    action: 'delete',
                    _id
                })

                this.$message.success('删除成功');
                this.getRoleList()
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
                    const res = await this.$api.operateRole({
                        ...this.roleForm,
                        action: this.action
                    });
                    this.handleReset('dialogForm');
                    this.$message.success(`${this.action == 'add' ? '新增' : '修改'}成功`);
                    this.modalShow = false;
                    this.getRoleList()
                }
            })
        },
        //页码改变
        handleCurrentChange(pageNum) {
            this.pager.pageNum = pageNum;
            this.getRoleList()
        },
        //获取角色列表
        async getRoleList() {
            const { pageNum, pageSize } = this.pager
            const { data, page } = await this.$api.getRoleList({
                ...this.queryForm,
                pageNum, pageSize
            });
            this.pager.total = page.total
            this.roleList = data
        },

        async getMenuList() {
            let menuList = await this.$api.getAllMenuList();
            this.menuMap = menuList;
            this.menuList = tools.setMenuTree(menuList);
        }
    },
}
</script>

<style lang='scss' scoped>
</style>