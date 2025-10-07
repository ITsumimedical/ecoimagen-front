<template>
    <v-dialog v-model="dialog" persistent max-width="320">
        <v-card elevation="0" class="rounded-xxl overflow-hidden">
            <v-card-title>{{ titulo }}</v-card-title>
            <v-card-text>{{ mensaje }}</v-card-text>
            <v-card-actions>
                <v-btn @click="dialog = false" text color="success">aceptar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            mensaje: '',
            titulo: ''
        };
    },

    methods: {
        async show(titulo, mensaje) {
            this.titulo = titulo;
            this.mensaje = mensaje;
            this.dialog = true;
        },
    }
};
</script>
<style scoped>
.v-dialog.v-dialog--active.v-dialog--persistent {
    border-radius: 24px;
}
</style>