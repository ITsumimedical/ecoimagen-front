<template>
    <v-container>
        <v-row dense class="mt-4">
            <!--Filtro de busqueda-->
            <filtrosGestion @listar-informacion="listarAccionesFiltro"></filtrosGestion>

            <!--Componente header-->
            <headersGestion :titles="headersAcciones"></headersGestion>

            <!--Cabecera de acciones constitucionales-->
            <v-expansion-panels v-if="accionesListado.length > 0">
                <v-expansion-panel v-for="(item, i) in accionesListado" :key="i">
                    <v-expansion-panel-header>
                        <v-row align="center" class="text-center">
                            <v-col cols="2">{{ obtenerNombrecompletoAfiliado(item.afiliado) }}</v-col>
                            <v-col cols="2">{{ item.afiliado.numero_documento }}</v-col>
                            <v-col cols="2">{{ item.afiliado.entidad.nombre }}</v-col>
                            <v-col cols="2">{{ item.municipio.nombre }}</v-col>
                            <v-col cols="2">{{ item.radicado }}</v-col>
                            <v-col cols="2">{{ item.fecha_radica }}</v-col>
                            <v-spacer></v-spacer>
                        </v-row>
                        <!-- data acciones constitucionales relacionadas -->

                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-row dense>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field dense label="Buscar" hint="Puede buscar por cualquier campo de la tabla"
                                    clearable v-model="buscar"></v-text-field>
                            </v-col>

                            <!--se agrega condicion para mostrar botones de crear actuacion o cerrar solo si el estado en consulta es distinto a cerrado definitivo-->
                            <v-col cols="12" sm="3" md="3" v-show="estados != 17">
                                <v-btn small color="blue-grey" dark @click="crearActuacion(item)">Crear actuación<v-icon
                                        right>
                                        mdi-plus-circle-outline</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="3" md="3" v-show="estados != 17">
                                <v-btn small color="warning" dark @click="cierreTutela(item)">Cerrar acción<v-icon
                                        right>
                                        mdi-check-circle-outline</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="2" md="2" v-show="estados == 23">
                                <v-btn small color="success" dark @click="abrirTutela(item)">
                                    Abrir acción
                                    <v-icon right>
                                        mdi-open-in-app
                                    </v-icon>
                                </v-btn>

                            </v-col>
                        </v-row>

                        <!-- tabla desplegada Actuaciones-->
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
                                        <v-chip small v-else-if="parseInt(item.estado_id) === 23" color="error"
                                            text-color="white">
                                            Temporalmente cerrado</v-chip>
                                    </div>
                                </td>
                            </template>

                            <!--Boton modal actuaciones-->
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip top>

                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="blue"
                                                @click="abrirModalActuaciones(item), consultarDatosAfiliado(accionesListado[i].afiliado)">
                                                mdi-eye
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ver actuaciones</span>
                                </v-tooltip>

                            </template>

                            <template v-slot:[`item.responsables`]="{ item }">
                                <td>
                                    <!--persona responsable-->
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

                        <!-- dialogo actuaciones-->
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
                                            <!--componente actuacion tutela-->
                                            <actuacionTutelaComponente :item="actuacionTutela"
                                                @respuestaComponente="dialogoActuaciones = false, listarAcciones()" />
                                        </v-card-text>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-col cols="12" sm="12" md="12">
                                            <!--se carga el componente de datos del afiliado-->
                                            <EditarAfiliadoComponente :afiliado="datosAfiliado">
                                            </EditarAfiliadoComponente>
                                        </v-col>
                                    </v-tab-item>
                                    <v-tab-item>
                                        <v-card flat>
                                            <v-card-text>
                                                <v-card-text>
                                                    <v-list>
                                                        <v-list-item-group color="primary">
                                                            <v-list-item v-for="(respuesta, r) in respuestas" :key="r">
                                                                <v-list-item-content>
                                                                    <v-container class="grey lighten-5">
                                                                        <v-row dense class="mb-6" no-gutters>
                                                                            <v-col sm="12" md="12" lg="12">
                                                                                <v-card class="pa-2" outlined tile>
                                                                                    Consecutivo de respuesta <b>{{ r +
                                                                                        1 }}</b>
                                                                                    Fecha y hora de registro
                                                                                    <b>{{ respuesta.fecha_creacion
                                                                                        }}</b>
                                                                                    Tipo de respuesta
                                                                                    <b>{{ respuesta.tipo_respuesta
                                                                                        }}</b>
                                                                                    <v-col cols="12">
                                                                                        <v-textarea readonly
                                                                                            hide-details auto-grow dense
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
                                                        <v-form v-if="estados != 17">
                                                            <v-alert icon="mdi-message-text-outline" dense type="info"
                                                                text border="left">
                                                                Formulario para
                                                                registro de respuesta</v-alert>
                                                            <v-col cols="12" sm="4" md="4">
                                                                <v-autocomplete
                                                                    hint="Parcial: aún en gestión --- Final: Gestionado"
                                                                    persistent-hint
                                                                    v-model="formularioRespuesta.tipo_respuesta" dense
                                                                    label="Tipo de respuesta"
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
                                                                    dense label="Adjuntar" accept=".jpg, .jpeg, .pdf">
                                                                </v-file-input>
                                                                <v-alert border="left" colored-border type="error"
                                                                    dense>
                                                                    <small>Los archivos deben tener un tamaño máximo de
                                                                        1GB<p> Extensiones
                                                                            permitidas:<b><i>jpg,
                                                                                    jpeg, pdf</i></b></p></small>
                                                                </v-alert>
                                                            </v-col>
                                                        </v-form>
                                                        <v-card-actions v-if="estados != 17">
                                                            <v-spacer></v-spacer>
                                                            <v-btn small color="success" @click="responderActuacion()">
                                                                Responder</v-btn>
                                                        </v-card-actions>
                                                    </v-list>
                                                </v-card-text>
                                            </v-card-text>
                                        </v-card>
                                    </v-tab-item>

                                </v-tabs>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn dark small color="red" @click="dialogoActuaciones = false, respuestas = []">
                                        Cerrar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogoCrearActuacion" width="900px">
                            <v-card>
                                <v-container>
                                    <actuacionTutelaComponente :item="item" :creacion="true"
                                        @respuestaComponente="dialogoCrearActuacion = false, listarAcciones()" />
                                </v-container>
                            </v-card>
                        </v-dialog>

                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-col cols="12" class="text-center" v-else>No se tiene información registrada</v-col>

            <v-col cols="12" md="12" sm="12" class="mt-4">
                <v-divider></v-divider>
            </v-col>

            <!--Footer con el paginador propio de acuerdo con la información que viene-->
            <v-col cols="12" md="11" sm="11">
                <v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
                    @input="listarAcciones()">
                </v-pagination>
            </v-col>
            <v-col cols="12" md="1" sm="1">
                <v-select dense v-model="paginacion.cantidadRegistros" :items="[5, 10, 15, 20, 50, 100]" outlined
                    label="Registros" @change="listarAcciones()"></v-select>
            </v-col>

            <!--cuadro de dialogo para cierre de tutela-->
            <v-dialog v-model="dialogoCierreTutela" persistent max-width="1000px">
                <v-card>
                    <v-container>
                        <v-alert dense text border="left" type="success">Proceso de cierre de acción
                            constitucional</v-alert>
                        <v-row dense>
                            <v-col cols="12" sm="4" md="4">
                                <v-autocomplete :items="['Temporal', 'Definitivo']" label="Tipo de cierre" dense
                                    v-model="formularioCierre.tipo_cierre"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea label="Motivo" auto-grow dense v-model="formularioCierre.motivo">
                                </v-textarea>
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
        </v-row>
    </v-container>
