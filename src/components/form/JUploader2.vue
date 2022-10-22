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

import { reactive, ref, useAttrs } from 'vue'
import http from '@/api/http'
import { useQuasar } from 'quasar'

// props, emit, attrs
const props = defineProps({
    uploaderClass: {
        type: String,
    },
    uploaderStyle: {
        type: String,
        default: 'width: 100%',
    },
    icon: {
        type: String,
    },
})
const emit = defineEmits(['update:model-value'])
const attrs = useAttrs()

const $q = useQuasar()

// q-uploader 메소드를 사용하기 위한 ref
const uploader = ref(null)

// '저장될 파일' 목록
const state = reactive({
    uploadedFiles: [],
})

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
    list.find(item => {
        console.log('item', item.type)
        state.uploadedFiles.find(i => {
            if (i['__key'] === item['__key']) {
                uploader.value.removeFile(item)
                return false
            }
        })
    })
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
 * 서버 업로드가 끝난 후, 파일 정보(destination 등)를 기록하고,
 * '저장될 파일' 목록(state.uploadedFiles) 생성
 * @param res
 */
const logUploadResult = async res => {
    const wait = timeToDelay => new Promise(resolve => setTimeout(resolve, timeToDelay))
    await wait(2000)

    const { files, xhr } = res

    /*
        files: 업로드 완료된 파일 목록
        xhr: 업로드 요청에 대한 응답
     */

    // console.log('files', files)

    const filesInfo = JSON.parse(xhr.response)
    // console.log('uploadedFiles', uploadedFiles)
    // console.log('files', files)

    // 추가 정보 기록
    filesInfo.forEach((item, index) => {
        files[index].__destination = item.destination
        files[index].__filename = item.filename
    })

    // 업로드 된 파일은 박스에서 제거하고, '저장될 파일' state.uploadedFiles 생성
    files.forEach(item => {
        // if (!state.uploadedFiles.find(i => i['__key'] === item['__key'])) {
        // item 제거(quasar 의 메소드인 removeFile 에 의해 썸네일도 제거됨)
        uploader.value.removeFile(item)

        // 썸네일 생성
        // const lastFile = state.uploadedFiles.slice(-1)[0]
        if (attrs.noThumbnails !== true && item.type.toUpperCase().startsWith('IMAGE')) {
            const img = new Image()
            img.src = window.URL.createObjectURL(item)
            item['__img'] = img
        }

        // uploadedFiles 에 item add
        state.uploadedFiles.push(item)
        // }
    })

    // 필요한 정보만 emit
    emit(
        'update:model-value',
        state.uploadedFiles.map(item => ({
            __destination: item['__destination'],
            __filename: item['__filename'],
            __key: item['__key'],
            __sizeLabel: item['__sizeLabel'],
            size: item.size,
            type: item.type,
            lastModified: item.lastModified,
            name: item.name,
        })),
    )
}

/**
 * 서버에서 파일 삭제
 * @param file
 * @returns {Promise<string>}
 */
const removeFromStorage = async file => {
    // console.log('file', file)
    // 이미 저장된 파일이 아닐 경우 여기선 제외
    // 그러나 아래에 해당하는 경우는 있을 수 없음(?)
    if (file['__status'] !== 'uploaded') return ''

    try {
        // 서버에서 파일 삭제
        // 'DELETE' 를 사용해야 하나, 보안을 위해 'POST' 선택(서버엔 삭제 파일 경로와 이름만 넘긴다)
        // TODO: 외부 노출 시, 서버의 특정 파일을 삭제할 수 있으므로 향후, 반드시 토큰으로 보완 필요
        await http.post('api/task-files/file-delete', {
            destination: file.__destination,
            filename: file.__filename,
        })

        // 업로드 파일 목록에서 삭제
        const targetIndex = state.uploadedFiles.findIndex(item => item['__key'] === file['__key'])
        state.uploadedFiles.splice(targetIndex, 1)

        // emit
        emit('update:model-value', state.uploadedFiles)

        $q.notify({
            message: `서버에서 해당 파일을 삭제하였습니다.`,
            color: 'primary',
            ...opt,
        })
    } catch (e) {
        // console.log(e)
        $q.notify({
            message: '서버 문제로 해당 파일을 삭제하지 못했습니다.',
            color: 'negative',
            ...opt,
        })
    }
}

/**
 * 서버에서 파일 모두 삭제
 * @returns {Promise<void>}
 */
