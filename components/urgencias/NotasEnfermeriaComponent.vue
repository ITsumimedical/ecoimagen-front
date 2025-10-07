<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Notas de enfermeria</b></v-alert>
            <v-divider></v-divider>
            <v-card-title v-if="crear">
                <v-toolbar flat>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="success" small class="mb-2 white--text" @click="abrirModalCrear()">
                        Crear
                        <v-icon dark right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="headers" :items="notasEnfermeria" no-data-text="No hay camas para mostrar" dense
                              hide-default-footer disable-pagination>
                    <!-- <template v-slot:top>
                        <v-row class="mx-2">
                            <v-col md="5" lg="5" xl="5" sm="6" cols>
                                <v-text-field dense v-model="campoBusqueda" label="Buscar ...">
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </template> -->
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div class="text-center">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="abrirModalEditar(item)">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn icon color="green" v-on="on"
                                        @click="imprimir(item)">

                                        <v-icon>mdi-file-download</v-icon>
                                    </v-btn>
                                </template>
                                <span>Imprimir orden</span>
                            </v-tooltip>
                        </div>
                    </template>
                    <template v-slot:[`item.enfermero`]="{ item }">
                        <p>{{ item.usuario.operador.nombre }} {{ item.usuario.operador.apellido }}</p>
                    </template>

                </v-data-table>
            </v-card-text>

            <v-card-actions v-if="!crear">
                <v-spacer></v-spacer>
                <v-btn small color="red" dark @click="$emit('cerrar')">Cerrar</v-btn>
            </v-card-actions>

            <v-dialog v-model="dialogCrearEditar" persistent max-width="900px">
                <v-card>
                    <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                        <b>{{ editMode ? "Editar" : "Crear" }} Nota de enfermeria</b>
                    </v-alert>
                    <v-card-text>
                        <v-form ref="camaForm">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field type="datetime-local" dense v-model="form.fecha" outlined
                                                  label="Fecha y hora" :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field dense v-model="form.peso" label="Peso" type="number" outlined
                                                  :rules="rules.peso">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense outlined label="Presión sistólica"
                                                  v-model="form.presion_sistolica" type="number"
                                                  :rules="rules.presion_sistolica"
                                                  @input="calcularTensionArterial"/>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field dense outlined label="Presión diastólica"
                                                  v-model="form.presion_diastolica" type="number"
                                                  :rules="rules.presion_diastolica" @input="calcularTensionArterial"/>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.tension_arterial" outlined
                                                  label="Tension arterial" :rules="rules.tension_arterial">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.frecuencia_respiratoria" outlined
                                                  label="Frecuencia respiratoria"
                                                  :rules="rules.frecuencia_respiratoria">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.frecuencia_cardiaca" outlined
                                                  label="Frecuencia cardiaca" :rules="rules.frecuencia_cardiaca">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.temperatura" outlined label="Temperatura"
                                                  :rules="rules.temperatura">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.saturacion_oxigeno" outlined
                                                  label="Saturacion oxigeno" :rules="rules.saturacion_oxigeno">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.glucometria" outlined label="Glucometria">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.tam" outlined label="TAM">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-textarea dense v-model="form.observacion" outlined
                                                label="Nota diaria del paciente" :rules="rules.observacion">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="dialogCrearEditar = false">Cerrar</v-btn>
                        <v-btn small color="success" dark @click="guardarNota()">
                            {{ editMode ? "Guardar Cambios" : "Crear" }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>
import {
    mapActions
} from "vuex";

export default {
    props: {
        ejecutar: {
            type: Boolean,
            default: false,
        },
        datos: Object,
        crear: Boolean
    },
    name: 'triage',
    data() {
        return {
            campoBusqueda: '',
            preload: false,
            headers: [{
                text: 'Id',
                value: 'id'
            },
                {
                    text: 'Fecha',
                    value: 'fecha'
                },
                {
                    text: 'Resumen',
                    value: 'observacion'
                },
                {
                    text: 'Enfermera(o)',
                    value: 'enfermero'
                },
                {
                    text: 'Acciones',
                    value: 'acciones'
                },
            ],
            rules: {
                fecha: [(v) => !!v || "El campo fecha es requerido"],
                peso: [(v) => !!v || "El campo peso es requerido"],
                tension_arterial: [(v) => !!v || "El campo tension arterial es requerido"],
                frecuencia_respiratoria: [(v) => !!v || "El campo frecuencia respiratoria es requerido"],
                frecuencia_cardiaca: [(v) => !!v || "El campo frecuencia cardiaca es requerido"],
                temperatura: [(v) => !!v || "El campo temperatura es requerido"],
                saturacion_oxigeno: [(v) => !!v || "El campo saturacion es requerido"],
                observacion: [(v) => !!v || "El campo observacion es requerido"],
                presion_sistolica: [(v) => !!v || "El campo presion sistólica es requerido"],
                presion_diastolica: [(v) => !!v || "El campo presion diastólica es requerido"],
            },
            dialogCrearEditar: false,
            notasEnfermeria: [],
            editMode: false,
            form: {}
        }
    },
    mounted() {
        this.formatearDatos()
        this.listarNotas()
    },

    watch: {
        //  ejecutar: {
        //     handler(valor) {
        //         if (valor) {
        //             this.cedula_paciente = ''
        //             this.notasEnfermeria = []
        //         }
        //     },
        //     immediate: true

        // }
    },

    methods: {
        ...mapActions('app', ['setPreload']),


        async listarNotas() {
            try {
                this.setPreload(true)
                const response = await this.$axios.post(`/nota-enfermeria-urgencias/listarNota`, {admision_urgencia_id: this.datos.admision_urgencia_id})
                this.notasEnfermeria = response.data;
            } catch (error) {
                console.log(error)
            } finally {
                this.setPreload(false)
            }
        },

        abrirModalCrear() {
            this.dialogCrearEditar = true;
            this.editMode = false;
            this.cama = {
                nombre: ""
            };
        },


        cancelarCrearEditar() {
            this.dialogCrearEditar = false;
            this.form.observacion = ''
        },

        guardarNota() {
            if (!this.$refs.camaForm.validate()) {
                return
            }
            if (this.editMode) {
                this.setPreload(true)
                this.$axios
                    .put(`/nota-enfermeria-urgencias/${this.form.id}`, this.form)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se actualizó la nota correctamente");
                        this.listarNotas();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al actualizar la nota");
                        console.log(error);
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
            } else {
                this.setPreload(true)
                this.form.admision_urgencia_id = this.datos.admision_urgencia_id
                this.$axios.post(`/nota-enfermeria-urgencias/crear`, this.form)
                    .then((res) => {
                        this.cancelarCrearEditar();
                        this.$toast.success("Se creó la nota correctamente");
                        this.listarNotas();
                    })
                    .catch((error) => {
                        this.$toast.error("Ocurrió un error al crear la cama");
                        console.log(error);
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
            }


        },

        formatearDatos() {
            this.form.peso = this.datos.admision_urgencia.consulta.historia_clinica.peso
            this.form.tension_arterial = this.datos.admision_urgencia.consulta.historia_clinica
                .presion_arterial_media
            this.form.frecuencia_respiratoria = this.datos.admision_urgencia.consulta.historia_clinica
                .frecuencia_respiratoria
            this.form.frecuencia_cardiaca = this.datos.admision_urgencia.consulta.historia_clinica
                .frecuencia_cardiaca
            this.form.temperatura = this.datos.admision_urgencia.consulta.historia_clinica.temperatura
            this.form.saturacion_oxigeno = this.datos.admision_urgencia.consulta.historia_clinica.saturacion_oxigeno
        },

             abrirModalEditar(item) {
                this.dialogCrearEditar = true;
                this.editMode = true;
                this.form = {
                    ...item
                };
            },

            async imprimir(item) {
                const request = {
                    id: item.id,
                    tipo: 'notaEnfermeriaUrgencias',
                }
                this.setPreload(true);
                try {
                    const res = await this.$axios.post('/pdf', request, { responseType: 'arraybuffer' });
                    const blob = new Blob([res.data], {
                    type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                    link.remove(link);
                } catch (error) {
                    this.$toast.error('Error al imprimir la nota aclaratoria');
                    console.error(error);
                } finally {
                    this.setPreload(false);
                }
            },

        calcularTensionArterial() {
            const ps = parseFloat(this.form.presion_sistolica);
            const pd = parseFloat(this.form.presion_diastolica);

            if (!isNaN(ps) && !isNaN(pd)) {
                const pam = ((ps + (2 * pd)) / 3).toFixed(1);
                this.form.tension_arterial = pam;
            } else {
                this.form.tension_arterial = '';
            }
        }
    }
}

</script>
