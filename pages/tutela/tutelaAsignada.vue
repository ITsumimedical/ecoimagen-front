<template>
    <v-card elevation="0">
        <v-row>
            <v-col cols="8">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="logo horus" height="50px" width="50px" />
                                <span>Módulo de gestión de acciones constitucionales asignadas</span>
                            </div>
                        </v-toolbar-title>

                    </v-toolbar>
                </v-card-title>
            </v-col>
        </v-row>

        <!-- opciones -->
        <v-tabs grow v-model="tab">
            <v-tabs-slider :color="sliderColor"></v-tabs-slider>
            <v-tab class="pendientes-tab">
                <v-icon left class="text-red">mdi-alert-circle</v-icon>
                <span class="text-red">Asignadas</span>
                <v-badge :content="totalAsignadas ? totalAsignadas : '0'" :color="'#FF5252'"
                    class="ml-2 mt-3"></v-badge>
            </v-tab>
            <v-tab class="cerradoParcial-tab" @click="listarTutelaCerradaTemporal()">
                <v-icon left class="text-yellow">mdi-checkbox-marked-circle-plus-outline</v-icon>
                <span class="text-yellow">Cerrado temporal</span>
                <v-badge :content="totalCerradasTemporal ? totalCerradasTemporal : '0'" color="#FF9800"
                    class="ml-2 mt-3"></v-badge>
            </v-tab>

            <v-tab class="Cerradas-tab" @click="listarTutelasAsignadasCerrada()">
                <v-icon left class="text-green">mdi-check-circle</v-icon>
                <span class="text-green">Cerrado total</span>
                <v-badge color="#4CAF50" :content="totalCerradasTotal ? totalCerradasTotal : '0'"
                    class="ml-2 mt-3"></v-badge>
            </v-tab>

            <!-- opcion 1 -->
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <v-card flat>
                        <v-card>
                            <v-card-title>

                                <!-- busqueda -->
                                <v-col cols="6">
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                                        hint="Puede buscar por cualquier campo">
                                    </v-text-field>
                                </v-col>

                            </v-card-title>

                            <!-- tabla de pendientes -->

                            <v-data-table dense :headers="headersPendiente" :items="tutelas" :search="search"
                                item-key="index" :loading="preload" no-data-text="No hay información para mostrar"
                                hide-default-footer>
                                <template v-slot:[`item.afiliado_nombre`]="{ item }">
                                    <span>
                                        {{ obtenerNombreCompletoAfiliado(item.tutela?.afiliado) }}
                                    </span>
                                </template>

                                <template v-slot:[`item.actions`]="{ item }">


                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn icon v-bind="attrs" v-on="on">
                                                <v-icon color="info" @click="VerObservaciones(item)">
                                                    mdi-eye
                                                </v-icon>
                                            </v-btn>
                                        </template>

                                        <span>Ver detalles</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                            <v-row no-gutters>
                                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                        @input="listarTutelasAsignadas()">
                                    </v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                        @change="listarTutelasAsignadas()">
                                    </v-select>
                                </v-col>
                            </v-row>


                        </v-card>
                    </v-card>

                </v-tab-item>

                <!--Cerrados parcialmente-->
                <v-tab-item>
                    <v-card flat>
                        <v-card-title>
                            <v-col cols="6">
                                <!-- busqueda -->
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                                    hint="Puede buscar por cualquier campo">
                                </v-text-field>
                            </v-col>
                        </v-card-title>

                        <!-- Tabla de pendientes cerradas -->
                        <v-data-table dense :headers="headersPendiente" :items="tutelasCerradasTemporal"
                            :search="search" item-key="index" :loading="preload"
                            no-data-text="No hay información para mostrar" hide-default-footer>
                            <template v-slot:[`item.afiliado_nombre`]="{ item }">
                                <span>
                                    {{ obtenerNombreCompletoAfiliado(item.tutela?.afiliado) }}
                                </span>
                            </template>

                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">

                                            <v-icon color="info" @click="VerObservaciones(item)">
                                                mdi-eye
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ver detalles</span>
                                </v-tooltip>

                            </template>
                        </v-data-table>
                        <v-row no-gutters>
                            <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                                <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                    @input="listarTutelaCerradaTemporal()">
                                </v-pagination>
                            </v-col>
                            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                    @change="listarTutelaCerradaTemporal()">
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-tab-item>

                <!-- cerrados totales -->
                <v-tab-item>
                    <v-card flat>
                        <v-card-title>
                            <v-col cols="6">
                                <!-- busqueda -->
                                <v-text-field v-model="search" hint="Puede buscar por cualquier campo"
                                    append-icon="mdi-magnify" label="Buscar" single-line>
                                </v-text-field>
                            </v-col>
                        </v-card-title>

                        <!-- Tabla de pendientes cerradas -->
                        <v-data-table dense :headers="headersPendiente" :items="tutelasCerradas" :search="search"
                            item-key="index" no-data-text="No hay información para mostrar" hide-default-footer>
                            <template v-slot:[`item.afiliado_nombre`]="{ item }">
                                <span>
                                    {{ obtenerNombreCompletoAfiliado(item.tutela?.afiliado) }}
                                </span>
                            </template>

                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="info" @click="VerObservaciones(item)">
                                                mdi-eye
                                            </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Ver detalles</span>
                                </v-tooltip>

                            </template>
                        </v-data-table>
                        <v-row no-gutters>
                            <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                                <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                                    @input="listarTutelasAsignadasCerrada()">
                                </v-pagination>
                            </v-col>
                            <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                    @change="listarTutelasAsignadasCerrada()">
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>


        <!-- ver mas -->
        <v-dialog v-model="dialog" max-width="1500px">
            <v-card flat>
                <template>
                    <v-alert class="text-center" type="info" icon="mdi-account-tie" dense text border="left">Actuación
                    </v-alert>
                    <v-tabs grow>
                        <v-tab>
                            <v-icon left>
                                mdi-bank
                            </v-icon>
                            Actuación constitucional
                        </v-tab>
                        <v-tab>
                            <v-icon left>
                                mdi-account-eye-outline
                            </v-icon>
                            Afiliado
                        </v-tab>
                        <v-tab @click="listarRespuestas()">
                            <v-icon left>
                                mdi-history
                            </v-icon>
                            Historial de respuestas
                        </v-tab>

                        <v-tab-item v-if="detalleActuacion">
                            <v-card flat>
                                <v-card-text>
                                    <v-form>
                                        <v-container fluid>

                                            <v-row dense>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-text-field dense readonly label="Tipo de requerimiento"
                                                        v-model="detalleActuacion.tipo_actuacion.nombre"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="8" md="8">
                                                    <v-text-field dense readonly label="Juzgado"
                                                        v-model="detalleActuacion.tutela.juzgado.nombre"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-text-field dense readonly label="Continuidad"
                                                        v-model="detalleActuacion.continuidad">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-text-field dense readonly label="Exclusión"
                                                        v-model="detalleActuacion.exclusion">
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="4" md="4">
                                                    <v-text-field dense readonly label="Integralidad"
                                                        v-model="detalleActuacion.integralidad"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12">
                                                    <v-autocomplete multiple chips small-chips
                                                        :items="detalleActuacion.proceso" readonly
                                                        :value="detalleActuacion.proceso" dense item-text="nombre"
                                                        label="Responsable">
                                                    </v-autocomplete>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3">
                                                    <v-text-field dense v-model="detalleActuacion.dias"
                                                        label="Dias de Respuesta" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.novedad_registro">
                                                    <v-text-field dense v-model="detalleActuacion.novedad_registro"
                                                        label="Novedad y registro" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3"
                                                    v-if="detalleActuacion.gestion_documental">
                                                    <v-text-field dense v-model="detalleActuacion.gestion_documental"
                                                        label="Gestión documental" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.medicina_laboral">
                                                    <v-text-field dense v-model="detalleActuacion.medicina_laboral"
                                                        label="Medicina laboral" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.reembolso">
                                                    <v-text-field dense v-model="detalleActuacion.reembolso"
                                                        label="Reembolso" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.transporte">
                                                    <v-text-field dense v-model="detalleActuacion.transporte"
                                                        label="Transporte" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.reintegro_laboral">
                                                    <v-text-field dense v-model="detalleActuacion.reintegro_laboral"
                                                        label="Reintegro laboral" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="3" sm="3" md="3" v-if="detalleActuacion.hospitalizacion">
                                                    <v-text-field dense v-model="detalleActuacion.hospitalizacion"
                                                        label="Hospitalización" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="12" md="12" v-if="detalleActuacion.observacion">
                                                    <v-text-field dense v-model="detalleActuacion.observacion"
                                                        label="Observación" readonly>
                                                    </v-text-field>
                                                </v-col>
                                                <v-col sm="12" md="12" lg="12" v-if="detalleActuacion.cup.length > 0">
                                                    <v-card class="pa-2" outlined tile>
                                                        <b>Servicios</b>
                                                        <h5 small v-for="(cup, index) in detalleActuacion.cup"
                                                            :key="index">
                                                            - {{ cup.nombre }}
                                                        </h5>
                                                    </v-card>
                                                </v-col>

                                                <v-col sm="12" md="12" lg="12"
                                                    v-if="detalleActuacion.medicamentos.length > 0">
                                                    <v-card class="pa-2" outlined tile>
                                                        <b>Medicamentos</b>
                                                        <h5 small
                                                            v-for="(medicamento, index) in detalleActuacion.medicamentos"
                                                            :key="index">
                                                            -
                                                            {{ medicamento.codesumi.codigo }}-{{
                                                                medicamento.codesumi.nombre }}
                                                        </h5>
                                                    </v-card>
                                                </v-col>

                                                <v-col sm="12" md="12" lg="12"
                                                    v-if="detalleActuacion.exlusion_actuacion.length > 0">
                                                    <v-card class="pa-2" outlined tile>
                                                        <b>Exclusiones</b>
                                                        <h5 small
                                                            v-for="(exclusion, index) in detalleActuacion.exlusion_actuacion"
                                                            :key="index">
                                                            - {{ exclusion.exclusion }}
                                                        </h5>
                                                    </v-card>
                                                </v-col>
                                                <v-col sm="12" md="12" lg="12"
                                                    v-if="detalleActuacion.adjuntos_tutelas.length > 0">
                                                    <v-btn small
                                                        v-for="(adjuntoR, index) in detalleActuacion.adjuntos_tutelas"
                                                        :key="index">
                                                        <a @click="consultarAdjunto(adjuntoR.ruta)">
                                                            <v-icon left
                                                                color="dark">mdi-cloud-download-outline</v-icon>Adjunto
                                                            {{ index + 1 }}
                                                        </a>
                                                    </v-btn>
                                                </v-col>

                                                <small>Fecha radicación de acción constitucional: </small><b>
                                                    {{ detalleActuacion.fecha_radica }}</b>
                                            </v-row>
                                        </v-container>
                                    </v-form>
                                    <v-spacer></v-spacer>
                                    <v-card>
                                        <v-form v-if="parseInt(detalleActuacion.estado_id) != 17" v-model="esValido">

                                            <v-alert icon="mdi-message-text-outline" dense type="info" text
                                                border="left">Formulario
                                                para
                                                registro de respuesta</v-alert>

                                            <v-col cols="12" sm="4" md="4">
                                                <v-autocomplete hint="Parcial: aún en gestión --- Final: Gestionado"
                                                    persistent-hint v-model="formularioRespuesta.tipo_respuesta" dense
                                                    label="Tipo de respuesta" :items="['Parcial', 'Final']"
                                                    :rules="[validaciones.requerido]"></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea auto-grow dense label="Respuesta"
                                                    v-model="formularioRespuesta.respuesta"
                                                    :rules="[validaciones.requerido]">
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-file-input counter show-size truncate-length="10" v-model="adjuntos"
                                                    small-chips multiple outlined dense label="Adjuntar"
                                                    accept=".jpg, .jpeg, .pdf">
                                                </v-file-input>
                                                <v-alert border="left" colored-border type="error" dense>
                                                    <small>Los archivos deben tener un tamaño máximo de 1GB<p>
                                                            Extensiones
                                                            permitidas:<b><i>jpg,
                                                                    jpeg, pdf</i></b></p></small>
                                                </v-alert>
                                            </v-col>
                                        </v-form>
                                    </v-card>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn v-if="parseInt(detalleActuacion.estado_id) != 17" small color="success"
                                            @click="responderActuacion()">Responder</v-btn>
                                        <v-btn small dark color="error" @click="dialog = false">Cerrar</v-btn>
                                    </v-card-actions>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>

                        <!--Componente datos del afiliado-->
                        <v-tab-item v-if="detalleActuacion">
                            <v-col cols="12" sm="12" md="12">

                                <EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                                    :mostrarClasificaciones="true"></EditarAfiliadoComponente>
                            </v-col>

                        </v-tab-item>

                        <!--Componente historico de respuestas-->
                        <v-tab-item v-if="detalleActuacion">
                            <v-card flat>
                                <v-card-text>
                                    <v-list>
                                        <v-list-item-group color="primary">
                                            <v-list-item v-for="(respuesta, r) in respuestas" :key="r">
                                                <v-list-item-content>
                                                    <v-container class="grey lighten-5">
                                                        <v-row dense class="mb-6" no-gutters>
                                                            <v-col sm="12" md="12" lg="12">
                                                                <v-card class="pa-2" outlined tile>
                                                                    Consecutivo de respuesta <b>{{ r + 1 }}</b>
                                                                    Fecha y hora de registro
                                                                    <b>{{ respuesta.fecha_creacion }}</b>
                                                                    Tipo de respuesta
                                                                    <b>{{ respuesta.tipo_respuesta }}</b>
                                                                    <v-col cols="12">
                                                                        <v-textarea readonly hide-details auto-grow
                                                                            dense v-model="respuesta.respuesta"
                                                                            label="Respuesta"></v-textarea>
                                                                    </v-col>
                                                                    <v-col sm="12" md="12" lg="12">
                                                                        <v-btn small
                                                                            v-for="(adjuntoR, index) in respuesta.adjuntos_tutelas"
                                                                            :key="index">
                                                                            <a @click="consultarAdjunto(adjuntoR.ruta)">
                                                                                <v-icon left
                                                                                    color="dark">mdi-cloud-download-outline</v-icon>Adjunto
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
                                    </v-list>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </template>
            </v-card>
        </v-dialog>

        <!--FIN DIALOGO-->
    </v-card>
