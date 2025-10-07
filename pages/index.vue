<template>
    <div>
        <Login />
    </div>
</template>

<script>
import Login from "@/components/auth/Inicio_sesion.vue";
export default {

    middleware: ['guest'],
    name: 'HorusLogin',
    layout: 'guest',

    components: {
        Login
    }
};

</script>
