<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Consentimientos informados</b></v-alert>
            <v-divider></v-divider>
            <!-- <v-card-title v-if="crear">
                <v-toolbar flat>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="success" small class="mb-2 white--text" @click="abrirModalCrear()">
                        Crear
                        <v-icon dark right>h
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card-title> -->

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete :items="tipo" v-model="form.tipo" label="Formato" outlined
                            @change="abrirModalCrear()">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text color="blue" class="text-center">
                            <b>Historico de formatos</b></v-alert>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table :headers="headers" :items="consentimientoInformado"
                            no-data-text="No hay signos vitales para mostrar" dense hide-default-footer
                            disable-pagination>
                            <template v-slot:[`item.enfermero`]="{ item }">
                                <p>{{item.usuario.operador.nombre}} {{item.usuario.operador.apellido}}</p>
                            </template>

                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="abrirModalEditar(item)">
                                            mdi-pencil
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                            </template>
                            <!--
                            <template v-slot:[`item.fecha`]="{ item }">
                                {{ $moment(item.fecha).format("YYYY-MM-DD ") }}
                            </template>
                            <template v-slot:[`item.hora`]="{ item }">
                                {{ $moment(item.fecha).format("HH:mm:ss") }}
                            </template> -->

                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-dialog v-model="dialogCrearEditar" persistent max-width="1300px">
                <v-card>
                    <v-alert dense text border="left" icon="mdi-file-edit-outline" type="info" color="info">
                        <b>{{ editMode ? "Editar" : "Crear" }} Consentimiento</b>
                    </v-alert>
                    <v-card-text>
                        <!-- <pre>{{datos.admision_urgencia.consulta.afiliado}}</pre> -->
                        <v-form ref="consentimientoInformadoForm">
                            <v-row dense v-if="form.tipo =='Consentimiento informado para procedemientos menores'">
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field type="date" v-model="form.fecha" outlined label="Fecha"
                                        :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6"></v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="form.servicio" outlined label="Servicio"
                                        :rules="rules.servicio">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="6"></v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <p><b>Nobres y apellidos:</b>
                                        {{datos.admision_urgencia.consulta.afiliado.primer_nombre}}
                                        {{datos.admision_urgencia.consulta.afiliado.primer_apellido}}</p>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <p><b>Tipo de documento:</b>
                                        {{datos.admision_urgencia.consulta.afiliado.tipo_documento.sigla}}</p>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <p><b>Número de documento:</b>
                                        {{datos.admision_urgencia.consulta.afiliado.numero_documento}}</p>
                                </v-col>
                                <v-col cols="12" md="8" sm="12">
                                    <h4>1.Procedimientos</h4>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.canalizacion" row>
                                        <template v-slot:label>
                                            <div><strong>Canalización de venas o inserción de dispositivos arteriales y
                                                    venosos</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">

                                    <v-radio-group v-model="form.terapias" row>
                                        <template v-slot:label>
                                            <div><strong>Terapias respiratorias</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">

                                    <v-radio-group v-model="form.toma_muestras" row>
                                        <template v-slot:label>
                                            <div><strong>Toma de muestras para exámenes de laboratorio</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">

                                    <v-radio-group v-model="form.aspiracion" row>
                                        <template v-slot:label>
                                            <div><strong>Aspiración de secreciones con sonda</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">

                                    <v-radio-group v-model="form.administracion_medicamento" row>
                                        <template v-slot:label>
                                            <div><strong>Administracion de medicamentos</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">

                                    <v-radio-group v-model="form.curaciones" row>
                                        <template v-slot:label>
                                            <div><strong>Curaciones</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.sonda_oro" row>
                                        <template v-slot:label>
                                            <div><strong>Sonda oro gástrica/nasogástrica</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.inmovilizacion" row>
                                        <template v-slot:label>
                                            <div><strong>Inmovilización terapéutica</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.cateterismo" row>
                                        <template v-slot:label>
                                            <div><strong>Cateterismo vesical</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.higiene_aseo" row>
                                        <template v-slot:label>
                                            <div><strong>Higiene y aseo</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.enemas" row>
                                        <template v-slot:label>
                                            <div><strong>Colocación de enemas rectales</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.traslados" row>
                                        <template v-slot:label>
                                            <div><strong>Traslados internos y externos</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-radio-group v-model="form.gases_arteriales" row>
                                        <template v-slot:label>
                                            <div><strong>Toma de gases arteriales</strong></div>
                                        </template>
                                        <v-radio label="Si" value="si"></v-radio>
                                        <v-radio label="No" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="6" sm="12">
                                    <v-text-field v-model="form.otro" outlined label="Otro, cuál">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <h4>2. Beneficios</h4>
                                    <h4>Los procedimientos mencionados forman parte integral del tratamiento y plan de
                                        manejo establecido por el médico</h4>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <h4>3. Riesgos y complicaciones</h4>
                                    <h4>-Durante y despúes de los procedimientos usted pude estar expuesto a:</h4>
                                    <h4>-Dolor local</h4>
                                    <h4>-Inflamación en sitios de punción</h4>
                                    <h4>-Lesión de piel y tejidos</h4>
                                    <h4>-Sangrado</h4>
                                    <h4>-Retiro accidental de dispositivos médicos</h4>
                                    <h4>-Alergias</h4>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <h4>4. Autorización del paciente,familiar, cuidador o representante legal</h4>
                                    <h5>Manifiesto que me han explicado la naturaleza y razones de los actos de cuidado
                                        de enfermeria, su importancia dentro del proceso de atención,sus
                                        beneficios,posibles riesgos y complicaciones, para que el equipo
                                        interdisciplinario de salud</h5>
                                    <h5>realice los actos de cuidado que mi condición requiera (ley 911 de 2004)
                                        responsabilidad del profesional de enfermeria en la practica titulo 3 capitulo
                                        1.</h5>
                                    <h5>En pleno uso de mis capacidades mentales autorizo al personal interdisciplinario
                                        de la salud de MEDICINA INTEGRAL S.A.S, para que me realicen los procedimientos
                                        necesarios que contribuyan al cuidado de mi salud, tambien me comprometo a
                                        cumplir las normas de seguridad institucional y autocuidado,manifiesto que en
                                        cualquier momento de mi proceso de atención puedo negarme a su realización.</h5>
                                </v-col>
                                <v-col cols="12" md="8" sm="12">
                                    <v-text-field dense v-model="form.confirmacion_paciente" outlined label="Yo"
                                        :rules="rules.confirmacion_paciente">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field dense v-model="form.confirmacion_documento" outlined
                                        label="Con documento de identidad" :rules="rules.confirmacion_documento">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-text-field dense v-model="form.certifico" outlined
                                        label="Certifico que he sido informado (a) con claridad y veracidad sobre el procedimiento a realizar">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-text-field dense v-model="form.doctor" outlined label="Por el Dr(a)"
                                        :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <v-radio-group v-model="form.acuerdo">
                                        <template v-slot:label>
                                            <div><strong>Del cual estoy de acuerdo y doy mi consentimiento para la
                                                    realización de esto con el fin de ayudar a mi pronta
                                                    recuperación</strong></div>
                                        </template>
                                        <v-radio label="Acepto los procedimientos" value="si"></v-radio>
                                        <v-radio label="No acepto los procedimientos" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="12" sm="12">
                                    <h4>RETIRO VOLUNTARIO</h4>
                                    <v-radio-group v-model="form.retiro">
                                        <template v-slot:label>
                                            <div><strong>Declaro que he sido debidamente informado(a) sobre los riesgos
                                                    y posibles complicaciones de salud que implica el retiro voluntario
                                                    de la institución MEDICINA INTEGRAL S.A.S bajo mi propia
                                                    responsabilidad decido abandonar o en consecuencia declaro que ni la
                                                    institución ni su personal serán responsables en caso de
                                                    complicaciones:</strong></div>
                                        </template>
                                        <v-radio label="Acepto el retiro" value="si"></v-radio>
                                        <v-radio label="No aplica" value="no">
                                        </v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col cols="12" md="4" sm="12">
                                    <v-text-field dense v-model="form.observacion" outlined label="Observaciones"
                                        :rules="rules.fecha">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <div class="firma mb-5">
                                        <h4 class="ml-3">Fima del paciente</h4>
                                        <vueSignature width="100%" height="200px" ref="firmaPaciente" />
                                        <v-btn text @click="limpiar()">Limpiar</v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="dialogCrearEditar=false">Cerrar</v-btn>
                        <v-btn small color="success" dark @click="guardar()">
                            {{ editMode ? "Guardar Cambios" : "Crear" }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>
<script>
    import vueSignature from "vue-signature";
    import {
        mapActions
    } from "vuex";

    export default {
        components: {
            vueSignature,
        },
        props: {
            ejecutar: {
                type: Boolean,
                default: false,
            },
            datos: Object,
        },
        name: 'triage',
        data() {
            return {
                campoBusqueda: '',
                preload: false,
                totalHoras: "",
                rules: {
                    fecha: [(v) => !!v || "El campo fecha es requerido"],
                    servicio: [(v) => !!v || "El campo servicio es requerido"],
                    certifico: [(v) => !!v || "El campo certifico es requerido"],
                    confirmacion_documento: [(v) => !!v || "El campo confirmacion documento es requerido"],
                    confirmacion_paciente: [(v) => !!v || "El campo confirmacion paciente es requerido"],
                },
                dialogCrearEditar: false,
                consentimientoInformado: [],
                editMode: false,
                form: {
                    fecha: this.$moment().format("YYYY-MM-DD")
                },
                tipo: ['Consentimiento informado para procedemientos menores',
                    'Consentimiento informado retiro voluntario', 'Consentimiento informado cirugia general'
                ],
                headers: [{
                        text: 'Id',
                        value: 'id'
                    },
                    {
                        text: 'Usuario registra',
                        value: 'enfermero'
                    },
                    {
                        text: 'Fecha de registro',
                        value: 'fecha'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    },

                ],
            }
        },
        mounted() {
            this.listarConsentimiento()
        },

        watch: {

        },

        methods: {
            ...mapActions('app', ['setPreload']),


            async listarConsentimiento() {
                try {
                    this.setPreload(true)
                    const response = await this.$axios.post(
                        `/consentimiento-informado-urgencias/listarConsentimiento`, {
                            admision_urgencia_id: this.datos.admision_urgencia_id
                        })
                    this.consentimientoInformado = response.data;
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
                this.form = {
                    fecha: this.$moment().format("YYYY-MM-DD"),
                    servicio: null,
                    canalizacion: null,
                    terapias: null,
                    toma_muestras: null,
                    aspiracion: null,
                    administracion_medicamento: null,
                    curaciones: null,
                    sonda_oro: null,
                    inmovilizacion: null,
                    cateterismo: null,
                    higiene_aseo: null,
                    enemas: null,
                    traslados: null,
                    gases_arteriales: null,
                    otro: null,
                    certifico: null,
                    doctor: null,
                    acuerdo: null,
                    retiro: null,
                    observacion: null,
                    admision_urgencia_id: ''
                }
                this.$refs.firmaPaciente.clear();
            },

            guardar() {

                if (this.editMode) {
                    if (!this.$refs.consentimientoInformadoForm.validate()) {
                        return
                    }
                    this.setPreload(true)
                    let firma = null
                   firma = this.$refs.firmaPaciente.isEmpty() ? this.form.firma_paciente : this.$refs.firmaPaciente.save();
                    const data = {
                        'tipo': this.form.tipo,
                        'fecha': this.form.fecha,
                        'servicio': this.form.servicio,
                        'canalizacion': this.form.canalizacion,
                        'terapias': this.form.terapias,
                        'toma_muestras': this.form.toma_muestras,
                        'aspiracion': this.form.aspiracion,
                        'administracion_medicamento': this.form.administracion_medicamento,
                        'curaciones': this.form.curaciones,
                        'sonda_oro': this.form.sonda_oro,
                        'inmovilizacion': this.form.inmovilizacion,
                        'cateterismo': this.form.cateterismo,
                        'higiene_aseo': this.form.higiene_aseo,
                        'enemas': this.form.enemas,
                        'traslados': this.form.traslados,
                        'gases_arteriales': this.form.gases_arteriales,
                        'otro': this.form.otro,
                        'confirmacion_documento': this.form.confirmacion_documento,
                        'confirmacion_paciente': this.form.confirmacion_paciente,
                        'certifico': this.form.certifico,
                        'doctor': this.form.doctor,
                        'acuerdo': this.form.acuerdo,
                        'retiro': this.form.retiro,
                        'observacion': this.form.observacion,
                        'firma_paciente': firma,
                        'admision_urgencia_id': this.datos.admision_urgencia_id
                    }
                    this.$axios
                        .put(`/consentimiento-informado-urgencias/${this.form.id}`, this.form)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se actualizó la cama correctamente");
                            this.listarConsentimiento();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al actualizar la cama");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                } else {
                    if (!this.$refs.consentimientoInformadoForm.validate()) {
                        return
                    }
                    if (this.$refs.firmaPaciente.isEmpty()) {
                        this.$swal({
                            title: "¡Error!",
                            text: "Es necesario firmar para guardar y autorizar el consentimiento informado.",
                            type: "warning",
                        });
                        return
                    }
                    this.setPreload(true)
                    const firma = this.$refs.firmaPaciente.save();
                    const data = {
                        'tipo': this.form.tipo,
                        'fecha': this.form.fecha,
                        'servicio': this.form.servicio,
                        'canalizacion': this.form.canalizacion,
                        'terapias': this.form.terapias,
                        'toma_muestras': this.form.toma_muestras,
                        'aspiracion': this.form.aspiracion,
                        'administracion_medicamento': this.form.administracion_medicamento,
                        'curaciones': this.form.curaciones,
                        'sonda_oro': this.form.sonda_oro,
                        'inmovilizacion': this.form.inmovilizacion,
                        'cateterismo': this.form.cateterismo,
                        'higiene_aseo': this.form.higiene_aseo,
                        'enemas': this.form.enemas,
                        'traslados': this.form.traslados,
                        'gases_arteriales': this.form.gases_arteriales,
                        'otro': this.form.otro,
                        'confirmacion_documento': this.form.confirmacion_documento,
                        'confirmacion_paciente': this.form.confirmacion_paciente,
                        'certifico': this.form.certifico,
                        'doctor': this.form.doctor,
                        'acuerdo': this.form.acuerdo,
                        'retiro': this.form.retiro,
                        'observacion': this.form.observacion,
                        'firma_paciente': firma,
                        'admision_urgencia_id': this.datos.admision_urgencia_id
                    }
                    this.$axios.post(`/consentimiento-informado-urgencias/crear`, data)
                        .then((res) => {
                            this.cancelarCrearEditar();
                            this.$toast.success("Se creó el resgistro correctamente");
                            this.listarConsentimiento();
                        })
                        .catch((error) => {
                            this.$toast.error("Ocurrió un error al crear ");
                            console.log(error);
                        })
                        .finally(() => {
                            this.setPreload(false)
                        });
                }


            },

            limpiar() {
                this.$refs.firmaPaciente.clear();
            },

            abrirModalEditar(item) {
                this.dialogCrearEditar = true;
                this.editMode = true;
                this.form = {
                    ...item
                };
            },
        }
    }

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
