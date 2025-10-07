<template>
    <v-dialog v-model="mostrarFormularioCamposActualizar" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Crear Campo</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCampo" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" md="12" ms="12">
                            <v-text-field v-model="formCampo.nombre_campo" dense outlined label="Nombre campo: *"
                                hint="Por favor, verifique la información antes de enviarla."
                                :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-autocomplete v-model="formCampo.tipo_campo" :items="tipoCampo" item-text="text"
                                item-value="value" dense outlined label="Tipo campo *"
                                :rules="rules.campoObligatorio"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-autocomplete v-model="formCampo.obligatorio" :items="esObligatorio" item-text="text"
                                item-value="value" dense outlined label="Es obligatorio *"
                                :rules="rules.campoObligatoriofalse"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="12" ms="12">
                            <v-autocomplete v-show="formCampo.tipo_campo === 'fecha'" v-model="formCampo.condicionFecha" :items="condicionMaxMinFecha" item-text="text"
                                item-value="value" dense outlined label="Fecha maxima" hint="La fecha tendra la condicion de elegir el día actual (Hoy), así atrás"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-alert text dense border="left" color="gray">
                                <b>Cabecera Actual:</b>
                                <p>{{ campo?.cabecera_sivigila?.nombre_cabecera }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" ms="6" class="mt-4">
                            <v-autocomplete v-model="formCampo.cabecera_id" :items="cabeceras"
                                item-text="nombre" item-value="id" dense outlined label="Cabecera" :loading="caragandoCab" :search-input.sync="buscarCabecera" no-data-text="Escribe al menos 4 letras para buscar"
                                ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="warning" dark small @click="actualizarCampo">Actualizar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    props: {
        mostrarFormularioCamposActualizar: {
            type: Boolean,
            default: false
        },
        campo: Object,
    },

    data() {
        return {
            valid: false,
            cabeceras: [],
            campos: [],
            opcione: [],
            caragandoCab: false,
            caragandoCamp: false,
            caragandoOpc: false,
            formCampo: {
                nombre_campo: this.campo.nombre_campo,
                tipo_campo: this.campo.tipo_campo,
                cabecera_id: null,
                obligatorio: this.campo.obligatorio,
                condicionFecha: this.campo.max,
            },
            tipoCampo: [
                { text: 'Texto', value: 'texto' },
                { text: 'Numero', value: 'numero' },
                { text: 'Seleccion simple/unica', value: 'seleccion_simple' },
                { text: 'Seleccion multiple', value: 'seleccion_multiple' },
                { text: 'Fecha', value: 'fecha' },
                { text: 'Hora', value: 'hora' },
            ],
            esObligatorio: [
                { text: 'Obligatorio', value: true },
                { text: 'No obligatorio', value: false },
            ],
            condicionMaxMinFecha: [
                { text: 'Si', value: true },
                { text: 'No', value: false },
            ],
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ],
                campoObligatoriofalse: [
                    v => v !== null && v !== undefined && v !== '' || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            },
            buscarCabecera: null,
        }
    },

    watch: {
        campo(newVal) {
            if (newVal) {
                this.formCampo = {
                    nombre_campo: newVal.nombre_campo,
                    tipo_campo: newVal.tipo_campo,
                    cabecera_id: null,
                    obligatorio: newVal.obligatorio,
                    condicionFecha: newVal.max,
                }
            }
        },

        buscarCabecera(newVal) {
            if(newVal && newVal.length === 4) {
                this.listarCabeceras();
            }
        }
    },

    // mounted() {
    //     this.listarCabeceras();
    // },

    methods: {
        ...mapActions('app', ['setPreload']),

        actualizarCampo() {
            if (!this.$refs.formCampo.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                nombre_campo: this.formCampo.nombre_campo,
                tipo_campo: this.formCampo.tipo_campo,
                cabecera_id: this.formCampo.cabecera_id !== null
                    ? this.formCampo.cabecera_id
                    : this.campo.cabecera_sivigila.id,
                obligatorio: this.formCampo.obligatorio,
                max: this.formCampo.condicionFecha,
                min: this.formCampo.condicionFecha
            }
            this.$axios.post(`campos-sivigila/actualizar-campo/${this.campo.id}`, data)
                .then(() => {
                    this.$toast.success("campo ficha epidemiológica actualizado con éxito!");
                    this.$emit('campoListarActualizar');
                    this.cerrarFormulario();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al actualizar la campo. Por favor, intente nuevamente.")
                })
                .finally(() => {
                    this.setPreload(false);
                })
        },

        listarCabeceras() {
            const data = {
                cabecera: this.buscarCabecera
            }
            this.caragandoCab = true;
            this.$axios.post('/cabeceras-sivigila/listar-cabeceras', data)
                .then(res => {
                    this.cabeceras = res.data.map((cabecera) => {
                        return {
                            id: cabecera.id,
                            nombre: `${cabecera.nombre_cabecera} (${cabecera.evento_sivigila.nombre_evento})`
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar las cabeceras sivigila.');
                })
                .finally(() => {
                    this.caragandoCab = false;
                })
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioCamposActualizar", false);
        },
    }
}
</script>
