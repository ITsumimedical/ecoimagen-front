<template>
    <v-dialog v-model="mostrarEditarVideo" persistent max-width="1000px" v-if="video">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-movie-open-play-outline">
                <b>Editar Video {{ video?.nombre }}</b>
            </v-alert>

            <v-card-text>
                <v-form ref="formularioEditarVideo">
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field v-model="formEditarVideo.nombre" label="Nombre *"
                                :rules="[() => !!formEditarVideo.nombre || 'Este campo es requerido']" dense outlined />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea v-model="formEditarVideo.descripcion" label="Descripción *" :rules="[
                                () => !!formEditarVideo.descripcion || 'Este campo es requerido',
                                () => formEditarVideo.descripcion.length >= 5 || 'Mínimo 5 caracteres',
                                () => formEditarVideo.descripcion.length <= 250 || 'Máximo 250 caracteres'
                            ]" dense outlined auto-grow append-icon="mdi-content-paste"
                                @click:append="pegarDesdeClipboard('descripcion')" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="formEditarVideo.url" label="Enlace *"
                                :rules="[() => !!formEditarVideo.url || 'Este campo es requerido']" dense outlined
                                append-icon="mdi-content-paste" @click:append="pegarDesdeClipboard('url')" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="formEditarVideo.tipos_usuario" :items="tiposUsuariosDisponibles" deletable-chips
                                item-text="nombre" item-value="id" label="Tipos de usuario relacionados" multiple dense
                                small-chips outlined clearable chips :rules="[
                                    () => formEditarVideo.tipos_usuario.length > 0 || 'Seleccione al menos un tipo de usuario',
                                ]" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="success" small @click="editarVideo">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarEditarVideo: Boolean,
        video: { type: Object, required: true },
    },
    data() {
        return {
            tiposUsuariosDisponibles: [],
            formEditarVideo: {
                nombre: "",
                url: "",
                descripcion: "",
                tipos_usuario: [],
            },
        };
    },
    watch: {
        video: {
            immediate: true,
            handler(newVal) {
                if (newVal) this.reiniciarFormulario();
            },
        },
        mostrarEditarVideo(val) {
            if (val && this.video) {
                this.reiniciarFormulario();
                this.obtenerTiposUsuariosDisponibles();
            }
        },
    },
    mounted() {
        this.obtenerTiposUsuariosDisponibles();
    },
    methods: {
        reiniciarFormulario() {
            this.formEditarVideo = {
                nombre: this.video.nombre || "",
                url: this.video.url || "",
                descripcion: this.video.descripcion || "",
                tipos_usuario: this.video.tipos_usuarios?.map(t => t.id) || [],
            };
        },

        cerrarModal() {
            this.$emit("update:mostrarEditarVideo", false);
        },

        async pegarDesdeClipboard(campo) {
            try {
                const text = await navigator.clipboard.readText();
                this.formEditarVideo[campo] = text;
            } catch (err) {
                console.error("Error al pegar desde el portapapeles: ", err);
            }
        },

        async obtenerTiposUsuariosDisponibles() {
            try {
                const { data } = await this.$axios.get("/tipo-usuario/todos");
                this.tiposUsuariosDisponibles = data ?? [];
            } catch (error) {
                console.error("Error al obtener tipos de usuario:", error);
                this.$toast.error("No se pudieron cargar los tipos de usuario");
            }
        },

        editarVideo() {
            if (!this.$refs.formularioEditarVideo.validate()) {
                this.$toast.error("Debe corregir los errores antes de continuar");
                return;
            }

            const data = {
                id: this.video.id,
                ...this.formEditarVideo,
            };

            this.$emit("editarVideo", data);
            this.cerrarModal();
        },
    },
};
</script>
