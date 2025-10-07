<template>
    <v-dialog v-model="mostrarFormularioEvento" persistent max-width="850px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Crear Evento</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formEvento" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" md="12" ms="12">
                            <v-text-field dense outlined label="Nombre evento: *" v-model="formEvento.nombre_evento"
                                hint="Por favor, verifique la información antes de enviarla."
                                :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" ms="12">
                            <v-text-field dense outlined label="Edad minima: *" v-model="formEvento.rango_edad_inicio"
                                type="number" :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" ms="12">
                            <v-text-field dense outlined label="Edad maxima: *" v-model="formEvento.rango_edad_final"
                                type="number" :rules="rules.campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" ms="12">
                            <v-autocomplete dense outlined label="¿Gestante? *" v-model="formEvento.gestante"
                                :items="gestante" item-text="text" item-value="value" :rules="rules.campoObligatoriofalse"></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="green" dark small @click="crearEvento">Crear</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarFormularioEvento: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            valid: true,
            formEvento: {
                nombre_evento: null,
                rango_edad_inicio: null,
                rango_edad_final: null,
                gestante: null,
            },
            gestante: [
                { text: 'Si', value: true },
                { text: 'No', value: false }
            ],
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ],
                campoObligatoriofalse: [
                    v => v !== null && v !== undefined && v !== '' || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        crearEvento() {
            if (!this.$refs.formEvento.validate()) {
                return
            }
            this.setPreload(true);
            const data = {
                nombre_evento: this.formEvento.nombre_evento,
                rango_edad_inicio: this.formEvento.rango_edad_inicio,
                rango_edad_final: this.formEvento.rango_edad_final,
                gestante: this.formEvento.gestante,
            }
            this.$axios.post('eventos-sivigila/crear-evento/', data)
                .then(() => {
                    this.$toast.success("¡Evento epidemiológico creado con éxito!");
                    this.$emit('eventoListarCrear');
                    this.cerrarFormulario();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al crear el evento epidemiológico. Por favor, intente nuevamente.")
                })
                .finally(() => {
                    this.setPreload(false);
                })
        },

        limpiarCampos() {
            this.formEvento = {
                nombre_evento: null,
                rango_edad_inicio: null,
                rango_edad_final: null,
                gestante: null,
            }
        },

        cerrarFormulario() {
            this.$emit("update:mostrarFormularioEvento", false);
            this.limpiarCampos();
        },
    }
}
</script>
