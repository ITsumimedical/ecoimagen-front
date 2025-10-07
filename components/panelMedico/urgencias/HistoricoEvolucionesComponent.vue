<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Evoluciones</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text>
                <v-data-table :headers="headers" :items="admisionesUrgencias" :items-per-page="10" disable-pagination hide-default-footer
                    no-data-text="Aún no hay registros de citas no programadas">
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="success" v-on="on" v-bind="attrs" @click="abrirDialogo(item)">
                                    <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="info" v-on="on" v-bind="attrs" @click="print(item)">
                                    <v-icon>mdi-clipboard-text</v-icon>
                                </v-btn>
                            </template>
                            <span>Certificado</span>
                        </v-tooltip>

                    </template>
                </v-data-table>
            </v-card-text>

             <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small dark @click="limpiarEvolucion()">Cerrar</v-btn>
            </v-card-actions>

            <v-dialog v-model="dialogoCrear" persistent width="900" v-if="dialogoCrear">
                <v-card>
                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                        <b>Evolucion</b></v-alert>
                    <v-card-text>

                        <v-form ref="evolucion">
                            <v-row>
                                <v-col cols="12" md="12" sm="12">
                                    <p outlined><b>Subjetivos: </b>{{datosAdmision.subjetivo}}
                                    </p>
                                    <p outlined><b>Descripción Fisica:
                                        </b>{{datosAdmision.descripcion_fisica}}
                                    </p>
                                    <p outlined><b>Paraclinicos:
                                        </b>{{datosAdmision.paraclinicos}}
                                    </p>
                                    <p outlined><b>Procedimientos:
                                        </b>{{datosAdmision.procedimiento}}
                                    </p>
                                    <p outlined><b>Analisis:
                                        </b>{{datosAdmision.analisis}}
                                    </p>
                                    <p outlined><b>Tratamiento:
                                        </b>{{datosAdmision.tratamiento}}
                                    </p>

                                </v-col>
                                <v-col cols="12" md="1" sm="12">
                                    <small><b>Peso:
                                        </b>{{datosAdmision.peso}}
                                    </small>
                                </v-col>
                                <v-col cols="12" md="3" sm="12">
                                    <small><b>Tension arterial:
                                        </b>{{datosAdmision.tension_arterial}}
                                    </small>
                                </v-col>
                                <v-col cols="12" md="3" sm="12">
                                    <small outlined><b>Frecuencia respiratoria:
                                        </b>{{datosAdmision.frecuencia_respiratoria}}
                                    </small>
                                </v-col>
                                <v-col cols="12" md="3" sm="12">
                                    <small outlined><b>Frecuencia cardiaca:
                                        </b>{{datosAdmision.frecuencia_cardiaca}}
                                    </small>
                                </v-col>
                                <v-col cols="12" md="2" sm="12">
                                    <small outlined><b>Temperatura:
                                        </b>{{datosAdmision.temperatura}}
                                    </small>
                                </v-col>

                                <v-col cols="12" sm="12" md="12">
                                    <v-data-table :headers="headersCie10" :items="listaHistorico" hide-default-footer
                                        :items-per-page="5" class="elevation-1" dense disable-pagination>
                                        <template v-slot:[`item.esprimario`]="{ item }">
                                            <v-chip v-if="item.esprimario" color="success" dark small>SI</v-chip>
                                            <v-chip v-else color="error" dark small>NO</v-chip>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small dark @click="dialogoCrear=false,datosAdmision={},listaHistorico=[]">Cerrar</v-btn>
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
            datos: Object
        },
        name: 'triage',
        data() {
            return {
                preload: false,
                headers: [{
                        text: 'Id',
                        value: 'id'
                    },
                    {
                        text: 'Analisis',
                        value: 'analisis'
                    },
                    {
                        text: 'Descripcion fisica',
                        value: 'descripcion_fisica'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    },
                ],
                headersCie10: [{
                        text: 'Diagnóstico',
                        value: 'cie10.Codigo_Nombre'
                    },
                    {
                        text: 'Tipo',
                        value: 'tipo_diagnostico'
                    },
                    {
                        text: 'Primario',
                        value: 'esprimario'
                    },
                ],
                dialogoCrear: false,
                datosAdmision: {},
                admisionesUrgencias: [],
                cedula_paciente: '',
                listaHistorico: []
            }
        },
        mounted() {
            this.admisionesUrgencias = this.datos.evolucion
        },

        watch: {
            //  ejecutar: {
            //     handler(valor) {
            //         if (valor) {
            //             this.cedula_paciente = ''
            //             this.admisionesUrgencias = []
            //         }
            //     },
            //     immediate: true

            // }
        },

        methods: {
            ...mapActions('app', ['setPreload']),


            async print(pdf) {
                this.setPreload(true)
                await this.$axios.post('pdf', {
                    consulta: pdf.consulta_id,
                    tipo: 'Evolucion'
                }, {
                    responseType: "arraybuffer"
                }).then(res => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf"
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                    this.setPreload(false)
                }).catch(err => {
                    this.setPreload(false);
                })
            },


            abrirDialogo(item) {
                console.log('s', item);
                this.datosAdmision = item
                this.listarHistorico()
                this.dialogoCrear = true
            },

            listarHistorico() {
                this.setPreload(true)
                this.$axios.post("/historia/listarCie10Historico", {
                    consulta: this.datosAdmision.consulta_id
                }).then((res) => {
                    this.listaHistorico = res.data;
                }).catch((err) => {
                    return this.$toast.error("Error al listar antecedentes personales");
                }).finally(() => {
                    this.setPreload(false)
                })
            },

            limpiarEvolucion(){
                this.admisionesUrgencias=[]
                this.$emit('cerrar')
            }
        }
    }

</script>
