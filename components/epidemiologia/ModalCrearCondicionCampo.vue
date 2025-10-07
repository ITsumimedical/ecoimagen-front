<template>
    <v-dialog v-model="mostrarFormularioCondicionarCampo" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Condicionar Campo</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCampo" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" color="gray">
                                <b>Campo / Cabecera / Evento</b>
                                <p>{{ campoCondicion?.nombre_campo }} / {{ campoCondicion?.cabecera_sivigila?.nombre_cabecera }} / {{ campoCondicion?.cabecera_sivigila?.evento_sivigila?.nombre_evento}}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-alert text dense border="left" color="gray">
                                <b>Condición Actual:</b>
                                <p>{{ campoCondicion?.condicion !== null ? campoCondicion?.condicion : 'SIN CONDICIÓN' }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-alert text dense border="left" color="gray">
                                <b>comparación Actual:</b>
                                <p>{{ campoCondicion?.comparacion !== null ? campoCondicion?.campo_sivigila?.nombre_campo : 'SIN COMPARACIÓN' }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-autocomplete dense v-model="formCondicion.condicion" outlined label="Condición *" :items="opcione" item-text="nombre_completo"
                                return-object
                                hint="Seleciona la opcion con la cual se realizara la condición"
                                :rules="rules.campoObligatorio" :loading="caragandoOpc"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-autocomplete  v-model="formCondicion.comparacion" :items="campos" item-text="nombre"
                                item-value="id" dense outlined label="Campo comparación *" :loading="caragandoCamp"
                                hint="Seleciona el campo con el cual se realizara la comparación"
                                :rules="rules.campoObligatorio"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="primary" dark small @click="agregarCondicion">Guardar condición</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    props: {
        mostrarFormularioCondicionarCampo: {
            type: Boolean,
            default: false
        },
        campoCondicion: Object,
    },

    data() {
        return {
            valid: false,
            caragandoOpc: false,
            caragandoCamp: false,
            campos: [],
            opcione: [],
            formCondicion: {
                condicion: '',
                comparacion: null,
            },
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ],
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        agregarCondicion() {
            if (!this.$refs.formCampo.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                condicion: this.formCondicion.condicion.nombre,
                comparacion: this.formCondicion.comparacion,
            }
            this.$axios.post(`campos-sivigila/agregar-condicion/${this.campoCondicion.id}`, data)
                .then(() => {
                    this.$toast.success("campo ficha epidemiológica condicionado con éxito!");
                    this.$emit('camposlistar');
                    this.cerrarFormulario();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al condicionadar el campo. Por favor, intente nuevamente.")
                })
                .finally(() => {
                    this.setPreload(false);
                })
        },

        listarCampos() {
            this.caragandoCamp = true;
            const data = {
                id: this.campoCondicion.cabecera_sivigila.evento_sivigila.id
            }
            this.$axios.post('/campos-sivigila/listar-campos-evento', data)
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
                .finally(() => {
                    this.caragandoCamp = false;
                })
        },

        listarOpcion() {
            this.caragandoOpc = true;
            const data = {
                id: this.campoCondicion.cabecera_sivigila.evento_sivigila.id
            }
            this.$axios.post('/opciones-sivigila/listar-opciones-evento', data)
                .then(res => {
                    this.opcione = res.data.map((opcion) => {
                        return {
                            id: opcion.id,
                            nombre: opcion.nombre_opcion,
                            nombre_completo: `${opcion.nombre_opcion} (${opcion.campo_sivigila.nombre_campo} / ${opcion.campo_sivigila.cabecera_sivigila.nombre_cabecera} / ${opcion.campo_sivigila.cabecera_sivigila.evento_sivigila.nombre_evento})`,
                        }
                    });
                })
                .catch(err => {
                    this.$toast.error('Error al listar los opciones sivigila.');
                })
                .finally(() => {
                    this.caragandoOpc = false;
                })
        },

        limpiarForm() {
            this.formCondicion = {
                condicion: '',
                comparacion: null,
            }
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioCondicionarCampo", false);
            this.limpiarForm();
        },
    }
}
</script>
