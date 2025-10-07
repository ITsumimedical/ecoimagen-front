<template>
    <div class="preload">
        <img src="/images/preload_horus.gif" class="no-box-shadow" height="350px" width="510px">
    </div>
</template>
<script>

export default {

}
</script>
<style scoped>

.preload {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

</style>