</template>

<script>
import {
    mapActions
} from "vuex";
import actuacionTutelaComponente from '@/components/tutela/gestion/actuacionTutelaComponente.vue';
import accionConstitucionalComponent from '@/components/tutela/gestion/tutelaComponente.vue'
import agenteOficiosoComponent from '@/components/tutela/gestion/agenteOficiosoComponente.vue';
import apoderadoComponent from '@/components/tutela/gestion/apoderadoComponente.vue';
import NovedadesComponent from '@/components/aseguramiento/verificacion/Novedades.vue';
import FormContratoComponent from "~/components/contrato/contratos/FormContratoComponent.vue";
import filtrosGestion from '@/components/tutela/gestion/filtrosGestion.vue';
import headersGestion from '@/components/tutela/gestion/headersGestion.vue';
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";


export default ({
    middleware({
        $can,
        redirect
    }) {
        if (!$can('tutelas.gestion')) {
            return redirect('/');
        }
    },
    components: {
        actuacionTutelaComponente,
        accionConstitucionalComponent,
        agenteOficiosoComponent,
        apoderadoComponent,
        NovedadesComponent,
        FormContratoComponent,
        filtrosGestion,
        headersGestion,
        EditarAfiliadoComponente,
    },
    props: ['estados'],
    data() {
        return {
            expanded: [],
            preload: false,
            paginacion: {
                pagina: 1,
                cantidadRegistros: 5,
                total: 0,
            },
            opcionesEntidad: [],
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
                municipio: null,
                fecha_inicio: null,
                fecha_fin: null,
                estado_id: null,
            },
            menu: {
                fechaInicio: false,
                fechaFin: false,
            },

            headersAcciones: [{
                text: "Afiliado",
                value: "",
                align: "center"
            },
            {
                text: "Documento",
                value: "",
                align: "center"
            },
            {
                text: "Entidad",
                value: "",
                align: "center"
            },
            {
                text: "Municipio",
                value: "",
                align: "center"
            },
            {
                text: "Radicado",
                value: "",
                align: "center"
            },
            {
                text: "Fecha radicación",
                value: "",
                align: "center"
            }

            ],
            headers: [{
                text: 'Id',
                value: 'id',
            },
            {
                text: 'fecha radicación',
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
                text: 'Acciones',
                value: 'actions',
                align: 'center',
                sortable: false
            },
            ],
            accionesListado: [],
            dialogoActuaciones: false,
            actuacionTutela: '',
            respuestas: [],
            dialogoCrearActuacion: false,
            afiliado: [],
            adjuntos: [],
            tutelas: [],
            rutaAdjunto: [],
            componente: null,
            dialogoCierreTutela: false,
            tutelaSeleccionadaCierre: '',
            dialog: false,
            datos: null,
            buscar: '',
            tab: null,
            datosAfiliado: null,

        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },

    },
    mounted() {
        this.listarAcciones();
    },
    methods: {
        ...mapActions('app', ['setPreload']),
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
                this.adjuntos = []
                this.$toast.success('Respuesta registrada')
                this.dialogoActuaciones = false
            })
        },


        listarAcciones() {

            const data = {
                filtro: {
                    cedula_paciente: null,
                    entidad_id: null,
                    radicado: null,
                    municipio: null,
                    fecha_inicio: null,
                    fecha_fin: null,
                    estado_id: parseInt(this.estados),
                },
                paginacion: this.paginacion
            }

            this.setPreload(true)
            this.$axios.post("/tutela/listarAccion", data)
                .then((res) => {
                    this.accionesListado = res.data.data;
                    this.paginacion.total = res.data.last_page;


                    this.$emit('actualizarContador', res.data.total)

                }).catch(error => {
                    this.setPreload(true)
                    this.$toast.error(error.response.data.mensaje)
                }).finally(() => {
                    this.setPreload(false)
                })
        },

        //realiza la consulta de datos del afiliado seleccionado para cargar en el componente de afiliado
        async consultarDatosAfiliado(item) {
            this.setPreload(true)
            await this.$axios.get(`/afiliados/${item.numero_documento}/${item.tipo_documento}`)
                .then((res) => {
                    this.datosAfiliado = res.data;
                }).catch(error => {

                    this.$toast.error(error.response.data.error);

                }).finally(() => {
                    this.setPreload(false)
                })
        },

        listarAccionesFiltro(valores) {
            this.setPreload(true)
            valores.estado_id = parseInt(this.estados);

            const data = {
                filtro: valores,
                paginacion: this.paginacion
            }

            this.$axios.post("/tutela/listarAccion", data)
                .then((res) => {
                    this.accionesListado = res.data.data;
                    this.paginacion.total = res.data.last_page;

                }).catch(error => {
                    this.setPreload(false);
                    this.$toast.error(error.response.data.mensaje)
                }).finally(() => {
                    this.setPreload(false)
                })
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
        DiasRestantes(asignadas) {
            let dias = asignadas.dias
            let fechaAsignado = moment(asignadas.created_at);
            let fechaActual = moment();
            let diferenciadays = fechaActual.diff(fechaAsignado, 'days');
            let Total = dias - diferenciadays;
            return Total;

        },
        abrirModalActuaciones(item) {
            this.dialogoActuaciones = true
            this.actuacionTutela = item
            this.listarRespuestas()

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

        cierreTutela(item) {
            this.tutelaSeleccionadaCierre = item
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
            this.formularioCierre.tutela_id = this.tutelaSeleccionadaCierre.id
            this.formularioCierre.afiliado_id = this.tutelaSeleccionadaCierre.afiliado_id
            if (this.formularioCierre.tipo_cierre == 'Definitivo') {
                this.$axios.post('/tutela/cerrarTutela', this.formularioCierre).then(res => {
                    this.$toast.success(
                        'Se ha cerrado definitivamente la acción constitucional correctamente')
                    this.dialogoCierreTutela = false
                    this.formularioCierre = {}
                    this.listarAcciones()
                })
            } else {
                //implemento cierres de acuerdo con lo que el usuario seleccione
                this.$axios.post('/tutela/cerrarTutelaTemporal', this.formularioCierre).then(res => {
                    this.$toast.success(
                        'Se ha cerrado temporalmente la acción constitucional correctamente')
                    this.dialogoCierreTutela = false
                    this.formularioCierre = {}
                    this.listarAcciones()
                })
            }
        },
        crearActuacion() {
            this.dialogoCrearActuacion = true
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        async consultarAdjunto(ruta) {
            try {
                this.setPreload(true)
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
                this.setPreload(false)
            } catch (error) {
                this.$toast.error('Error al recuperar los archivos adjuntos', error);
            }
        },

        abrirTutela(item) {

            this.$swal({
                title: "¿Está Seguro?",
                text: "Se abrirá nuevamente el proceso de tutela",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Abrir",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    this.setPreload(true)
                    const request = {
                        'actuacion_tutela_id': item.actuaciones[0].id,
                        'tutela_id': item.id
                    };
                    this.$axios.post("/tutela/abrirTutela", request).then((res) => {
                        this.listarAcciones()

                        this.$toast.success(res.data.mensaje);
                    }).catch(error => {

                        this.$toast.error(error.data.error);
                    }).finally(() => {
                        this.setPreload(false);
                    })
                }
            });
        },

        obtenerNombrecompletoAfiliado(afiliado) {
            const a = afiliado || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }

    }
})

</script>
