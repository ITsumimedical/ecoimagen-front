<template>
    <v-dialog v-model="mostrarFormularioActualizarOpciones" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Actualizar Opcion</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formOpciones" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" md="12" ms="12">
                            <v-text-field v-model="formOpcion.nombre_opcion" dense outlined label="Opcion: *"
                                hint="Por favor, verifique la información antes de enviarla." :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-alert text dense border="left" color="gray">
                                <b>Cabecera Actual:</b>
                                <p>{{ opcion?.campo_sivigila?.nombre_campo }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" ms="6" class="mt-4">
                            <v-autocomplete v-model="formOpcion.campo_id" :items="campos" item-text="nombre"
                                item-value="id" dense outlined label="Campo *"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="warning" dark small @click="actualizarOpcion">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    props: {
        mostrarFormularioActualizarOpciones: {
            type: Boolean,
            default: false
        },
        opcion: Object,
    },

    data() {
        return {
            valid: false,
            campos: [],
            formOpcion: {
                nombre_opcion: this.opcion.nombre_opcion,
                campo_id: null,
            },
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        }
    },

    mounted() {
        this.listarCampos();
    },

    watch: {
        opcion(newVal) {
            if(newVal) {
                this.formOpcion = {
                    nombre_opcion: newVal.nombre_opcion,
                    campo_id: null,
                }
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        actualizarOpcion() {
            if(!this.$refs.formOpciones.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                nombre_opcion: this.formOpcion.nombre_opcion,
                campo_id: this.formOpcion.campo_id !== null
                    ? this.formOpcion.campo_id
                    : this.opcion.campo_sivigila.id,
            }
            this.$axios.post(`opciones-sivigila/actualizar-opcion/${this.opcion.id}`, data)
                .then(() => {
                    this.$toast.success("Opcion ficha epidemiológica creada con éxito!");
                    this.$emit('opcionListarActualizar');
                    this.cerrarFormulario();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al crear la opcion. Por favor, intente nuevamente.")
                })
                .finally(() => {
                    this.setPreload(false);
                })
        },

        listarCampos() {
            this.$axios.post('/campos-sivigila/listar-campos')
                .then(res => {
                    this.campos = res.data.map((campo) => {
                        return {
                            id: campo.id,
                            nombre: `${campo.nombre_campo} (${campo.cabecera_sivigila.nombre_cabecera} / ${campo.cabecera_sivigila.evento_sivigila.nombre_evento})`
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar los campos sivigila.');
                })
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioActualizarOpciones", false);
        },
    }
}
</script>
