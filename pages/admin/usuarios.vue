<template>
    <Usuarios />
</template>

<script>
import Usuarios from '@/components/admin/Usuarios.vue';
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('usuarios.vista')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonUsuarios',
    components: {
        Usuarios
    },

    data() {
        return {

        };
    },

    mounted() {

    },

    methods: {

    },
};

</script>

<style lang="scss" scoped></style>