const removeFromStorageAll = async () => {
    try {
        // state.uploadedFiles.forEach(item => removeFromStorage(item)) // await 를 사용할 수 없다.
        const len = state.uploadedFiles.length
        for (let i = 0; i < len; i++) {
            // 계속 첫번째 배열을 삭제해야하는 이유는 removeFromStorage 에서 배열 목록을 계속 수정하기 때문
            await removeFromStorage(state.uploadedFiles[0])
        }
    } catch (e) {
        // console.log(e)
    }
}
</script>
<template>
    <div>
        <q-uploader
            v-bind="$attrs"
            ref="uploader"
            :form-fields="files => files.map(file => ({ name: '__key', value: file.__key }))"
            :style="props.uploaderStyle"
            :class="props.uploaderClass"
            @added="addedHandler"
            @failed="failedHandler"
            @uploaded="logUploadResult"
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
                    <q-btn icon="refresh" color="grey-6" @click="scope.reset" round dense flat>
                        <q-tooltip>목록 리셋</q-tooltip>
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
                        icon="add_box"
                        color="grey-6"
                        @click="scope.pickFiles"
                        round
                        dense
                        flat
                    >
                        <q-uploader-add-trigger />
                        <q-tooltip>파일 추가</q-tooltip>
                    </q-btn>
                    <q-btn
                        v-if="scope.canUpload"
                        icon="cloud_upload"
                        color="grey-6"
                        @click="scope.upload"
                        round
                        dense
                        flat
                    >
                        <q-tooltip>업로드</q-tooltip>
                    </q-btn>
                    <q-btn
                        v-if="scope.isUploading"
                        icon="stop_circle"
                        color="grey-6"
                        @click="scope.abort"
                        round
                        dense
                        flat
                    >
                        <q-tooltip>업로드 중지</q-tooltip>
                    </q-btn>
                    <q-spinner v-if="scope.isUploading" color="grey-6" class="q-uploader__spinner" />
                </div>
            </template>
            <template #list="scope">
                <div>
                    <!--<pre>{{ scope }}</pre>-->
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
                                        {{ file['__sizeLabel'] }} / {{ file['__progressLabel'] }}
                                    </div>
                                </div>
                                <!--:style="`line-height: 120%; height: 50px; background: url(${file.__img.src}); background-size: contain; background-repeat: no-repeat`"-->
                                <div class="row items-center">
                                    <q-btn
                                        icon="remove_circle_outline"
                                        dense
                                        flat
                                        size="sm"
                                        class="q-ml-xs"
                                        @click="$refs.uploader.removeFile(file)"
                                    >
                                        <q-tooltip>목록에서 제거</q-tooltip>
                                    </q-btn>
                                </div>
                            </div>
                        </q-card>
                    </q-linear-progress>
                </div>
            </template>
        </q-uploader>

        <!-- 저장될 파일 -->
        <div v-if="state.uploadedFiles.length > 0" class="row justify-between q-mt-lg q-ml-xs">
            <div class="row q-gutter-x-sm">
                <q-icon name="cloud_queue" size="sm" />
                <div class="text-body1">
                    저장될 파일 <q-badge align="top">{{ state.uploadedFiles.length }}</q-badge>
                </div>
            </div>
            <q-btn
                label="전체 삭제"
                size="12px"
                color="grey-4"
                text-color="grey-8"
                unelevated
                dense
                class="q-px-sm"
                @click="removeFromStorageAll"
            />
        </div>
        <div>
            <q-card
                v-for="file in state.uploadedFiles"
                :key="file['__key']"
                flat
                bordered
                class="q-pa-sm q-my-sm bg-transparent animate__animated animate__fadeIn animate__faster"
            >
                <!--file.__status idle:업로드전, uploaded: 업로드성공, failed: 업로드 실패 -->
                <div class="row q-gutter-x-sm text-grey-8">
                    <div v-if="file['__img']">
                        <q-avatar rounded>
                            <img :src="file['__img'].src" />
                        </q-avatar>
                    </div>
                    <div class="col">
                        <div class="text-weight-bold text-body2" style="line-height: 120%; word-break: break-all">
                            {{ file.name }}
                        </div>
                        <div class="text-overline q-mt-xs">{{ file['__sizeLabel'] }}</div>
                    </div>
                    <!--:style="`line-height: 120%; height: 50px; background: url(${file.__img.src}); background-size: contain; background-repeat: no-repeat`"-->
                    <div class="row items-center">
                        <q-btn
                            icon="las la-times"
                            dense
                            flat
                            size="sm"
                            class="q-ml-xs"
                            @click="removeFromStorage(file)"
                        >
                            <q-tooltip>'저장될 파일'에서 삭제</q-tooltip>
                        </q-btn>
                    </div>
                </div>
            </q-card>
        </div>
    </div>
</template>
