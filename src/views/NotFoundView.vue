<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';

const router = useRouter()
const errorPicture = ref('https://www.appsheet.com/template/gettablefileurl?appName=Upload_Picture-2027633&tableName=Picture&fileName=Picture_Images%2F03-11-2024%2023-21-22.Picture.162202.jpg')

onMounted(() => {
    setTimeout(() => {
        router.push({ name: 'home' })
    }, "2000");
})

</script>
<template>
    <div>
        <img id="errorPhoto" :src="errorPicture" alt="">

    </div>
</template>
<style scoped>
#errorPhoto {
    width: 100%;
    height: auto;
}
</style>