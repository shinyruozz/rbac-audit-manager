<template>
    <div class='content-wrapper'>
        <div class="query-form">
            <el-form :model="queryForm" ref="queryRef" :inline="true">
                <el-form-item label="审批状态">
                    <el-select v-model="queryForm.applyState">
                        <el-option :value="0" label="全部"></el-option>
                        <el-option :value="1" label="待审批"></el-option>
                        <el-option :value="2" label="审批中"></el-option>
                        <el-option :value="3" label="审批拒绝"></el-option>
                        <el-option :value="4" label="审批通过"></el-option>
                        <el-option :value="5" label="审批作废"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getLeaveList">查询</el-button>
                </el-form-item>
                <el-pagination />
            </el-form>
        </div>
        <div class="table-base">

            <el-table :data="applyList">
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleAudit(row)" type="primary">审核</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:page-size="pager.pageSize" layout="prev, pager, next"
                v-model:currentPage="pager.pageNum" :total="pager.total" :pager-count="5"
                @update:current-page="handleCurrentChange" />
        </div>


        <!-- 详情弹框 -->
        <el-dialog v-model="detailShow" center title="申请详情" width="45%" @close="handleReset('detailForm')">
            <el-steps :active="leaveDetail.applyState > 2 ? 3 : leaveDetail.applyState" align-center>
                <el-step title="待审批"></el-step>
                <el-step title="审批中">
                </el-step>
                <el-step title="审批拒绝/审批通过"></el-step>
            </el-steps>
            <el-form :model="leaveDetail" ref="detailForm" label-width="150px" label-suffix="："
                style="padding-top:15px">

                <el-form-item label="申请人">{{ leaveDetail.applyUser.userName }}</el-form-item>
                <el-form-item label="申请时间">{{ tools.dateFormat(leaveDetail.createdAt) }}</el-form-item>
                <el-form-item label="休假时长">{{ leaveDetail.leaveTime }}</el-form-item>
                <el-form-item label="审批流信息">
                    <el-table :data="leaveDetail.auditLogs" size="small">
                        <el-table-column prop="action" label="审核结果" width="180" />
                        <el-table-column prop="createTime" label="审核时间" width="180" />
                        <el-table-column prop="userName" label="审核人员" width="180" />
                        <el-table-column prop="remark" label="备注" width="180" />
                    </el-table>

                </el-form-item>
                <el-form-item label="休假原因">{{ leaveDetail.reasons }}</el-form-item>
                <el-form-item label="当前审批人">{{ leaveDetail.curAuditUserName }}</el-form-item>
                <el-form-item label="完整审批人">{{ leaveDetail.auditUsers }}</el-form-item>
                <el-form-item label="审核备注信息" prop="remark">
                    <input type="textarea" v-model='leaveDetail.remark' :rows="2" placeholder="请填写审核备注">
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleApprove('pass', leaveDetail._id)" type="primary" :disabled="isCurAudit">通过
                    </el-button>
                    <el-button :disabled="isCurAudit" type="danger" @click="handleApprove('refuse', leaveDetail._id)">驳回
                    </el-button>
                    <el-button @click="handleClose('detailForm')">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import tools from '../utils/tools.js';

import { reactive, ref, getCurrentInstance, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const { appContext: { config: { globalProperties: { $api, $message, $confirm } } }, ctx } = getCurrentInstance();

const store = useStore();
const queryForm = reactive({  // 查询表单
    applyState: 1
});

const pager = reactive({  // 分页
    pageNum: 1,
    pageSize: 10,
    total: 0,
});

// 申请列表
const applyList = ref([]);
const detailShow = ref(false);  // 详情是否弹出
const leaveDetail = ref({  // 详情信息
    remark: ''
});
const columns = reactive([  // 定义表格字段
    {
        label: '单号',
        property: 'orderNo',
        align: 'center',
    },
    {
        label: '申请类型',
        property: 'applyType',
        align: 'center',
        formatter(row, column, value) {
            return {
                1: '事假',
                2: '调休',
                3: '年假'
            }[value]
        }
    },
    {
        label: '申请时间',
        property: 'createdAt',
        align: 'center',
        formatter(r, c, value) {
            return tools.dateFormat(value)
        }
    },
    {
        label: '休假时长',
        property: 'leaveTime',
        align: 'center',
    },
    {
        label: '休假原因',
        property: 'reasons',
        align: 'center',
    },
    {
        label: '当前审批人',
        property: 'curAuditUserName',
        align: 'center',
    },
    {
        label: '申请人',
        property: 'applyUser',
        align: 'center',
        formatter(r, c, value) {
            return value.userName
        }
    },
    {
        label: '审批状态',
        property: 'applyState',
        align: 'center',
        formatter(r, c, value) {
            return {
                1: '待审批',
                2: '审批中',
                3: '审批拒绝',
                4: '审批通过',
                5: '作废'
            }[value]
        }
    },

])
//初始化接口调用
onMounted(() => {
    getLeaveList();
})
const isCurAudit = computed(() => {
    return leaveDetail.value.applyState > 2 || leaveDetail.value.curAuditUserName != store.state.userInfo.userName
})
const handleApprove = async (action, _id) => {
    const res = await $api.operateLeave({
        _id,
        action,
        remark: leaveDetail.value.remark
    });

    detailShow.value = false
    getLeaveList()
}
//获取审批数据
const getLeaveList = async () => {
    const { list, page } = await $api.getLeaveList({ ...queryForm, action: 'approve', ...pager });
    applyList.value = list;
    pager.total = page.total
}
//重置表单
const handleReset = (form) => {
    ctx.$refs[form].resetFields();
}
//页码改变
const handleCurrentChange = (pageNum) => {
    pager.pageNum = pageNum;
    getLeaveList()
}
// 显示详情
const handleAudit = (row) => {
    detailShow.value = true;
    leaveDetail.value = row
}
//弹框关闭
const handleClose = (form) => {
    detailShow.value = false;
    handleReset(form)
}

</script>

<style lang='scss' scoped>
</style>