<template>
    <v-dialog v-model="mostrarCrearVideo" persistent max-width="1000px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-movie-open-play-outline">
                <b>Crear Nuevo Video</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formNuevoVideo">
                    <v-row dense>
                        <v-col cols="12" md="8">
                            <v-text-field v-model="nuevoVideo.nombre" label="Nombre *" :rules="[
                                () => !!nuevoVideo.nombre || 'Este campo es requerido',
                            ]" dense outlined></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="nuevoVideo.tipos_usuario" :items="tiposUsuario" item-text="nombre"
                                item-value="id" label="Dirigido a *" multiple dense outlined :rules="[
                                    () => nuevoVideo.tipos_usuario.length > 0 || 'Seleccione al menos un tipo de usuario',
                                ]"></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="nuevoVideo.descripcion" label="Descripción *" :rules="[
                                () => !!nuevoVideo.descripcion || 'Este campo es requerido',
                                () =>
                                    nuevoVideo.descripcion.length >= 5 ||
                                    'Debe tener al menos 5 caracteres',
                                () =>
                                    nuevoVideo.descripcion.length <= 250 ||
                                    'Debe tener máximo 250 caracteres',
                            ]" dense outlined auto-grow append-icon="mdi-content-paste"
                                @click:append="pegarDesdeClipboard('descripcion')"></v-textarea>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="nuevoVideo.url" label="Enlace *"
                                :rules="[() => !!nuevoVideo.url || 'Este campo es requerido']" dense outlined
                                append-icon="mdi-content-paste"
                                @click:append="pegarDesdeClipboard('url')"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="success" small @click="crearVideo">Crear</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarCrearVideo: Boolean,
    },
    data() {
        return {
            nuevoVideo: {
                nombre: "",
                descripcion: "",
                url: "",
                tipos_usuario: [],
            },
            tiposUsuario: [],
        };
    },
    mounted() {
        this.obtenerTiposUsuario();
    },
    methods: {
        cerrarModal() {
            this.limpiarFormulario();
            this.$emit("update:mostrarCrearVideo", false);
        },
        async pegarDesdeClipboard(campo) {
            try {
                const text = await navigator.clipboard.readText();
                this.nuevoVideo[campo] = text;
            } catch (err) {
                console.error("Error al pegar desde el portapapeles: ", err);
            }
        },
        crearVideo() {
            if (!this.$refs.formNuevoVideo.validate()) {
                this.$toast.error("Debe corregir los errores antes de continuar");
                return;
            }

            this.$emit("crearVideo", this.nuevoVideo);
            this.cerrarModal();
        },
        limpiarFormulario() {
            for (const key in this.nuevoVideo) {
                this.nuevoVideo[key] = Array.isArray(this.nuevoVideo[key]) ? [] : "";
            }

            this.$refs.formNuevoVideo.resetValidation();
        },
        async obtenerTiposUsuario() {
            try {
                const { data } = await this.$axios.get("/tipo-usuario/todos");
                this.tiposUsuario = data ?? [];
            } catch (error) {
                console.error("Error cargando tipos de usuario:", error);
                this.$toast.error("No se pudieron cargar los tipos de usuario");
            }
        },
    },
};
</script>
