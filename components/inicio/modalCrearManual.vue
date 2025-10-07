<template>
    <v-dialog v-model="mostrar" persistent max-width="1000px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-book-alert-outline">
                <b>Crear Nuevo Manual</b>
            </v-alert>

            <v-card-text>
                <v-form ref="formNuevoManual">
                    <v-row dense>
                        <v-col cols="8">
                            <v-text-field outlined v-model="nuevoManual.nombre" label="Nombre *"
                                :rules="[() => !!nuevoManual.nombre || 'Este campo es requerido']" dense />
                        </v-col>

                        <v-col cols="4">
                            <v-select outlined v-model="nuevoManual.tipos_usuario" :items="tiposUsuario"
                                item-text="nombre" item-value="id" label="Dirigido a (Tipo de Usuario) *" multiple chips
                                clearable dense small-chips deletable-chips
                                :rules="[() => nuevoManual.tipos_usuario.length > 0 || 'Seleccione al menos un tipo']" />
                        </v-col>

                        <v-col cols="12">
                            <v-textarea outlined v-model="nuevoManual.descripcion" label="Descripción *" :rules="[
                                () => !!nuevoManual.descripcion || 'Este campo es requerido',
                                () => nuevoManual.descripcion.length >= 5 || 'Debe tener al menos 5 caracteres',
                                () => nuevoManual.descripcion.length <= 250 || 'Máximo 250 caracteres'
                            ]" dense auto-grow append-icon="mdi-content-paste"
                                @click:append="pegarDesdeClipboard('descripcion')" />
                        </v-col>

                        <v-col cols="12">
                            <v-file-input outlined v-model="nuevoManual.adjunto" label="Documento *" accept=".pdf" chips
                                small-chips dense :rules="[() => !!nuevoManual.adjunto || 'Este campo es requerido']" />
                        </v-col>

                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn color="error" small @click="cerrarModal">Cerrar</v-btn>
                <v-btn color="success" small @click="crearManual">Crear</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarCrearManual: Boolean,
    },
    data() {
        return {
            tiposUsuario: [],
            nuevoManual: {
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
                return this.mostrarCrearManual;
            },
            set(valor) {
                this.$emit("update:mostrarCrearManual", valor);
            },
        },
    },
    mounted() {
        this.obtenerTiposUsuario();
    },
    methods: {
        cerrarModal() {
            this.limpiarFormulario();
            this.mostrar = false;
        },
        async pegarDesdeClipboard(campo) {
            try {
                const texto = await navigator.clipboard.readText();
                this.nuevoManual[campo] = texto;
            } catch (error) {
                console.error("Error al pegar desde portapapeles:", error);
                this.$toast.error("No se pudo acceder al portapapeles");
            }
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
        crearManual() {
            const formularioValido = this.$refs.formNuevoManual.validate();
            if (!formularioValido) {
                this.$toast.error("Debe corregir los errores antes de continuar");
                return;
            }

            this.$emit("crearManual", this.nuevoManual);
            this.cerrarModal();
        },
        limpiarFormulario() {
            this.nuevoManual = {
                nombre: "",
                descripcion: "",
                adjunto: null,
                tipos_usuario: [],
            };
            this.$refs.formNuevoManual?.resetValidation();
        },
    },
};
</script>