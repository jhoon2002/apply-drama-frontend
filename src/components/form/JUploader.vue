<script setup>
/**
 * [durubong 프로젝트에서 파일 업로드 해법]
 * 1. 사용자가 파일을 선택하면 서버의 임시 저장소에 우선 즉시 업로드한다. batch 아님, 개별 업로드
 * 2. 업로드에 성공하면 해당 파일의 정보를 폼 값으로(이하 '목록'이라함)에 기록한다.
 * 3. 파일을 제거하면 해당 파일 정보를 목록에서 제거한다.
 * 4. 폼의 서브밋이 발생하면 다른 폼 값과 함께 해당 목록을 서버에 전송한다.
 * 5. 서버는 해당 목록을 분석하여 다른 폼 값과 함께 데이터베이스에 저장한다.
 * 6. 이때 서버는 해당 파일을 실 저장 위치로 이동시킨다.
 * 7. 서버는 정기적으로 임시 저장소를 비운다.
 */

import { computed, reactive, ref, useAttrs } from 'vue'
import http from '@/api/http'
import { useQuasar } from 'quasar'
import filesize from 'filesize'

// 파일 사이즈 label 유틸 (1000 => 1KB)
const size = filesize.partial({ base: 2, standard: 'jedec', spacer: '', round: 1 })

// props, emit, attrs
const props = defineProps({
    icon: {
        type: String,
    },
})
const emit = defineEmits(['update:model-value'])
const attrs = useAttrs()

const $q = useQuasar()

// q-uploader 메소드를 사용하기 위한 ref
const uploader = ref(null)

// 'emit 대상 파일' 목록
const state = reactive({
    emitFiles: [],
})

const emitList = computed(() =>
    state.emitFiles.map(item => ({
        __key: item['__key'],
        name: item.name,
        __filename: item['__filename'],
        __destination: item['__destination'],
        __status: item['__status'],
        size: item.size,
        __sizeLabel: item['__sizeLabel'],
        type: item.type,
        __abort: item['__abort'],
        lastModified: item.lastModified,
    })),
)

// $q.notify 옵션
const opt = {
    position: 'top',
    timeout: 1000,
    icon: 'bi-bell-fill',
}

/**
 * 사용자가 파일을 Pick 한 직후 핸들러
 * 동일 파일이 '저장될 파일'에 있는지 검사하고 있으면 removeFile 로 박스 안에서 제거
 * @param list
 */
const addedHandler = list => {
    // list.find(item => console.log('item:', item))
    return false
}

/**
 * 서버 업로드가 끝난 후, 파일 정보(destination 등)를 기록하고, emit
 * @param res
 */
const uploadedHandler = async res => {
    const { files, xhr } = res

    const filesInfo = JSON.parse(xhr.response)

    // 추가 정보 기록
    filesInfo.forEach((item, index) => {
        files[index].__destination = item.destination
        files[index].__filename = item.filename
    })

    // 업로드에 성공한 파일은 emit 대상 목록에 추가
    files.forEach(item => {
        if (item['__status'] === 'uploaded') {
            state.emitFiles.push(item)
        }
    })

    // 필요한 정보만 emit
    emit('update:model-value', emitList.value)
}

/**
 * 업로드 실패 시, 핸들러
 * @param res
 */
const failedHandler = res => {
    let msg = '사용자에 의한 중지일 수 있습니다.'
    try {
        msg = JSON.parse(res.xhr.response).error
    } catch (e) {
        // console.log(e)
    }
    $q.notify({
        message: '일부 파일을 업로드하지 않았습니다.',
        caption: msg,
        color: 'negative',
        ...opt,
    })
}

/**
 * 파일 삭제
 * @param file
 * @param files
 * @returns {Promise<void>}
 */
const remove = async file => {
    try {
        // 서버에서 삭제
        if (file['__status'] === 'uploaded') {
            await removeFromStorage(file)
        }

        // Files 에서 삭제(removeFile)
        uploader.value.removeFile(file)

        // emit 대상 파일에서 삭제
        const targetIndex = state.emitFiles.findIndex(item => item['__key'] === file['__key'])
        state.emitFiles.splice(targetIndex, 1)

        // emit
        emit('update:model-value', emitList.value)

        // notify
        $q.notify({
            message: `서버에서 해당 파일을 삭제하였습니다.`,
            color: 'primary',
            ...opt,
        })
    } catch (e) {
        // console.log(e)
        $q.notify({
            message: '해당 파일을 삭제하지 못했습니다.',
            color: 'negative',
            ...opt,
        })
    }
}

/**
 * 파일 모두 삭제
 * @param files
 */
const removeAll = async files => {
    for (const file of files) {
        await remove(file, files)
    }
    uploader.value.reset()
}

/**
 * 서버에서 파일 삭제
 * @param file
 * @returns {Promise<void>}
 */
const removeFromStorage = async file => {
    // TODO: 외부 노출 시, 서버의 특정 파일을 삭제할 수 있으므로 향후, 반드시 토큰으로 보완 필요
    return await http.post('api/task-files/file-delete', {
        destination: file.__destination,
        filename: file.__filename,
    })
}

/**
 * 외부 노출을 위한 public 설정
 */
