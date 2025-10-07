<template>
    <v-dialog v-model="mostrar" persistent max-width="1000px" v-if="manual">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-book-alert-outline">
                <b>Editar Manual {{ manual?.nombre }}</b>
            </v-alert>

            <v-card-text>
                <v-form ref="formularioEditarManual">
                    <v-row dense>
                        <v-col cols="8">
                            <v-text-field outlined v-model="formEditarManual.nombre" label="Nombre *"
                                :rules="[() => !!formEditarManual.nombre || 'Este campo es requerido']" dense />
                        </v-col>

                        <v-col cols="4">
                            <v-select outlined v-model="formEditarManual.tipos_usuario" :items="tiposUsuario"
                                item-text="nombre" item-value="id" label="Dirigido a (Tipo de Usuario) *" multiple chips
                                deletable-chips clearable dense small-chips
                                :rules="[() => formEditarManual.tipos_usuario.length > 0 || 'Seleccione al menos un tipo']" />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea outlined v-model="formEditarManual.descripcion" label="Descripción *" :rules="[
                                () => !!formEditarManual.descripcion || 'Este campo es requerido',
                                () => formEditarManual.descripcion.length >= 5 || 'Debe tener al menos 5 caracteres',
                                () => formEditarManual.descripcion.length <= 250 || 'Máximo 250 caracteres'
                            ]" dense auto-grow append-icon="mdi-content-paste"
                                @click:append="pegarDesdeClipboard('descripcion')" />
                        </v-col>

                        <v-col cols="12">
                            <v-file-input outlined v-model="formEditarManual.adjunto" label="Documento (opcional)"
                                accept=".pdf" chips small-chips clearable dense />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="success" small @click="editarManual">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarEditarManual: Boolean,
        manual: { type: Object, required: true },
    },
    data() {
        return {
            tiposUsuario: [],
            formEditarManual: {
                nombre: "",
                descripcion: "",
                adjunto: null,
                tipos_usuario: [],
            },
        };
    },
    computed: {
        mostrar: {
            get() {
                return this.mostrarEditarManual;
            },
            set(valor) {
                this.$emit("update:mostrarEditarManual", valor);
            },
        },
    },
    watch: {
        manual: {
            immediate: true,
            handler(newVal) {
                if (newVal) this.reiniciarFormulario();
            },
        },
        mostrarEditarManual(val) {
            if (val && this.manual) this.reiniciarFormulario();
        },
    },
    mounted() {
        this.obtenerTiposUsuario();
    },
    methods: {
        cerrarModal() {
            this.mostrar = false;
        },
        async pegarDesdeClipboard(campo) {
            try {
                const texto = await navigator.clipboard.readText();
                this.formEditarManual[campo] = texto;
            } catch (error) {
                this.$toast.error("No se pudo acceder al portapapeles");
            }
        },
        async obtenerTiposUsuario() {
            try {
                const { data } = await this.$axios.get("/tipo-usuario/todos");
                this.tiposUsuario = data ?? [];
            } catch (error) {
                this.$toast.error("No se pudieron cargar los tipos de usuario");
            }
        },
        reiniciarFormulario() {
            this.formEditarManual = {
                nombre: this.manual.nombre,
                descripcion: this.manual.descripcion,
                adjunto: null,
                tipos_usuario: this.manual.tipos_usuarios?.map(tu => tu.id) ?? [],
            };
        },
        editarManual() {
            const valido = this.$refs.formularioEditarManual.validate();
            if (!valido) {
                this.$toast.error("Debe corregir los errores antes de continuar");
                return;
            }

            const data = {
                id: this.manual.id,
                ...this.formEditarManual,
            };

            this.$emit("editarManual", data);
            this.cerrarModal();
        },
    },
};
</script>
