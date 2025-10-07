<template>
    <div>
        <component :is="comp" :datos="datosGenerales" @cerrar="cerrarHistoria" :ref="comp"></component>
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="4" sm="6">
                    <v-text-field dense v-model="formNoProgramada.documento" label="Número documento" outlined required>
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                    <v-autocomplete dense v-model="formNoProgramada.especialidad" :items="especialidades"
                        item-text="nombre" label="Especialidad atención" item-value="id" @change="listarCitasHistoria"
                        required :loading="loading" :disabled="loading" outlined></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                    <v-autocomplete dense v-model="formNoProgramada.cita" label="Cita" :items="citas"
                        no-data-text="Debes elegir una especialidad para cargar las citas"
                        :item-text="(item) => `${item.nombre} - ${item.tipo_historia.nombre}`" return-object required
                        :disabled="!formNoProgramada.especialidad" @change="listasSedes(), listaCups()" outlined
                        :loading="cargarCitas">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                    <v-autocomplete dense v-model="formNoProgramada.cup" :items="cups" item-value="id"
                        :item-text="(item) => `${item.nombre} - ${item.codigo}`" label="Cup"
                        no-data-text="Elije una cita para cargar los cups" :disabled="!formNoProgramada.cita" outlined
                        :loading="cargandoCups"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                    <v-autocomplete dense v-model="formNoProgramada.sede" :items="sedes" item-text="nombre"
                        item-value="id" label="Sede" :disabled="!formNoProgramada.cup" :loading="cargandoSedes"
                        outlined>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" md="4" sm="6" class="pa-4">
                    <v-btn :disabled="preload" dark color="success" small @click="generarNoProgramada">Atender Paciente
                        No
                        Programado</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-data-table :headers="headers" :items="citasNoProgramadas" :items-per-page="10"
            no-data-text="Aún no hay registros de citas no programadas" dense>
            <template v-slot:[`item.estado`]="{ item }">
                <v-chip small v-if="item.estado_id == 14 || item.estado_id == 13" :color="getColor(item.estado_id)"
                    dark>
                    {{ 'Asignado' }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 7" :color="getColor(item.estado_id)" dark>
                    {{ 'En consulta' }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 8" :color="getColor(item.estado_id)" dark>
                    {{ 'Inasistido' }}
                </v-chip>
                <v-chip small v-if="item.estado_id == 9" :color="getColor(item.estado_id)" dark>
                    {{ 'Atendido' }}
                </v-chip>
            </template>
            <template v-slot:[`item.afiliado`]="{ item }">
                {{ item.afiliado?.primer_nombre }}
                {{ item.afiliado?.segundo_nombre }}
                {{ item.afiliado?.primer_apellido }}
                {{ item.afiliado?.segundo_apellido }}
            </template>

            <template v-slot:[`item.marcacionAfiliado`]="{ item }">
                <ClasificacionAfiliadoComponente :item="item" />
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom v-if="item.estado_id != 9 && item.estado_id != 8">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="success" v-on="on" v-bind="attrs" @click="generarHistoria(item)">
                            <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Atender</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="info" v-on="on" v-bind="attrs" @click="print(item.id)">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir historia</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.estado_id == 9 && item.firma_paciente">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="success" v-on="on" v-bind="attrs" @click="printCertificadoMedico(item.id)">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir Certificado Consulta</span>
                </v-tooltip>
                <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="warning" v-on="on" v-bind="attrs" @click="abrirModalCorreo(item.id)">
                            <v-icon>mdi-email-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Enviar al correo</span>
                </v-tooltip>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogoFirma" persistent fullscreen v-if="dialogoFirma">
            <v-card>
                <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
                    <b>Firma atención</b></v-alert>
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
                                                <!-- <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn> -->
                                                <!-- <v-btn small color="success" @click="save">Guardar</v-btn> -->
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
                                                <!-- <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn> -->
                                                <!-- <v-btn small color="success" @click="save2">Guardar</v-btn> -->
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
                    <!-- <v-btn color="error" small dark @click="dialogoFirma=false, clear,clear2">Cancelar</v-btn> -->
                    <v-btn color="success" small dark @click="confirmarCita()">Ingresar cita</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalCorreo" persistent max-width="500" v-if="modalCorreo">
            <v-card>
                <v-alert class="text-center" dense text color="primary" icon="mdi-book-open-page-variant"
                    border="bottom">
                    <b>Enviar historia al correo</b></v-alert>
                <v-card-text>

                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formCorreo.correo" label="Correo electrónico">
                            </v-text-field>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark small
                        @click="modalCorreo = false, formCorreo.correo = '', consultaCorreo = ''">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="enviarCorreo()">Enviar</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </div>
</template>
<script>
import vueSignature from "vue-signature";
import {
    listarReps
} from "~/api/reps/reps";
import HistoriaIntegral from "~/components/panelMedico/historiaIntegral.vue";
import {
    mapActions
} from "vuex";
import ClasificacionAfiliadoComponente from "~/components/panelMedico/clasificacionAfiliadoComponente.vue"
export default {
    name: 'noProgramada',
    components: {
        HistoriaIntegral,
        vueSignature,
        ClasificacionAfiliadoComponente,
    },
    data() {
        return {
            comp: null,
            e6: 1,
            tituloHistoria: "",
            dialogHistoria: false,
            registroHistoria: {},
            datosGenerales: {},
            historia: [],
            cups: [],
            citas: [],
            sedes: [],
            loading: false,
            especialidades: [],
            formNoProgramada: {
                documento: null,
                cup: null,
                especialidad: null,
                cita: null,
                sede: null
            },
            preload: false,
            cargarCitas: false,
            cargandoCups: false,
            cargandoSedes: false,
            citasNoProgramadas: [],
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Hora',
                sortable: false,
                value: 'fecha_hora_inicio'
            },
            {
                text: 'Paciente',
                sortable: false,
                value: 'afiliado'
            },
            {
                text: 'Tipo documento',
                sortable: false,
                value: 'afiliado.tipo_documento.nombre'
            },
            {
                text: 'Documento',
                sortable: false,
                value: 'afiliado.numero_documento'
            },
            {
                text: 'Sexo',
                sortable: false,
                value: 'afiliado.sexo'
            },
            {
                text: 'Edad',
                sortable: false,
                value: 'afiliado.edad_cumplida',
                align: "center"
            },
            {
                text: 'Marcación',
                sortable: false,
                value: 'marcacionAfiliado'
            },
            // {
            //   text: 'Sede',
            //   sortable: false,
            //   value: 'agenda.consultorio.rep.nombre'
            // },
            {
                text: 'Especialidad',
                sortable: false,
                value: 'cita.especialidad.nombre'
            },
            {
                text: 'Actividad',
                sortable: false,
                value: 'cita.nombre'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado',
                align: 'center'
            },
            {
                text: 'Tiempo en consulta',
                sortable: false,
                value: 'tiempo_consulta',
                align: 'center'
            },
            {
                text: 'Acciones',
                value: 'acciones',
                align: 'center',
            }
            ],
            modalCorreo: false,
            formCorreo: {},
            consultaCorreo: '',
            modalInasistir: false,
            formInadecuar: {},
            consultaInadecuar: '',
            FiltroCups: '',
            dialogoFirma: false,
            option: {
                penColor: "rgb(0, 0, 0)",
                backgroundColor: "rgb(255,255,255)",
            },
            clasifiacionesAfiliados: [],
        }
    },
    mounted() {
        this.listarNoProgramadas();
        this.listarEspecialidades();
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        getColor(estado_id) {
            if (estado_id == 5) return 'brown';
            else if (estado_id == 8) return 'red'
            else if (estado_id == 7) return 'warning'
            else if (estado_id == 14) return 'success'
            else if (estado_id == 9) return 'blue'
            else return 'orange'
        },

        async generarNoProgramada() {
            // peticion
            try {
                this.setPreload(true);
                // validaciones
                if (
                    this.formNoProgramada.documento == null ||
                    this.formNoProgramada.cup == null ||
                    this.formNoProgramada.especialidad == null ||
                    this.formNoProgramada.sede == null ||
                    this.formNoProgramada.cita == null
                ) {
                    return this.$toast.error('Debes diligenciar todos los campos')
                }
                const response = await this.$axios.post('consultas/generar-noprogramada', this
                    .formNoProgramada);
                this.datosGenerales = response.data;
                if (this.formNoProgramada.cita.requiere_firma == true) {
                    this.dialogoFirma = true
                } else {
                    this.limpiarCampos()
                    this.comp = 'HistoriaIntegral';
                    this.$nextTick(() => {
                        this.$refs.HistoriaIntegral.abrirDialog()
                    })
                    this.listarNoProgramadas();
                    this.$emit("actualizarContadores");
                }

            } catch (error) {
                this.$toast.error(error.response.data.message)
            } finally {
                this.setPreload(false);
            }
        },

        limpiarCampos() {
            this.formNoProgramada = {
                documento: null,
                cup: null,
                especialidad: null,
                cita: null,
                sede: null
            }
        },

        listaCups() {
            this.cargandoCups = true;
            this.$axios.get('/cup/listarCupsCita/' + this.formNoProgramada.cita.id).then(res => {
                this.cups = res.data
                this.cargandoCups = false;
            }).catch(e => {
                e.response
                this.cargandoCups = false;
            })
        },

        listarEspecialidades() {
            this.loading = true;
            this.$axios.get('especialidades/listarEspecialidadesMedicos/' + this.$store.state.auth.usuario.id).then(
                res => {
                    this.especialidades = res.data;
                    this.loading = false;
                }).catch(e => {
                    this.loading = false;
                })
        },
        listarCitasHistoria() {
            this.cargarCitas = true;
            this.$axios.get('citas/historia-disponibles/' + this.formNoProgramada.especialidad).then(res => {
                this.citas = res.data;
                this.cargarCitas = false;
            }).catch(e => {
                this.cargarCitas = false;
            })
        },
        listasSedes() {
            this.cargandoSedes = true;
            this.$loadingPostRequest(listarReps(0, 0, true, 0)).then(res => {
                this.sedes = res.data;
                this.cargandoSedes = false;
            }).catch(e => {
                this.cargandoSedes = false;
            })
        },

        listarNoProgramadas() {
            this.setPreload(true);
            this.$axios.post('/consultas/citasNoProgramadas').then(res => {
                this.citasNoProgramadas = res.data;
                this.setPreload(false);
            }).catch(err => {
                this.setPreload(false);
            })
        },
        generarHistoria(item) {
            this.datosGenerales = item;
            this.comp = 'HistoriaIntegral';
            this.$nextTick(() => {
                this.$refs.HistoriaIntegral.abrirDialog()
            })
            // this.listarNoProgramadas();
        },

        cerrarHistoria() {
            this.comp = null;
            this.listarNoProgramadas()
            this.$emit("actualizarContadores");
        },

        async print(pdf) {
            this.setPreload(true)
            await this.$axios.post('pdf', {
                consulta: pdf,
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

        abrirModalCorreo(consulta) {
            this.modalCorreo = true
            this.consultaCorreo = consulta
        },

        enviarCorreo() {
            var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (!regex.test(this.formCorreo.correo)) {
                return this.$swal.fire({
                    title: "Debe ingresar un Email valido",
                    icon: "warning",
                    type: "error",
                });
            }
            this.preload = true
            let pdf = {
                consulta: this.consultaCorreo,
                tipo: 'historia',
                correo: this.formCorreo.correo
            }
            // this.print(this.consultaCorreo,this.formCorreo.correo)
            this.$axios.post('pdf', pdf).then(res => {
                this.preload = false
                // this.emailEnvio = null;
                this.formCorreo.correo = ''
                this.consultaCorreo = ''
                this.modalCorreo = false;
                return this.$swal.fire({
                    title: "Historia enviada con exito!",
                    icon: "success",
                    type: "success",
                });
            }).catch(err => {
                this.preload = false;
            })
        },


        enconsulta(consulta) {
            this.preload = true

            this.$axios.post('historia/enconsulta/' + consulta).then(res => {

            })
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

        confirmarCita() {
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
            const firmaBase64Acompanante = this.$refs.signature2 && !this.$refs.signature2.isEmpty() ? this.$refs
                .signature2
                .save() : null;
            formdata.append("firma", firmaBase64);
            if (firmaBase64Acompanante) {
                formdata.append("firmaAcompanante", firmaBase64Acompanante);
            }
            formdata.append("consulta", this.datosGenerales.id);
            // formdata.append("afiliado", this.afiliadoId);
            this.$axios
                .post("/consultas/guardarFirma", formdata)
                .then((res) => {
                    // this.$toast.success(res.data.mensaje)
                    // this.clear2();
                    this.dialogoFirma = false
                    this.clear()
                    this.limpiarCampos()
                    this.comp = 'HistoriaIntegral';
                    this.listarNoProgramadas();
                    this.$emit("actualizarContadores");
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        async printCertificadoMedico(pdf) {
            try {
                const request = {
                    consulta: pdf,
                    tipo: "certificadoAtencionMedica",
                    correo: null,
                };
                this.preload = true;
                const res = await this.$axios.post("/pdf", request, {
                    responseType: "arraybuffer",
                });
                const blob = new Blob([res.data], {
                    type: "application/pdf",
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error);
            } finally {
                this.preload = false;
            }
        },
    }
}

</script>
