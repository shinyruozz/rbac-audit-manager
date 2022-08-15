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
            <div class="action">
                <el-button type="primary" @click="handleApply">申请休假</el-button>
            </div>
            <el-table :data="applyList">
                <el-table-column v-for="item of columns" v-bind="item"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="{ row }">
                        <el-button @click="handleDetail(row)" type="primary">查看</el-button>
                        <el-button type="danger" :disabled="row.applyState == 5" @click=handleDelete(row._id)>
                            {{ row.applyState == 5 ? '已作废' : '作废' }}</el-button>
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
                <el-step title="审批中"></el-step>
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
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleClose">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 申请休假 -->
        <el-dialog v-model="applyShow" center title="申请休假" width="45%" @close="handleReset('applyRef')">
            <el-form :model="applyForm" ref="applyRef" label-width="100px">
                <el-form-item label="休假类型" prop="applyType" required>
                    <el-select v-model="applyForm.applyType">
                        <el-option label="事假" :value="1"></el-option>
                        <el-option label="调休" :value="2"></el-option>
                        <el-option label="年假" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请原因" prop="reasons" required>
                    <el-input type='textarea' placeholder="请输入申请原因" v-model="applyForm.reasons" />
                </el-form-item>
                <el-form-item label="申请日期">
                    <el-date-picker v-model="dateValue" type="datetimerange" range-separator="-"
                        start-placeholder="开始时间" end-placeholder="结束时间" @change='dateChange'
                        @calendar-change='dateChange' />
                </el-form-item>
                <el-form-item label="休假时长">{{ applyForm.leaveTime }}</el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmitApply">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import tools from '../utils/tools.js';
import { reactive, ref, getCurrentInstance, onMounted } from 'vue'

const { appContext: { config: { globalProperties: { $api, $message, $confirm } } }, ctx } = getCurrentInstance();
const queryForm = reactive({
    applyState: 1
});
const pager = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0,
});
// 申请列表
const applyList = ref([]);
const detailShow = ref(false); // 控制详情显示
const applyShow = ref(false); // 控制申请显示
const leaveDetail = ref({});  //申请详情
const applyForm = reactive({
    applyType: 1,
    leaveTime: '0'
});
const dateValue = ref('')
// 定义表格字段
const columns = reactive([
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
//获取审批数据
const getLeaveList = async () => {
    const { list, page } = await $api.getLeaveList({ ...queryForm, ...pager });
    applyList.value = list;
    pager.total = page.total

}
//深夜休假弹出
const handleApply = () => {
    applyShow.value = true;
}
//重置表单
const handleReset = (form) => {
    ctx.$refs[form].resetFields();
}
//表单作废
const handleDelete = (_id) => {
    $confirm('您确定要作废吗吗?', {
        confirmButtonText: '确定',
        cancelButtoText: '取消',
        type: 'warning'
    }).then(async res => {
        await $api.operateLeave({
            _id,
            action: 'delete'
        })
        getLeaveList()
    })
}
// 页码改变
const handleCurrentChange = (pageNum) => {
    pager.pageNum = pageNum;
    getLeaveList()
}
//显示详情弹出框
const handleDetail = (row) => {
    detailShow.value = true;
    leaveDetail.value = row
}
// 弹出框关闭
const handleClose = (form) => {
    detailShow.value = false;
    applyShow.value = false;
}
//日期选择
const dateChange = (val) => {
    const startTime = new Date(val[0])
    const endTime = new Date(val[1]);
    const resultTime = (endTime - startTime) / (24 * 60 * 60 * 1000);
    const halfTime = resultTime % 1;
    let leaveTime = halfTime >= 0.5 ? resultTime + 0.5 : resultTime
    applyForm.startTime = startTime;
    applyForm.endTime = endTime;
    applyForm.leaveTime = leaveTime + '天'
}

// 申请休假
const handleSubmitApply = async () => {
    const res = await $api.operateLeave({
        ...applyForm,
        action: 'add'
    })
    applyShow.value = false;
    getLeaveList()
}
</script>

<style lang='scss' scoped>
</style>