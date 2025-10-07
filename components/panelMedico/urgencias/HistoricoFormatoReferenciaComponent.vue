<template>
    <div>
        <v-card>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Tranquilo procesamos tu solicitud !
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>

            <v-divider></v-divider>
             <v-card-text>
                <v-row>
                   <v-col cols="12" sm="12" md="4">
                            <v-text-field v-model.trim="cedula_paciente" label="Número de Documento" >
                            </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" small dark @click="cedula_paciente='',admisionesUrgencias=[]">limpiar</v-btn>
				<v-btn color="info" small dark @click="listarAdmisionesUrgencias()">Buscar</v-btn>
            </v-card-actions>
            <v-data-table :headers="headers" :items="admisionesUrgencias" :items-per-page="10"
                no-data-text="Aún no hay registros de citas no programadas">

                <template v-slot:[`item.triage`]="{ item }">
                    <v-chip small :color="colorTriage(item.consulta)" dark>
                        {{ item.consulta?.historia_clinica?.triage ?? 'Sin evaluar' }}
                    </v-chip>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon small color="success" class="mr-2" v-bind="attrs" v-on="on"
                                @click="abrirDialogo(item)">
                                mdi-account-check
                            </v-icon>
                        </template>
                        <span>Registrar Epicrisis</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small color="info" v-on="on" v-bind="attrs" @click="printCertificado(item)">
                                <v-icon>mdi-clipboard-text</v-icon>
                            </v-btn>
                        </template>
                        <span>Certificado</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small color="warning" v-on="on" v-bind="attrs" @click="printHistoria(item)">
                                <v-icon>mdi-printer</v-icon>
                            </v-btn>
                        </template>
                        <span>Imprimir historia</span>
                    </v-tooltip>
                </template>
            </v-data-table>

            <v-dialog v-model="dialogoCrear" persistent width="1150" v-if="dialogoCrear">
                <v-card>

                    <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                        <b>Formato de referencia</b></v-alert>
                    <v-card-text>

                        <v-form ref="evolucion">
                            <v-row>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea label="Objeto de la remisión" v-model="formulario.objeto_remision"
                                        outlined>
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field type="datetime-local" v-model="formulario.fecha_referencia" outlined
                                        label="Fecha y hora"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="formulario.entidadRemision" label="Entidad a donde se remite"
                                        dense outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field v-model="formulario.servicio_remision" outlined
                                        label="Remitido al servicio de"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field v-model="formulario.otro_servicio" outlined label="Otro servicio">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Peso" v-model="formulario.peso" outlined type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Talla" v-model="formulario.talla" outlined type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Tension arterial" v-model="formulario.tension_arterial"
                                        type="number" outlined>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Frecuencia respiratoria"
                                        v-model="formulario.frecuencia_respiratoria" outlined type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Frecuencia cardiaca" v-model="formulario.frecuencia_cardiaca"
                                        outlined type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field label="Temperatura" v-model="formulario.temperatura" outlined
                                        type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea label="Aspecto general" v-model="formulario.aspecto_general" outlined
                                        auto-grow>
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">

                                    <v-radio-group v-model="formulario.cabeza" row>
                                        <template v-slot:label>
                                            <div><strong>Cabeza</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.abdomen" row>
                                        <template v-slot:label>
                                            <div><strong>Abdomen</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">

                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.cuello" row>
                                        <template v-slot:label>
                                            <div><strong>Cuello</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.torax" row>
                                        <template v-slot:label>
                                            <div><strong>Torax</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.snp" row>
                                        <template v-slot:label>
                                            <div><strong>S.N.P</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.ojos" row>
                                        <template v-slot:label>
                                            <div><strong>Ojos</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.respiratorio" row>
                                        <template v-slot:label>
                                            <div><strong>Respiratorio</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.extremidad_superior" row>
                                        <template v-slot:label>
                                            <div><strong>Extremidades Sup</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.oidos" row>
                                        <template v-slot:label>
                                            <div><strong>Oidos</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.gastrointestinal" row>
                                        <template v-slot:label>
                                            <div><strong>Gastrointestinales</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.extremidad_inferior" row>
                                        <template v-slot:label>
                                            <div><strong>Extremidades inf</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.boca_garganta" row>
                                        <template v-slot:label>
                                            <div><strong>Boca y garganta</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.linfatico" row>
                                        <template v-slot:label>
                                            <div><strong>Linfático</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.funcion_cerebral" row>
                                        <template v-slot:label>
                                            <div><strong>Funciones cerebrales</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.piel_mucosa" row>
                                        <template v-slot:label>
                                            <div><strong>Piel y mucosa</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.psicomotor" row>
                                        <template v-slot:label>
                                            <div><strong>Desarrollo psicomotor</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.reflejos" row>
                                        <template v-slot:label>
                                            <div><strong>Reflejos</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.urogenital" row>
                                        <template v-slot:label>
                                            <div><strong>Urogenital</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-radio-group v-model="formulario.snc" row>
                                        <template v-slot:label>
                                            <div><strong>S.N.C</strong></div>
                                        </template>
                                        <v-radio label="Normal" value="Normal"></v-radio>
                                        <v-radio label="Anormal" value="Anormal">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea label="Anormalidades evolución anterior"
                                        v-model="formulario.evolucion_anterior" outlined auto-grow>
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea label="Impresión diagnostica" v-model="formulario.impresion_diagnostica"
                                        outlined auto-grow>
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-textarea label="Plan" v-model="formulario.plan" outlined auto-grow>
                                    </v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" small dark @click="dialogoCrear=false">Cerrar</v-btn>
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
        },
        name: 'triage',
        data() {
            return {
                preload: false,
                headers: [{
                        text: 'Paciente',
                        value: 'nombrepaciente'
                    },
                    {
                        text: 'Documento',
                        value: 'numero_documento'
                    },
                    {
                        text: 'Contrato',
                        value: 'nombrecontrato'
                    },
                    {
                        text: 'Triage',
                        value: 'triage'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    },
                ],
                formulario: {
                    principal: '',
                    motivo_salida: '',
                    estado_salida: '',
                    fecha_deceso: '',
                    certificado_defuncion: '',
                    causa_muerte: '',
                    fecha_egreso: '',
                    orden_alta: '',
                    observacion: '',
                    cie10: ''
                },
                dialogoCrear: false,
                datosAdmision: {},
                admisionesUrgencias: [],
                 cedula_paciente:''
            }
        },
        mounted() {

        },

        watch: {
            ejecutar: {
                handler(valor) {
                    if (valor) {
                        this.cedula_paciente = ''
                        this.admisionesUrgencias = []
                    }
                },
                immediate: true

            }
        },

        methods: {
            ...mapActions('app', ['setPreload']),

            listarAdmisionesUrgencias() {
                this.preload = true
                this.$axios.post('epicrisis/listarHistoricoReferencia',{documento:this.cedula_paciente}).then(res => {
                    this.preload = false
                    this.admisionesUrgencias = res.data;
                    // this.tableKey++;
                }).catch(e => {
                    console.log(e);
                    this.preload = false
                })
            },

            colorTriage(item) {
                if (item) {
                    if (item.historia_clinica) {
                        if (item.historia_clinica.triage == 'TRIAGE I') {
                            return 'error white--text';
                        } else if (item.historia_clinica.triage == 'TRIAGE II') {
                            return 'warning white--text';
                        } else if (item.historia_clinica.triage == 'TRIAGE III') {
                            return 'yellow black--text';
                        } else if (item.historia_clinica.triage == 'TRIAGE IV') {
                            return 'success white--text';
                        } else if (item.historia_clinica.triage == 'TRIAGE V') {
                            return 'primary white--text';
                        }
                    } else {
                        return 'gray white--text';
                    }

                }
            },

            colorEstadoTriage(item) {
                if (item == 1) {
                    return 'success white--text';
                } else if (item == 9) {
                    return 'error white--text';
                } else if (item == 7) {
                    return 'warning white--text';
                }
            },

            async print(pdf) {
                this.setPreload(true)
                await this.$axios.post('pdf', {
                    consulta: pdf.consulta.id,
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

            async printCertificado(pdf) {
                this.setPreload(true)
                await this.$axios.post('pdf', {
                    epicrisis: pdf.idEpicrisis,
                    tipo: 'CertificadoFormatoReferencia',
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
                this.formulario = item
                this.dialogoCrear = true
            },


            async printHistoria(pdf) {
                this.setPreload(true)
                await this.$axios.post('pdf', {
                    consulta: pdf.consulta.id,
                    tipo: 'historia',
                    correo: null
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



        }
    }

</script>