defineExpose({
    removeAll,
})
</script>
<template>
    <q-uploader
        v-bind="$attrs"
        ref="uploader"
        :form-fields="files => files.map(file => ({ name: '__key', value: file.__key }))"
        @added="addedHandler"
        @failed="failedHandler"
        @uploaded="uploadedHandler"
    >
        <template #header="scope">
            <div class="row justify-between items-center q-px-sm q-py-xs q-gutter-x-xs">
                <div class="col row items-center q-gutter-x-sm q-ml-xs">
                    <q-icon v-if="props.icon" :name="props.icon" size="sm" color="grey-6" />
                    <div v-if="props.label" class="q-uploader__title">{{ $attrs.label }}</div>
                    <div class="q-uploader__subtitle">
                        {{ scope.uploadSizeLabel }} /
                        {{ scope.uploadProgressLabel }}
                    </div>
                </div>
                <q-btn icon="las la-trash-alt" color="grey-6" @click="removeAll(scope.files)" round dense flat>
                    <q-tooltip>파일 모두 삭제</q-tooltip>
                </q-btn>
                <!--
                    <q-btn
                        v-if="scope.queuedFiles.length > 0"
                        icon="clear_all"
                        color="grey-6"
                        @click="scope.removeQueuedFiles"
                        round
                        dense
                        flat
                    >
                        <q-tooltip>업로드 안된 목록 제거</q-tooltip>
                    </q-btn>
                    <q-btn
                        v-if="scope.uploadedFiles.length > 0"
                        icon="done_all"
                        color="grey-6"
                        @click="scope.removeUploadedFiles"
                        round
                        dense
                        flat
                    >
                        <q-tooltip>업로드된 목록 제거</q-tooltip>
                    </q-btn>
                    -->
                <q-btn
                    v-if="scope.canAddFiles"
                    icon="las la-plus-circle"
                    color="grey-6"
                    @click="scope.pickFiles"
                    round
                    dense
                    flat
                >
                    <q-uploader-add-trigger />
                    <q-tooltip>파일 추가</q-tooltip>
                </q-btn>
                <q-btn v-if="scope.canUpload" icon="cloud_upload" color="grey-6" @click="scope.upload" round dense flat>
                    <q-tooltip>업로드</q-tooltip>
                </q-btn>
                <q-btn v-if="scope.isUploading" icon="stop_circle" color="grey-6" @click="scope.abort" round dense flat>
                    <q-tooltip>업로드 중지</q-tooltip>
                </q-btn>
                <q-spinner
                    v-if="scope.isUploading"
                    color="grey-6"
                    size="20px"
                    :thickness="2"
                    class="q-uploader__spinner"
                />
            </div>
        </template>
        <template #list="scope">
            <!--listScope:
            <pre>{{ scope }}</pre>-->
            <div>
                <div
                    v-if="scope.files.length < 1"
                    class="flex flex-center cursor-pointer"
                    style="height: 44px"
                    @click="scope.pickFiles"
                >
                    <q-icon name="add" size="sm" style="margin-bottom: 2px" color="grey-4" />
                    <!--<div class="text-grey-5 q-ml-sm text-weight-bold text-overline">클릭 또는 파일 드롭</div>-->
                </div>
                <q-linear-progress
                    v-for="file in scope.files"
                    :key="file['__key']"
                    :value="file['__uploaded'] / file.size"
                    color="grey-3"
                    style="border-radius: 6px; border: 1px solid white"
                    class="j-progress q-my-sm bg-transparent"
                >
                    <q-card
                        flat
                        bordered
                        class="q-pa-sm bg-transparent animate__animated animate__fadeIn animate__faster"
                    >
                        <!--file.__status idle:업로드전, uploaded: 업로드성공, failed: 업로드 실패 -->
                        <div class="row q-gutter-x-sm text-grey-8">
                            <div v-if="file['__status'] === 'failed'" class="row items-center">
                                <q-icon name="las la-exclamation-triangle" color="negative" size="md" />
                            </div>
                            <div v-if="file['__status'] === 'idle'" class="row items-center">
                                <q-icon name="las la-cloud-upload-alt" color="grey-4" size="md" />
                            </div>
                            <div v-if="file['__img']">
                                <q-avatar rounded>
                                    <img :src="file['__img'].src" />
                                </q-avatar>
                            </div>
                            <div class="col">
                                <div
                                    class="text-weight-bold text-body2"
                                    style="line-height: 120%; word-break: break-all"
                                >
                                    {{ file.name }}
                                </div>
                                <div class="text-overline q-mt-xs">
                                    {{ size(file['__uploaded']) }} / {{ file['__sizeLabel'] }} ({{
                                        file['__progressLabel']
                                    }})
                                </div>
                            </div>
                            <!--:style="`line-height: 120%; height: 50px; background: url(${file.__img.src}); background-size: contain; background-repeat: no-repeat`"-->
                            <div class="row items-center">
                                <q-btn
                                    icon="las la-trash-alt"
                                    dense
                                    flat
                                    size="md"
                                    color="grey-5"
                                    class="q-ml-xs"
                                    @click="remove(file)"
                                >
                                    <q-tooltip>파일 제거</q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                    </q-card>
                </q-linear-progress>
            </div>
        </template>
    </q-uploader>
</template>
