<template>
    <div>
        <!-- Preload -->
        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <v-card flat>
            <!-- buscar afiliado -->
            <v-alert type="info" text dense border="left" icon="mdi-account-tie">Módulo de gestión acciones
                constitucionales <b>(tutelas)</b></v-alert>

            <v-container fluid>
                <v-row dense>
                    <v-col cols="12" md="2" sm="2">
                        <v-text-field dense v-model="filtro.radicado" label="Radicado" outlined>
                        </v-text-field>
                    </v-col>

                    <v-col cols="12" md="3" sm="3">
                        <v-autocomplete dense v-model="filtro.entidad_id" :items="entidades" item-text="nombre"
                            item-value="id" label="Entidad" outlined>
                        </v-autocomplete>
                    </v-col>

                    <!-- <v-col cols="12" sm="2" md="2">
            <v-text-field v-model="filtro.cedula_paciente" dense outlined label="Afiliado"
              hint="Digite el número de documento del afiliado">
            </v-text-field>
          </v-col> -->

                    <v-col cols="12" sm="3" md="3">
                        <v-btn-toggle background-color="white" dark>
                            <v-btn small color="info" @click="getTutelas()">Filtrar<v-icon right>mdi-magnify</v-icon>
                            </v-btn>
                            <v-btn small class="ml-2" color="error" @click="limpiarFiltro(), getTutelas()">Limpiar
                                <v-icon right>mdi-close</v-icon>
                            </v-btn>
                            <v-btn v-if="afiliado" color="boton" small class="ml-2" @click="dialog = true">Crear
                                tutela<v-icon right>
                                    mdi-plus</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>

                <v-dialog persistent v-model="dialog" max-width="1000px">
                    <v-card :loading="preload" :disabled="preload">
                        <v-alert text dense border="left" type="info">{{ formTitle }}</v-alert>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <accionConstitucionalComponent
                                        @respuestaComponente="dialog = false, getTutelas()" />
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-expansion-panels>
                    <v-expansion-panel v-for="(item, i) in tutelas" :key="i">
                        <v-expansion-panel-header>
                            <v-row justify="space-around" no-gutters dense>
                                <v-col cols="3">Afiliado: <b>{{ nombreAfiliadoItem }}</b></v-col>
                                <v-col cols="2">Documento: <b>{{ item.afiliado.numero_documento }}</b></v-col>
                                <v-col cols="1">Entidad: <b>{{ item.afiliado.entidad.nombre }}</b></v-col>
                                <v-col cols="2">Municipio: <b>{{ item.municipio.nombre }}</b></v-col>
                                <v-col cols="1">Radicado: <b>{{ item.radicado }}</b></v-col>
                                <v-col cols="3">F. Radicada: <b>{{ item.fecha_radica }}</b></v-col>
                                <v-spacer></v-spacer>
                            </v-row>
                            <!-- data acciones constitucionales -->
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-row dense>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field dense label="Buscar"
                                        hint="Puede buscar por cualquier campo de la tabla" clearable v-model="buscar">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-btn small color="blue-grey" dark @click="crearActuacion(item)">Crear
                                        actuación<v-icon right>
                                            mdi-plus-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" sm="3" md="3">
                                    <v-btn small color="warning" dark @click="cierreTutela(item)">Cerrar tutela<v-icon
                                            right>
                                            mdi-check-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-data-table no-data-text="Aún no hay registros" :search="buscar" dense :headers="headers"
                                :items="item.actuaciones">
                                <template v-slot:[`item.dias`]="{ item }">
                                    <v-chip small :color="ColorTd(item.dias)" dark>
                                        {{ item.dias }} Días
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.estado`]="{ item }">
                                    <td class="text-xs-center">
                                        <div>
                                            <v-chip small v-if="parseInt(item.estado_id) === 1" color="success"
                                                text-color="white">Sin asignar
                                            </v-chip>
                                            <v-chip small v-else-if="parseInt(item.estado_id) === 6" color="warning"
                                                text-color="white">Asignado</v-chip>
                                            <v-chip small v-else-if="parseInt(item.estado_id) === 17" color="error"
                                                text-color="white">
                                                Cerrado</v-chip>
                                            <v-chip small v-else-if="parseInt(item.estado_id) === 55" color="error"
                                                text-color="white">
                                                Reabierto</v-chip>
                                        </div>
                                    </td>
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-bind="attrs" v-on="on" color="blue"
                                                @click="abrirModalActuaciones(item)">
                                                mdi-eye
                                            </v-icon>
                                        </template>
                                        <span>Ver actuaciones</span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:[`item.responsables`]="{ item }">
                                    <td>
                                        <v-menu open-on-hover right offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-icon right color="info" v-on="on">mdi-account-badge-outline</v-icon>
                                            </template>
                                            <v-list dense>
                                                <v-list-item dense v-for="(data, index) in item.proceso" :key="index">
                                                    <v-list-item-content>{{ data.nombre }}</v-list-item-content>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </template>
                            </v-data-table>
                            <!-- dialogo actuaciones -->
                            <v-dialog persistent v-model="dialogoActuaciones" width="1500px">
                                <v-card>
                                    <v-alert class="text-center" type="info" icon="mdi-account-tie" dense text
                                        border="left">Actuación
                                    </v-alert>
                                    <v-tabs grow>
                                        <v-tab>
                                            <v-icon left>
                                                mdi-gesture-double-tap
                                            </v-icon>
                                            Actuación
                                        </v-tab>
                                        <v-tab>
                                            <v-icon left>mdi-account</v-icon>
                                            Afiliado
                                        </v-tab>
                                        <v-tab>
                                            <v-icon left>
                                                mdi-magnify-scan
                                            </v-icon>
                                            Seguimiento
                                        </v-tab>

                                        <v-tab-item>
                                            <v-card-text>
                                                <actuacionTutelaComponente :item="actuacionTutela"
                                                    @respuestaComponente="dialogoActuaciones = false, getTutelas()" />
                                            </v-card-text>
                                        </v-tab-item>
                                        <v-tab-item>
                                            <v-col cols="12" sm="12" md="12">
                                                <AfiliadoComponent :afiliado="item.afiliado" :modoDetalle="true"
                                                    :modoEdicion="true" :mostrarClasificaciones="true"
                                                    @respuestaComponente="componente = null" />
                                            </v-col>
                                        </v-tab-item>
                                        <v-tab-item>
                                            <v-card flat>
                                                <v-card-text>
                                                    <v-card-text>
                                                        <v-list>
                                                            <v-list-item-group color="primary">
                                                                <v-list-item v-for="(respuesta, r) in respuestas"
                                                                    :key="r">
                                                                    <v-list-item-content>
                                                                        <v-container class="grey lighten-5">
                                                                            <v-row dense class="mb-6" no-gutters>
                                                                                <v-col sm="12" md="12" lg="12">
                                                                                    <v-card class="pa-2" outlined tile>
                                                                                        Consecutivo de respuesta <b>{{ r
                                                                                            +
                                                                                            1 }}</b>
                                                                                        Fecha y hora de registro
                                                                                        <b>{{ respuesta.fecha_creacion
                                                                                            }}</b>
                                                                                        Tipo de respuesta
                                                                                        <b>{{ respuesta.tipo_respuesta
                                                                                            }}</b>
                                                                                        <v-col cols="12">
                                                                                            <v-textarea readonly
                                                                                                hide-details auto-grow
                                                                                                dense
                                                                                                v-model="respuesta.respuesta"
                                                                                                label="Respuesta">
                                                                                            </v-textarea>
                                                                                        </v-col>
                                                                                        <v-col sm="12" md="12" lg="12">
                                                                                            <v-btn small
                                                                                                v-for="(adjuntoR, index) in respuesta.adjuntos_tutelas"
                                                                                                :key="index">
                                                                                                <a
                                                                                                    @click="consultarAdjunto(adjuntoR.ruta)">
                                                                                                    <v-icon left
                                                                                                        color="dark">
                                                                                                        mdi-cloud-download-outline
                                                                                                    </v-icon>Adjunto
                                                                                                    {{ index + 1 }}
                                                                                                </a>
                                                                                            </v-btn>
                                                                                        </v-col>
                                                                                    </v-card>
                                                                                </v-col>
                                                                            </v-row>
                                                                        </v-container>
                                                                    </v-list-item-content>
                                                                </v-list-item>
                                                            </v-list-item-group>
                                                            <v-col cols="12"></v-col>
                                                            <v-form>
                                                                <v-alert icon="mdi-message-text-outline" dense
                                                                    type="info" text border="left">
                                                                    Formulario para
                                                                    registro de respuesta</v-alert>
                                                                <v-col cols="12" sm="4" md="4">
                                                                    <v-autocomplete
                                                                        hint="Parcial: aún en gestión --- Final: Gestionado"
                                                                        persistent-hint
                                                                        v-model="formularioRespuesta.tipo_respuesta"
                                                                        dense label="Tipo de respuesta"
                                                                        :items="['Parcial', 'Final']"></v-autocomplete>
                                                                </v-col>
                                                                <v-col cols="12" sm="12" md="12">
                                                                    <v-textarea auto-grow dense label="Respuesta"
                                                                        v-model="formularioRespuesta.respuesta">
                                                                    </v-textarea>
                                                                </v-col>

                                                                <v-col cols="12" sm="6" md="6">
                                                                    <v-file-input counter show-size truncate-length="10"
                                                                        v-model="adjuntos" small-chips multiple outlined
                                                                        dense label="Adjuntar"
                                                                        accept=".jpg, .jpeg, .pdf">
                                                                    </v-file-input>
                                                                    <v-alert border="left" colored-border type="error"
                                                                        dense>
                                                                        <small>Los archivos deben tener un tamaño máximo
                                                                            de 1GB
                                                                            <p> Extensiones
                                                                                permitidas:<b><i>jpg,
                                                                                        jpeg, pdf</i></b></p>
                                                                        </small>
                                                                    </v-alert>
                                                                </v-col>
                                                            </v-form>
                                                            <v-card-actions>
                                                                <v-spacer></v-spacer>
                                                                <v-btn small color="success"
                                                                    @click="responderActuacion()">Responder</v-btn>
                                                            </v-card-actions>
                                                        </v-list>
                                                    </v-card-text>
                                                </v-card-text>
                                            </v-card>
                                        </v-tab-item>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn dark small color="red"
                                                @click="dialogoActuaciones = false, respuestas = []">Cerrar</v-btn>
                                        </v-card-actions>
                                    </v-tabs>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="dialogoCrearActuacion" width="900px">
                                <v-card>
                                    <v-container>
                                        <actuacionTutelaComponente :item="item" :creacion="true"
                                            @respuestaComponente="dialogoCrearActuacion = false, getTutelas()" />
                                    </v-container>
                                </v-card>
                            </v-dialog>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-row no-gutters>
                    <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                            @input="getTutelas()">
                        </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                            @change="getTutelas()">
                        </v-select>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-dialog v-model="dialogoCierreTutela" persistent max-width="1000px">
            <v-card>
                <v-container>
                    <v-alert dense text border="left" type="success">Proceso de cierre tutela</v-alert>
                    <v-row dense>
                        <v-col cols="12" sm="4" md="4">
                            <v-autocomplete :items="['Temporal', 'Definitivo']" label="Tipo de cierre" dense
                                v-model="formularioCierre.tipo_cierre"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea label="Motivo" auto-grow dense v-model="formularioCierre.motivo"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="red" dark @click="dialogoCierreTutela = false">Cerrar</v-btn>
                        <v-btn small color="green" dark @click="cerrarTutela()">Guardar</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import moment from 'moment';
import AfiliadoComponent from '@/components/afiliado/FormularioAfiliadoComponente.vue';
import accionConstitucionalComponent from '~/components/tutela/gestion/tutelaComponente.vue';
import actuacionTutelaComponente from "~/components/tutela/gestion/actuacionTutelaComponente.vue";
import agenteOficiosoComponent from '@/components/tutela/gestion/agenteOficiosoComponente.vue';
import apoderadoComponent from '@/components/tutela/gestion/apoderadoComponente.vue';
import NovedadesComponent from '@/components/aseguramiento/verificacion/Novedades.vue';
import FormContratoComponent from "~/components/contrato/contratos/FormContratoComponent.vue";

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('tutelas.gestion')) {
            return redirect('/');
        }
    },
    name: 'accionConstitucional',
    components: {
        FormContratoComponent,
        AfiliadoComponent,
        actuacionTutelaComponente,
        accionConstitucionalComponent,
        agenteOficiosoComponent,
        apoderadoComponent,
        NovedadesComponent
    },


    data() {
        return {
            buscar: '',
            actuacionTutela: '',
            tutelaSelecionadaCierre: '',
            dialogoCrearActuacion: false,
            preload: false,
            dialog: false,
            dialogDelete: false,
            dialogoActuaciones: false,
            dialogoCierreTutela: false,
            componente: null,
            tab: null,
            datos: null,
            adjuntos: [],
            tutelas: [],
            entidades: [],
            respuestas: [],
            rutaAdjunto: [],
            editar: false,
            opciones: [5, 10, 15, 20, 50, 100],
            opcionActual: 15,
            pagina: 1,
            total: 0,
            formularioRespuesta: {
                respuesta: '',
                actuacion_tutela_id: '',
                user_id: '',
                tipo_respuesta: '',
            },
            formularioCierre: {
                tipo_cierre: '',
                motivo: '',
                tutela_id: '',
                user_id: '',
            },
            filtro: {
                cedula_paciente: null,
                entidad_id: null,
                radicado: null,
            },
            headers: [{
                text: 'Id',
                value: 'id',
            },
            {
                text: 'fecha radica',
                value: 'fecha_radica'
            },
            {
                text: 'Actuación',
                value: 'tipo_actuacion.nombre',
                align: 'start'
            },
            {
                text: 'Responsable',
                value: 'responsables',
                align: 'center',
                sortable: false,
            },
            {
                text: 'Exclusión',
                value: 'exclusion',
            },
            {
                text: 'Continuidad',
                value: 'continuidad'
            },
            {
                text: 'Integralidad',
                value: 'integralidad'
            },
            {
                text: 'Días',
                value: 'dias',
                align: 'center'
            },
            {
                text: 'Estado',
                value: 'estado',
                align: 'center'
            },
            {
                text: 'Actiones',
                value: 'actions',
                align: 'center',
                sortable: false
            },
            ],
            afiliado: [],
            editedIndex: -1,
            items: [{
                tab: 'Información General',
            },
            {
                tab: 'Accion Constitucional',
            },
            {
                tab: 'Agente Oficioso',
            },
            {
                tab: 'Apoderado',
            },
            {
                tab: 'Historico',
            }
            ],
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Crear acción constitucional' : 'Actualizar acción constitucional'
        },
        nombreAfiliadoItem() {
            const a = this.item?.afiliado || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    mounted() {
        this.listarEntidades();
        this.getTutelas();

    },

    methods: {

        responderActuacion() {
            if (this.formularioRespuesta.respuesta == '' || this.formularioRespuesta.tipo_respuesta == '') {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debes diligenciar el campo respuesta y determinar un tipo de respuesta para responder",
                    type: "error",
                });
            }

            const formData = new FormData();
            formData.append(`respuesta`, this.formularioRespuesta.respuesta);
            formData.append(`tipo_respuesta`, this.formularioRespuesta.tipo_respuesta);
            formData.append(`actuacion_tutela_id`, this.actuacionTutela.id);
            formData.append(`user_id`, this.$store.state.auth.usuario.operador.user_id);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }

            this.$axios.post('/respuesta', formData).then(res => {
                this.formularioRespuesta = {}
                this.$toast.success('Respuesta registrada')
                this.dialogoActuaciones = false
            })
        },

        /**
         * listar entidades
         * @return objeto entidades
         * @author kobatime
         */
        listarEntidades() {
            this.preload = true;
            this.$axios.post('/entidad/listar').then(
                res => {
                    this.entidades = res.data;
                    this.preload = false;
                }).catch(e => {
                    this.preload = false;
                })
        },

        /**
         * buscar afiliado
         * @param cedula number
         * @return objeto usuario
         * @author kobatime
         */
        getTutelas() {
            this.preload = true
            this.$axios.post("/tutela/buscar?page=" + this.pagina + "&cant=" + this.opcionActual, this
                .filtro).then(res => {
                    this.tutelas = res.data.data;
                    this.total = res.data.last_page;
                    this.preload = false;
                }).catch(error => {
                    this.preload = false;
                    this.$toast.error(error.response.data.mensaje)
                })
        },

        /**
         * Control de componentes
         * @param tab string
         * @author kobatime
         */
        modalComponente(tab) {
            if (tab == 'Información General') {
                this.componente = AfiliadoComponent
            }
            if (tab == 'Accion Constitucional') {
                this.componente = accionConstitucionalComponent
            }
            if (tab == 'Agente Oficioso') {
                this.componente = agenteOficiosoComponent
            }
            if (tab == 'Apoderado') {
                this.componente = apoderadoComponent
            }
            if (tab == 'Historico') {
                this.componente = NovedadesComponent
            }

        },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },

        limpiarForms() {
            this.cedula_paciente = null;
            this.accionConstitucional = null;
            this.afiliado = [];
        },

        limpiarFiltro() {
            this.filtro.cedula_paciente = null;
            this.filtro.entidad_id = null;
            this.filtro.radicado = null;
        },

        DiasRestantes(asignadas) {
            let dias = asignadas.dias
            let fechaAsignado = moment(asignadas.created_at);
            let fechaActual = moment();
            let diferenciadays = fechaActual.diff(fechaAsignado, 'days');
            let Total = dias - diferenciadays;
            return Total;

        },

        ColorTd(dia) {
            if (dia == 1) {
                return 'yellow black--text';
            }
            if (dia >= 2) {
                return 'success white--text';
            } else {
                return 'error white--text';
            }
        },

        abrirModalActuaciones(item) {
            this.dialogoActuaciones = true
            this.actuacionTutela = item
            this.listarRespuestas()
        },

        crearActuacion() {
            this.dialogoCrearActuacion = true
        },

        cierreTutela(item) {
            console.log('sss', item);
            this.tutelaSelecionadaCierre = item
            this.dialogoCierreTutela = true
        },

        cerrarTutela() {
            if (this.formularioCierre.tipo_cierre == '' || this.formularioCierre.motivo == '') {
                return this.$swal({
                    type: "error",
                    title: "¡No puede ser!",
                    text: 'Debes determinar un tipo de cierre e ingresar el motivo',
                });
            }
            this.formularioCierre.user_id = this.$store.state.auth.usuario.operador.user_id
            this.formularioCierre.tutela_id = this.tutelaSelecionadaCierre.id
            this.formularioCierre.afiliado_id = this.tutelaSelecionadaCierre.afiliado_id
            this.$axios.post('/tutela/cerrarTutela', this.formularioCierre).then(res => {
                this.$toast.success('Se ha cerrado la tutela correctamente')
                this.dialogoCierreTutela = false
                this.formularioCierre = {}
                this.getTutelas()
            })
        },

        listarRespuestas() {
            this.preload = true
            this.$axios.post('/respuesta/listarRespuestas', {
                'actuacion_tutela_id': this.actuacionTutela.id
            }).then(res => {
                this.respuestas = res.data
                this.preload = false
            })
        },

        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },


    },
};

</script>
