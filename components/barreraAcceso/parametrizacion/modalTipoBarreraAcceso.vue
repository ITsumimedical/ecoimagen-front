<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span class="ml-3">{{ esEditar ? 'Editar Tipo Barrera Acceso' : 'Crear Tipo Barrera Acceso'
                                }}</span>
                        </div>
                    </v-toolbar-title>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field v-model="form.nombre" label="Tipo: *" outlined dense
                                :rules="rules.campoObligatorio" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="cerrar">
                    cerrar
                </v-btn>
                <v-btn small :color="esEditar ? 'warning' : 'success'" @click="guardar">
                    {{ esEditar ? 'Actualizar' : 'Crear' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarModal: Boolean,
        modo: String, // 'crear' o 'editar'
        tipo: Object,
    },

    data() {
        return {
            form: {
                nombre: "",
            },
            valid: false,
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        };
    },

    computed: {
        dialog: {
            get() {
                return this.mostrarModal;
            },
            set(val) {
                this.$emit("update:mostrarModal", val);
            },
        },
        esEditar() {
            return this.modo === "editar";
        },
    },

    watch: {
        dialog(val) {
            if (val) {
                if (this.esEditar && this.tipo) {
                    this.form = { ...this.tipo };
                } else {
                    this.form = { nombre: "" };
                }
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        guardar() {
            if (!this.$refs.form.validate()) {
                return
            }
            this.setPreload(true);
            const url = this.esEditar
                ? `/tipo-barrera-acceso/actualizar-tipo_barrera_acceso/${this.form.id}`
                : `/tipo-barrera-acceso/crear-tipo_barrera_acceso`;

            const metodo = this.esEditar ? "put" : "post";

            this.$axios[metodo](url, this.form)
                .then(() => {
                    this.$toast.success(this.esEditar ? "Tipo barrera de acceso actualizado" : "Tipo barrera de acceso creado");
                    this.$emit("update:mostrarModal", false);
                    this.$emit("listar");
                })
                .catch(() => {
                    this.$toast.error("Error al guardar");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        cerrar() {
            this.dialog = false;
        },
    },
};
</script>