</template>
<script>
import moment from 'moment';
import accionConstitucionalComponent from '~/components/tutela/gestion/tutelaComponente.vue';
import EditarAfiliadoComponente from '@/components/afiliado/FormularioAfiliadoComponente.vue';
import { mapActions } from 'vuex';

export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('tutelas.asignada')) {
            return redirect('/');
        }
    },
    components: {

        EditarAfiliadoComponente,
        accionConstitucionalComponent
    },
    data() {
        return {
            esValido: false,
            tab: null,
            totalAsignadas: '...',
            totalCerradasTotal: '...',
            totalCerradasTemporal: '...',
            formularioRespuesta: {
                respuesta: '',
                actuacion_tutela_id: '',
                user_id: '',
                tipo_respuesta: '',
            },
            paginate: {
                total: 0,
                page: 1
            },
            tab: null,
            datos: null,
            preload: false,
            pagina: 1,
            total: 0,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            filtro: {
                nombre: null
            },
            tutelas: [],
            tutelasCerradas: [],
            tutelasCerradasTemporal: [],
            afiliado: {},
            adjuntos: [],
            rutaAdjunto: [],
            respuestas: '',
            detalleActuacion: '',
            cardPersonal: false,
            observacion: false,
            dialog: false,
            estado: null,
            data: null,
            compartir: null,
            search: null,
            value: 1,
            headersPendiente: [{
                text: 'id',
                align: 'center',
                value: 'id'
            },
            {
                text: 'Radicado ',
                align: 'center',
                value: 'tutela.radicado'
            },
            {
                text: 'Entidad ',
                align: 'center',
                value: 'tutela.afiliado.entidad.nombre'
            },
            {
                text: 'Fecha radicación',
                align: 'left',
                value: 'fecha_radica'
            },
            {
                text: 'Municipio radicación',
                value: 'tutela.municipio.nombre',
                align: 'left'
            },
            {
                text: 'Tipo actuación',
                align: 'center',
                value: 'tipo_actuacion.nombre'
            },
            {
                text: 'Documento afiliado',
                align: 'center',
                value: 'tutela.afiliado.numero_documento'
            },
            {
                text: 'Afiliado',
                value: 'afiliado_nombre',
                align: 'center'
            },
            {
                text: 'Accion',
                value: 'actions',
                align: 'center'
            }
            ],
            validaciones: {
                requerido: v => !!v || 'Este campo no puede estar vacío',

            },

        }
    },
    mounted() {
        this.listarTutelasAsignadas()

    },
    computed: {
        sliderColor() {
            switch (this.tab) {
                case 0:

                    return "#ff5252";
                case 1:
                    return "#FF9800";

                case 2:
                    return "#4CAF50";

                default:
                    return "primary";
            }
        },
        Filterdays() {
            return this.tutelas.map(asignada => {
                let dia = this.DiasRestantes(asignada)
                let Cantdia = ''
                if (dia < 0) {
                    Cantdia = 'INMEDIATO'
                } else {
                    Cantdia = (dia) ? `${dia} DÍA(S)` : 'INMEDIATO'
                }
                return {
                    ...asignada,
                    dia,
                    Cantdia
                }
            })
        },
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        listarTutelasAsignadas() {
            if (this.$store.state.auth.usuario.operador == null) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Su usuario no es un operador",
                    type: "error",
                });
            }
            this.setPreload(true)
            this.$axios.post('/actuacion-tutela/listarAsignada?page=' + this.pagina + '&cant=' + this.opcionActual, {
                id: this.$store.state.auth.usuario.operador.user_id
            }).then(
                res => {
                    this.tutelas = res.data.data;
                    this.total = res.data.last_page;
                    this.totalAsignadas = res.data.total

                }).catch(e => {
                    this.$toast.error(e.response.data.error)
                }).finally(() => {
                    this.setPreload(false)
                })
        },

        listarTutelasAsignadasCerrada() {
            if (this.$store.state.auth.usuario.operador == null) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Su usuario no es un operador",
                    type: "error",
                });
            }
            this.setPreload(true)
            this.$axios.post('/actuacion-tutela/listarAsignadaCerrada?page=' + this.pagina + '&cant=' + this.opcionActual, {
                id: this.$store.state.auth.usuario.operador.user_id
            }).then(
                res => {
                    this.tutelasCerradas = res.data.data;
                    this.total = res.data.last_page;
                    this.totalCerradasTotal = res.data.total


                }).catch(e => {
                    this.$toast.error(e.response.data.error)

                }).finally(() => {
                    this.setPreload(false)
                })
        },

        listarTutelaCerradaTemporal() {
            if (this.$store.state.auth.usuario.operador == null) {
                return this.$swal({
                    title: "¡No puede ser!",
                    text: "Su usuario no es un operador",
                    type: "error",
                });
            }
            this.setPreload(true)
            this.$axios.post('/actuacion-tutela/listarAsignadaCerradaTemporal?page=' + this.pagina + '&cant=' + this.opcionActual, {
                id: this.$store.state.auth.usuario.operador.user_id
            }).then(
                (res) => {
                    this.tutelasCerradasTemporal = res.data.res.data;

                    this.total = res.data.res.last_page;
                    this.totalCerradasTemporal = res.data.res.total

                }).catch(e => {
                    this.$toast.error(e.response.data.error)

                }).finally(() => {
                    this.setPreload(false)
                })
        },

        DiasRestantes(asignadas) {

            let dias = asignadas.tipo_requerimientos.dias
            let fechaAsignado = moment(asignadas.created_at);
            let fechaActual = moment();
            let diferenciadays = fechaActual.diff(fechaAsignado, 'days');
            let Total = dias - diferenciadays;
            return Total;

        },

        ColorTd(asignada) {
            if (asignada == 1) {
                return 'yellow black--text';
            }
            if (asignada >= 2) {
                return 'success white--text';
            } else {
                return 'error white--text';
            }
        },

        VerObservaciones(item) {
            this.dialog = true;
            this.consultarAfiliado(item);
            this.detalleActuacion = item

        },


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
            formData.append(`actuacion_tutela_id`, this.detalleActuacion.id);
            formData.append(`user_id`, this.$store.state.auth.usuario.operador.user_id);
            for (let i = 0; i < this.adjuntos.length; i++) {
                formData.append(`adjuntos[]`, this.adjuntos[i]);
            }
            this.$axios.post('/respuesta', formData).then(res => {
                this.$toast.success('Respuesta registrada')
                this.formularioRespuesta = {}
                this.dialog = false
                this.listarTutelasAsignadas()
            })
        },

        listarRespuestas() {
            this.setPreload(true);
            this.$axios.post('/respuesta/listarRespuestas', {
                'actuacion_tutela_id': this.detalleActuacion.id
            }).then(res => {
                this.respuestas = res.data

            }).finally(() => {
                this.setPreload(false);
            })
        },

        async consultarAfiliado(item) {
            this.setPreload(true)
            await this.$axios
                .get(
                    `/afiliados/${item.tutela.afiliado.numero_documento}/${item.tutela.afiliado.tipo_documento}`
                ).then((res) => {
                    this.afiliado = res.data;

                }).catch(error => {

                    this.$toast.error(error.response.data.error);

                }).finally(() => {
                    this.setPreload(false)
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
                console.log(error.Response);
            }
        },

        obtenerNombreCompletoAfiliado(afiliado) {
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
}

</script>

<style scoped>
.pendientes-tab .v-icon,
.pendientes-tab span {
    color: #ff5252 !important;
}

.cerradoParcial-tab .v-icon,
.cerradoParcial-tab span {
    color: #FF9800 !important;
}

.Cerradas-tab .v-icon,
.Cerradas-tab span {
    color: #4CAF50 !important;
}
</style>
