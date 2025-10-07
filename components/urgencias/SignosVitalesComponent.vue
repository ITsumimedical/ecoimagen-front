<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Signos vitales</b></v-alert>
            <v-divider></v-divider>
            <v-card-title v-if="crear">
                <v-toolbar flat>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn  color="success" small class="mb-2 white--text" @click="abrirModalCrear()">
                        Crear
                        <v-icon dark right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-data-table :headers="headers" :items="signosVitales" no-data-text="No hay signos vitales para mostrar"
                    dense hide-default-footer disable-pagination>
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
                        <p>{{item.usuario.operador.nombre}} {{item.usuario.operador.apellido}}</p>
                    </template>
                    <template v-slot:[`item.fecha`]="{ item }">
                        {{ $moment(item.fecha).format("YYYY-MM-DD ") }}
                    </template>
                    <template v-slot:[`item.hora`]="{ item }">
                        {{ $moment(item.fecha).format("HH:mm:ss") }}
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
                        <b>{{ editMode ? "Editar" : "Crear" }} Signos vitales</b>
                    </v-alert>
                    <v-card-text>
                        <v-form ref="camaForm">
                            <v-row dense>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field type="datetime-local" v-model="form.fecha" outlined
                                        label="Fecha y hora" :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.peso" label="Peso" type="number" outlined
                                        :rules="rules.peso">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.tension_arterial" outlined
                                        label="Tension arterial" :rules="rules.tension_arterial">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <v-text-field dense v-model="form.frecuencia_respiratoria" outlined
                                        label="Frecuencia respiratoria" :rules="rules.frecuencia_respiratoria">
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
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="dialogCrearEditar=false">Cerrar</v-btn>
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
            crear:Boolean
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
                        text: 'Hora',
                        value: 'hora'
                    },
                    {
                        text: 'Temperatura',
                        value: 'temperatura'
                    },
                     {
                        text: 'FC',
                        value: 'frecuencia_cardiaca'
                    },
                    {
                        text: 'FR',
                        value: 'frecuencia_respiratoria'
                    },
                    {
                        text: 'T/A',
                        value: 'tension_arterial'
                    },
                    {
                        text: 'TAM',
                        value: 'tam'
                    },
                     {
                        text: 'PESO',
                        value: 'peso'
                    },
                     {
                        text: 'Saturacion oxigeno',
                        value: 'saturacion_oxigeno'
                    },
                     {
                        text: 'Glucometria',
                        value: 'glucometria'
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
                },
                dialogCrearEditar: false,
                signosVitales: [],
                editMode: false,
                form: {
                    fecha: this.$moment().format("YYYY-MM-DDTHH:mm")
                }
            }
        },
        mounted() {
            this.formatearDatos()
            this.listarSignosVitales()
        },

        watch: {
            //  ejecutar: {
            //     handler(valor) {
            //         if (valor) {
            //             this.cedula_paciente = ''
            //             this.signosVitales = []
            //         }
            //     },
            //     immediate: true

            // }
        },

        methods: {
            ...mapActions('app', ['setPreload']),


            async listarSignosVitales() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.post(`/signos-vitales/listarSignosVitales`,{admision_urgencia_id:this.datos.admision_urgencia_id})
                    this.signosVitales = response.data;
                } catch (error) {
                    console.log(error)
                } finally {
                    this.setPreload(false)
                }
            },

            abrirModalCrear() {
                this.dialogCrearEditar = true;
                this.editMode = false;
            },


            cancelarCrearEditar() {
                this.dialogCrearEditar = false;
            },

            guardarNota() {
                if (!this.$refs.camaForm.validate()) {
                    return
                }
                if (this.editMode) {
                    this.setPreload(true)
                    this.$axios
                        .put(`/signos-vitales/${this.form.id}`, this.form)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se ha actualizado el signo vital correctamente")
                            this.listarSignosVitales();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al crear el signo vital");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                } else {
                    this.setPreload(true)
                    this.form.admision_urgencia_id = this.datos.admision_urgencia_id
                    this.$axios.post(`/signos-vitales/crear`, this.form)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se creó el signo vital correctamente");
                            this.listarSignosVitales();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al crear el signo vital");
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
                        tipo: 'signosVitales',
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
                        this.$toast.error('Error al imprimir el signo vital');
                        console.error(error);
                    } finally {
                        this.setPreload(false);
                    }
            },
        }
    }

</script>
