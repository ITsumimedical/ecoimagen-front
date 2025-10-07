<template>
    <v-dialog v-model="mostrarFormularioCabecera" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Crear Cabecera</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCabecera" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" md="12" ms="12">
                            <v-text-field v-model="formCabecera.nombre_cabecera" dense outlined
                                label="Nombre cabecera *" hint="Por favor, verifique la información antes de enviarla."
                                :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" ms="12">
                            <v-autocomplete v-model="formCabecera.evento_id" :items="eventos" item-text="nombre_evento"
                                item-value="id" dense outlined label="Evento *"
                                :rules="rules.campoObligatorio"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="green" dark small @click="crearCabecera">Crear</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        mostrarFormularioCabecera: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            valid: false,
            eventos: [],
            formCabecera: {
                nombre_cabecera: null,
                evento_id: null
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

    methods: {
        ...mapActions('app', ['setPreload']),

        crearCabecera() {
            if (!this.$refs.formCabecera.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                nombre_cabecera: this.formCabecera.nombre_cabecera,
                evento_id: this.formCabecera.evento_id
            }
            this.$axios.post('cabeceras-sivigila/crear-cabecera/', data)
                .then(() => {
                    this.$toast.success("Cabecera ficha epidemiológica creada con éxito!");
                    this.$emit('cabeceraListarCrear');
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

        limpiarCampos() {
            this.formCabecera = {
                nombre_cabecera: null,
                evento_id: null
            }
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioCabecera", false);
            this.limpiarCampos();
        },
    }
}
</script>
