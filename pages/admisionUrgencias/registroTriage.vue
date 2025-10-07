<template>
    <div>
        <v-card elevation="0">
            <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                <b>Validación de derechos</b></v-alert>
            <v-card-text>
                <v-row>
                    <!-- <pre>{{infoAfiliado.entidad_id}}</pre> -->
                    <v-col cols="12" md="12" sm="12">
                        <v-autocomplete dense outlined label="Contrato" :items="contratos"
                            no-data-text="No hay resultados" item-value="id"
                            :item-text="(item) => `${item.entidad.nombre} - ${item.ambito.nombre} - ${item.prestador.nombre_prestador}`"
                            v-model="triage.contrato_id"  :error-messages="errors.contrato_id"/>
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-text-field dense outlined label="Causa externa" v-model.trim="triage.causa_externa" :error-messages="errors.causa_externa"/>
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-autocomplete dense outlined label="Vía Ingreso" :items="viasIngreso"
                            no-data-text="No hay resultados" v-model="triage.via_ingreso"
                            :error-messages="errors.via_ingreso" />
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-autocomplete dense outlined label="Especialidad" :items="especialidades"
                            no-data-text="No hay resultados" v-model="triage.especialidad" :error-messages="errors.especialidad"/>
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-text-field dense outlined label="Nombre Acompañante"
                            v-model.trim="triage.nombre_acompanante" />
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-text-field dense outlined label="Teléfono Acompañante"
                            v-model.trim="triage.telefono_acompanante" type="number" />
                    </v-col>
                    <v-col cols="4" md="4" sm="4">
                        <v-text-field dense outlined label="Dirección Acompañante"
                            v-model.trim="triage.direccion_acompanante" />
                    </v-col>
                    <v-col cols="12" md="12" sm="12">
                        <v-textarea dense outlined label="Observación" v-model.trim="triage.observacion" :error-messages="errors.observacion" />
                    </v-col>
                    <v-col cols="12" sm="12" md="9">
                        <v-file-input accept=".pdf, .docx, .xlsx, .jpeg, .jpg, .png" v-model="triage.adjuntoDocumento"
                            color="titulo" counter label="Seleccione el documento de identificación" multiple
                            placeholder="Seleccione el  documento de identificación" prepend-icon="mdi-paperclip" outlined dense
                            :show-size="1000">
                            <template v-slot:selection="{ index, text }">
                                <v-chip v-if="index < 2" color="titulo black--text" dark label small>
                                    {{ text }}
                                </v-chip>

                                <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">
                                    +{{ files.length - 2 }} File(s)
                                </span>
                            </template>
                        </v-file-input>
                    </v-col>
                    <!-- <v-col cols="12" md="12" sm="12">

        </v-col> -->
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" small dark @click="guardarTriage">Guardar triage</v-btn>
            </v-card-actions>

        </v-card>
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Procesando Información
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoFirma" persistent width="550">
            <v-card>
                <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                    <b>Firma atención y anexos</b></v-alert>
                <v-expansion-panels focusable>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3 class="text-center">Firma afiliado</h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-col cols="12" sm="12" md="12">
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="firma mb-5">
                                            <h4 class="ml-3">Firma</h4>
                                            <vueSignature ref="signature" :sigOption="option" :w="'400'"></vueSignature>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn small color="warning" @click="clear">Limpiar</v-btn>
                                                <v-btn small color="info" @click="undo">Deshacer</v-btn>
                                                <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn>
                                                <v-btn small color="success" @click="save">Guardar</v-btn>
                                            </v-card-actions>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            <h3 class="text-center">Firma Acompañante</h3>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-col cols="12" sm="12" md="12">
                                <v-row dense>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="firma mb-5">
                                            <h4 class="ml-3">Firma</h4>
                                            <vueSignature ref="signature2" :sigOption="option" :w="'400'">
                                            </vueSignature>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn small color="warning" @click="clear2">Limpiar</v-btn>
                                                <v-btn small color="info" @click="undo2">Deshacer</v-btn>
                                                <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn>
                                                <v-btn small color="success" @click="save2">Guardar</v-btn>
                                            </v-card-actions>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small dark @click="dialogoFirma=false, clear,clear2">Cancelar</v-btn>
                    <!-- <v-btn color="success" small dark @click="dialogoFirma=false, clear,clear2,dialogoAnexo=true">Registrar Anexo</v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import vueSignature from "vue-signature";
    import registroReferencia from "@/pages/referencia/referenciaUrgencia.vue";
    export default {
        components: {
            vueSignature,
            registroReferencia
        },
        middleware({
            $can,
            redirect
        }) {
            if (!$can('panelmedico.atenciones')) {
                return redirect('/');
            }
        },

        name: 'registroTriage',
        props: {
            ejecutar: Boolean,
            infoAfiliado: Object,
        },
        data: () => ({
            option: {
                penColor: "rgb(0, 0, 0)",
                backgroundColor: "rgb(255,255,255)",
            },
            preload: false,
            triage: {
                contrato_id: '',
                causa_externa: '',
                via_ingreso: '',
                nombre_acompanante: '',
                telefono_acompaante: '',
                direccion_acompanante: '',
                observacion: '',
                adjuntoDocumento: [],
                especialidad:''
            },
            contratos: [],
            viasIngreso: [
                'Procedimientos menores',
                'Endoscopia - Colonoscopia',
                'Urgencia',
                'Cirugías',
            ],
            dialogoFirma: false,
            dataAdmision: {},
            dialogoAnexo: false,
            especialidades: [
                "ALERGOLOGIA",
                "ANESTESIOLOGIA",
                "AUDIOLOGIA",
                "BIOENERGETICA",
                "CARDIOLOGIA",
                "CIRUGIA BARIATRICA",
                "CIRUGIA CARDIOVASCULAR",
                "CIRUGIA GENERAL",
                "CIRUGIA MAXILOFACIAL",
                "CIRUGIA PLASTICA",
                "COLOPROCTOLOGIA",
                "COORDINACION MEDICA",
                "DERMATOLOGIA",
                "ENDOCRINOLOGIA",
                "GINECOLOGIA Y OBSTETRICIA",
                "HEMATOLOGIA",
                "INFECTOLOGIA",
                "MASTOLOGIA",
                "MEDICINA DEL DEPORTE",
                "MEDICINA DEL DOLOR",
                "MEDICINA DEL TRABAJO",
                "MEDICINA FAMILIAR",
                "MEDICINA FISICA Y REHABILITACION",
                "MEDICINA GENERAL",
                "MEDICINA INTERNA",
                "NEFROLOGIA",
                "NEUMOLOGIA",
                "NEUROCIRUGIA",
                "NEUROLOGIA",
                "ODONTOLOGIA",
                "OFTALMOLOGIA",
                "ONCOLOGIA CLINICA",
                "ORTOPEDIA Y TRAUMATOLOGIA",
                "OTORRINOLARINGOLOGIA",
                "PEDIATRIA",
                "PSIQUIATRIA",
                "REUMATOLOGIA",
                "SALUD FAMILIAR",
                "TOXICOLOGIA CLINICA",
                "UROLOGIA",
            ],
            errors: {
                contrato_id: '',
                causa_externa: '',
                via_ingreso: '',
                nombre_acompanante: '',
                telefono_acompaante: '',
                direccion_acompanante: '',
                observacion: '',
                especialidad:'',
                adjuntoDocumento: []
            },
        }),

        methods: {
            listarContratos() {
                this.preload = true
			this.$axios.post('contrato/allContrato/')
                    .then((res) => {
                        this.contratos = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error('Ocurrió un error al cargar las sedes');
                        console.log(error);
                    }).finally(() => {
                        this.preload = false;
                    });


            //     this.preload = true
			// this.$axios.get('contrato/listar-por-prestador/'+61621)
            //         .then((res) => {
            //             this.contratos = res.data;
            //         })
            //         .catch((error) => {
            //             this.$toast.error('Ocurrió un error al cargar las sedes');
            //             console.log(error);
            //         }).finally(() => {
            //             this.preload = false;
            //         });



            },

            guardarTriage() {

                let formdata = new FormData();
                formdata.append("user_id", this.$store.state.auth.usuario.id);
                formdata.append("fecha_salida", new Date().toISOString().split('T')[0]);
                formdata.append("afiliado_id", this.infoAfiliado.id);
                formdata.append("entidad_afiliado", this.infoAfiliado.entidad_id);
                formdata.append("estado_id", 1);
                formdata.append("estado_urgencia", 1);
                formdata.append("contrato_id", this.triage.contrato_id);
                formdata.append("causa_externa", this.triage.causa_externa);
                formdata.append("via_ingreso", this.triage.via_ingreso);
                formdata.append("nombre_acompanante", this.triage.nombre_acompanante);
                formdata.append("telefono_acompanante", this.triage.telefono_acompanante);
                formdata.append("direccion_acompanante", this.triage.direccion_acompanante);
                formdata.append("observacion", this.triage.observacion);
                formdata.append("especialidad", this.triage.especialidad);
                formdata.append(`adjuntoDocumento`, this.triage.adjuntoDocumento[0] || null);
                this.preload = true
                this.limpiarError()
                this.$axios.post('/admisiones/guardarAdmisionesUrgencias', formdata)
                    .then(res => {
                        this.$toast.success('Triage guardado exitosamente.');

                        this.triage = {
                            contrato_id: '',
                            causa_externa: '',
                            via_ingreso: '',
                            nombre_acompanante: '',
                            telefono_acompanante: '',
                            direccion_acompanante: '',
                            observacion: '',
                            especialidad: ''
                        };
                        this.dataAdmision = res.data
                        this.dialogoFirma = true
                    })
                    .catch((error) => {
                        this.$toast.error('Ocurrió un error al guardar el triage.');
                        this.ErrorEntrada(error.response.data.errors)
                        console.log(error);
                    }).finally(() => {
                        this.preload = false;
                    });
            },

            clear() {
                var _this = this;
                _this.$refs.signature.clear();
            },
            undo() {
                var _this = this;
                _this.$refs.signature.undo();
            },

            clear2() {
                var _this = this;
                _this.$refs.signature2.clear();
            },
            undo2() {
                var _this = this;
                _this.$refs.signature2.undo();
            },

            save() {
                if (this.$refs.signature.isEmpty()) {
                    this.$swal({
                        title: "¡Error!",
                        text: "Es necesaria la firma del paciente.",
                        type: "warning",
                    });
                    return
                }
                this.preload = true
                let formdata = new FormData();
                const firmaBase64 = this.$refs.signature.save();
                formdata.append("firma", firmaBase64);
                formdata.append("id", this.dataAdmision.id);

                this.$axios.post('admisiones/firmaAfiliado', formdata).then(res => {
                    this.clear()
                    this.preload = false
                }).catch(e => {
                    console.error('Error:', e);
                    this.preload = false
                });
            },

            save2() {
                if (this.$refs.signature2.isEmpty()) {
                    this.$swal({
                        title: "¡Error!",
                        text: "Es necesaria la firma del acompañante.",
                        type: "warning",
                    });
                    return
                }
                let formdata = new FormData();
                const firmaBase64 = this.$refs.signature2.save();
                formdata.append("firma", firmaBase64);
                formdata.append("id", this.dataAdmision.id);
                this.$axios.post('admisiones/firmaAcompañante', formdata).then(res => {
                    this.clear2()
                }).catch(e => {
                    console.error('Error:', e);
                });
            },

            cerrarDialogo() {
                this.dialogoFirma = false
                this.clear()
                this.clear2()
            },


            ErrorEntrada(errors) {
                for (const key in this.errors) {
                    if (key in errors) {
                        this.errors[key] = errors[key].join(',')
                    }
                }
            },

            limpiarError() {
                for (const key in this.errors) {
                    this.errors[key] = ''
                }
            },
        },

        mounted() {
            this.listarContratos();
        },
    };

</script>

<style scoped>
    .firma {
        border: 2.5px solid #78909C;
        border-radius: 5px;
    }

    .centrar {
        text-align: center;
    }

    p {
        text-align: justify;
    }

</style>
