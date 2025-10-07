<template>
    <v-dialog v-model="mostrarFormularioActualizarCabecera" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Actualizar Cabecera</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCabecera" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" md="12" ms="12" class="mt-4">
                            <v-text-field dense v-model="formCabecera.nombre_cabecera" outlined
                                label="Nombre cabecera *" hint="Por favor, verifique la información antes de enviarla."
                                :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-alert text dense border="left" color="gray">
                                <b>Evento Actual:</b>
                                <p>{{ cabecera?.evento_sivigila?.nombre_evento }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" ms="6" class="mt-4">
                            <v-autocomplete v-model="formCabecera.evento_id" :items="eventos" item-text="nombre_evento"
                                item-value="id" dense outlined label="Evento *"
                                ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="warning" dark small @click="editarCabecera">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        mostrarFormularioActualizarCabecera: {
            type: Boolean,
            default: false
        },
        cabecera: Object
    },

    data() {
        return {
            valid: false,
            eventos: [],
            formCabecera: {
                nombre_cabecera: this.cabecera.nombre_cabecera,
                evento_id: null,
            },
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ],
            }
        }
    },

    mounted() {
        this.listarEventos();
    },

    watch: {
        cabecera(newEvento) {
            if (newEvento) {
                this.formCabecera = {
                    nombre_cabecera: newEvento.nombre_cabecera,
                    evento_id: null,
                };
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        editarCabecera() {
            if (!this.$refs.formCabecera.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                nombre_cabecera: this.formCabecera.nombre_cabecera,
                evento_id: this.formCabecera.evento_id !== null
                    ? this.formCabecera.evento_id
                    : this.cabecera.evento_sivigila.id
            }
            this.$axios.post(`cabeceras-sivigila/actualizar-cabecera/${this.cabecera.id}`, data)
                .then(() => {
                    this.$toast.success("Cabecera ficha epidemiológica creada con éxito!");
                    this.$emit('cabeceraListarActualizar');
                    this.cerrarFormulario();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al crear la cabecera. Por favor, intente nuevamente.")
                })
                .finally(() => {
                    this.setPreload(false);
                })
        },

        listarEventos() {
            this.$axios.post('/eventos-sivigila/listar-eventos')
                .then(res => {
                    this.eventos = res.data;
                })
                .catch(err => {
                    console.error('Error al listar los eventos sivigila:', err);
                    this.$toast.error('Error al listar los eventos sivigila.');
                });
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioActualizarCabecera", false);
        },
    }
}
</script>
