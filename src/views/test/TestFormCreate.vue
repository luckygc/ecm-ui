<script setup lang="ts">
import formCreate from '@form-create/element-ui';
import {reactive} from "vue";
import Page from "@/components/page/Page.vue";

const rule = reactive([
    {
        type: 'input',
        field: 'name',
        title: '姓名',
        props: {
            'placeholder': '请输入姓名'
        },
        validate: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
        ]
    },
    {
        type: 'input',
        field: 'age',
        title: '年龄',
        props: {
            'placeholder': '请输入年龄'
        },
        validate: [
            {required: true, message: '请输入年龄', trigger: 'blur'}
        ]
    },
    {
        type: 'input',
        field: 'email',
        title: '邮箱',
        props: {
            'placeholder': '请输入邮箱'
        },
        validate: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ]
    },
]);
const options = reactive({
    submitBtn: true,
});
const formData = reactive({});
const fApi = reactive({});

</script>

<template>
  <Page>
    <formCreate :rule="rule" :option="options" v-model="formData" v-model:api="fApi"></formCreate>
  </Page>
</template>

<style scoped>

</style>