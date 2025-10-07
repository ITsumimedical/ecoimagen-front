<template>
    <div style="width: 100vw">
        <v-col cols="12" md="12" sm="12">
            <v-alert dense text border="left" icon="mdi-calendar-outline" type="info" color="#546E7A">
                <div class="d-flex justify-space-between">
                    Registro de citas del paciente
                    <v-btn small color="warning" @click="dialogDemandaInsatisfecha = true">
                        <v-badge color="#D50000" :content="contadorDemandaInsatisfecha" offset-x="-5" offset-y="4"
                            :value="contadorDemandaInsatisfecha">
                            <b>Demanda Insatisfecha</b>
                        </v-badge>
                    </v-btn>
                </div>
            </v-alert>
            <v-expansion-panels focusable>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        Citas Pendientes
                        <v-badge offset-x="20" offset-y="10" color="#D50000" :value="contadorCitasPendientes"
                            :content="contadorCitasPendientes"></v-badge>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table hide-default-footer disable-pagination
                            no-data-text="El Paciente no tiene citas pendientes" dense
                            :headers="headersConsultasPendientes" :items="consultasPendientes" :loading="loading"
                            :items-per-page="opcionActual">
                            <template v-slot:[`item.user_operador_nombre`]="{ item }">
                                {{ [item.user?.operador?.nombre,
                                item.user?.operador?.apellido].filter(Boolean).join('') }}
                            </template>
                            <template v-slot:[`item.fecha`]="{ item }">
                                {{ item.fecha_hora_inicio?.substring(0, 10) | formatoFecha }}
                            </template>
                            <template v-slot:[`item.hora`]="{ item }">
                                {{ item.fecha_hora_inicio?.substring(11, 20) }}
                            </template>
                            <template v-slot:[`item.estado`]="{ item }">
                                <v-chip small :color="obtenerColorEstado(item.estado.id)">
                                    {{ item.estado.nombre }}
                                </v-chip>
                            </template>
                            <template v-slot:[`item.medicoAgenda`]="{ item }">
                                {{ obtenerUltimoMedico(item.agenda?.medicos) }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <div class="d-flex justify-center">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="cancelarConsulta(item)">
                                                mdi-calendar-remove
                                            </v-icon>
                                        </template>
                                        <span>Cancelar Consulta</span>
                                    </v-tooltip>
                                    <v-tooltip top v-if="item.estado.id !== 59">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="success" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="confirmarConsulta(item)">
                                                mdi-calendar-check
                                            </v-icon>
                                        </template>
                                        <span>Confirmar Consulta</span>
                                    </v-tooltip>
                                    <!-- <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="() => { }">
                                                mdi-calendar-refresh
                                            </v-icon>
                                        </template>
                                        <span>Reasignar Cita</span>
                                    </v-tooltip> -->
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="descargarComporbante(item)">
                                                mdi-file-download-outline
                                            </v-icon>
                                        </template>
                                        <span>Descargar Comprobante</span>
                                    </v-tooltip>
                                    <v-tooltip top v-if="item.cita.requiere_orden === true">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="abrirDetallesOrden(item)">
                                                mdi-comment-eye-outline
                                            </v-icon>
                                        </template>
                                        <span>Ver detalles - Orden</span>
                                    </v-tooltip>
                                </div>
                            </template>
                        </v-data-table>
                        <v-pagination v-model="paginaPendientes" :length="totalPendientes" :total-visible="5"
                            @input="listarConsultasPendientes"></v-pagination>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                        Citas Atendidas, Inasistidas y Canceladas
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-data-table hide-default-footer disable-pagination dense
                            no-data-text="El Paciente no tiene Citas" :loading="loading"
                            :headers="headersConsultasAtendidas"
                            :items="consultasAtendidas.filter(s => s.fecha_hora_inicio)">
                            <template v-slot:[`item.user_operador_nombre`]="{ item }">
                                {{ [item.user?.operador?.nombre,
                                item.user?.operador?.apellido].filter(Boolean).join('') }}
                            </template>
                            <template v-slot:[`item.fecha`]="{ item }">
                                {{ item.fecha_hora_inicio?.substring(0, 10) | formatoFecha }}
                            </template>
                            <template v-slot:[`item.hora`]="{ item }">
                                {{ item.fecha_hora_inicio?.substring(11, 20) }}
                            </template>
                            <template v-slot:[`item.estado`]="{ item }">
                                <v-chip small :color="obtenerColorEstado(item.estado.id)">
                                    {{
                                        item.estado.nombre === "Anulado"
                                            ? "Cancelada"
                                            : item.estado.nombre
                                    }}
                                </v-chip>
                            </template>
                            <template v-slot:[`item.medicoAgenda`]="{ item }">
                                {{ obtenerUltimoMedico(item.agenda?.medicos) }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">

                                <v-tooltip top v-if="item.estado_id == 30">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="warning" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="abrirDetallesCita(item)">
                                            mdi-eye-remove
                                        </v-icon>
                                    </template>
                                    <span>Ver detalle cancelación</span>
                                </v-tooltip>
                                <v-tooltip top
                                    v-if="item.estado_id === 9 && item.consulta_orden_procedimientos.length > 0">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                                            @click="abrirDetalleOrden(item)">
                                            mdi-archive-eye
                                        </v-icon>
                                    </template>
                                    <span>Ver detalle Orden</span>
                                </v-tooltip>


                            </template>
                        </v-data-table>
                        <!-- <v-pagination
              v-model="paginaAtendidas"
              :length="totalAtentidas"
              :total-visible="5"
              @input="listarConsultasAtendidas"
            ></v-pagination> -->

                        <v-col>
                            <v-row no-gutters style="background-color: white">
                                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                                    <v-pagination v-model="paginaAtendidas" :length="totalAtentidas" :total-visible="5"
                                        @input="listarConsultasAtendidas()">
                                    </v-pagination>
                                </v-col>
                                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                                        @change="listarConsultasAtendidas()">
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
        <!-- preload -->
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Procesando Información
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- Modal Demanda Insatisfecha -->
        <v-dialog persistent v-model="dialogDemandaInsatisfecha" max-width="1200px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-document-outline" type="info" color="info">
                    <b>Demanda Insatisfecha</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense no-data-text="El afiliado no tiene Demanda Insatisfecha"
                                :items="demandaInsatisfecha" :headers="headersDemandaInsatisfecha" :loading="loading">
                                <template v-slot:[`item.usuario_operador_nombre`]="{ item }">
                                    {{ [item.usuario?.operador?.nombre,
                                    item.usuario?.operador?.apellido].filter(Boolean).join(' ') }}
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogDemandaInsatisfecha = false" color="error" small>Cerrar</v-btn>
                    <v-btn @click="abrirModalAgregarDemanda" color="success" small>Agregar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal Agregar Demanda Insatisfecha -->
        <v-dialog persistent v-model="dialogAgregarDemanda" max-width="800px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-file-document-plus-outline" type="info" color="info">
                    <b>Agregar Demanda Insatisfecha</b>
                </v-alert>
                <v-card-text>
                    <v-row dense class="mt-4">
                        <v-col cols="12" sm="12" md="6">
                            <v-autocomplete dense label="Especialidad" v-model="formDemandaInsatisfecha.especialidad"
                                return-object item-text="nombre" no-data-text="Cargando..."
                                @change="onEspecialidadChange" :items="especialidades" :loading="loading">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-autocomplete dense label="Cita" v-model="formDemandaInsatisfecha.cita" return-object
                                item-text="nombre" :items="citas"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea auto-grow v-model="formDemandaInsatisfecha.observacion" label="Observaciones">
                            </v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogAgregarDemanda = false" color="error" small>Cerrar</v-btn>
                    <v-btn @click="guardarDemandaInsatisfecha()" color="success" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal Cancelación de Cita -->
        <v-dialog persistent v-model="dialogCancelacionConsulta" max-width="800px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-calendar-remove" type="warning">
                    <b>Cancelar Consulta</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea auto-grow v-model="consultaCancelar.motivoCancelacion"
                                label="Motivo de Cancelación"></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn @click="dialogCancelacionConsulta = false" color="error" small>Cerrar</v-btn>
                    <v-btn @click="confirmarCancelarConsulta()" color="success" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal Detalles de Cita -->
        <v-dialog persistent v-model="dialogDetallesCita" max-width="600px" scrollable>
            <v-card>
                <v-alert dense text border="left" icon="mdi-eye" type="info">
                    <b>Detalles de la Cita</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <span class="d-flex flex-column">
                                <b> Motivo de Cancelación </b>
                                {{ citaSeleccionada?.motivo_cancelacion }}
                            </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <span class="d-flex flex-column">
                                <b> Funcionario Canceló </b>
                                {{
                                    [citaSeleccionada?.funcionario_cancela?.operador?.nombre,
                                    citaSeleccionada?.funcionario_cancela?.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                }}
                            </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <span class="d-flex flex-column">
                                <b> Fecha de cancelación de la cita </b>
                                {{
                                    citaSeleccionada?.updated_at
                                        ? citaSeleccionada.updated_at.substring(0, 10)
                                        : ""
                                }}
                            </span>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <v-btn @click="dialogDetallesCita = false" color="error" small>Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalOrdenDetalle" max-width="900px">

            <v-card>
                <v-alert dense text color="primary" icon="mdi-archive-check-outline">
                    <b>Detalle Orden usada</b>
                </v-alert>
                <v-card-text>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">N° Orden</b>
                        <br />
                        <p class="text-body-2">{{ ordenUsuada?.orden_procedimiento?.orden_id }}</p>
                    </span>
                    <v-divider></v-divider>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">Tipo de Orden</b>
                        <br />
                        <p class="text-body-2">{{ verTipoOrden(ordenUsuada?.orden_procedimiento?.orden?.tipo_orden_id)
                        }}</p>
                    </span>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">Cantidad usada</b>
                        <br />
                        <p class="text-body-2">{{ ordenUsuada?.orden_procedimiento?.cantidad }}</p>
                    </span>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">Usuario asigna</b>
                        <br />
                        <p class="text-body-2">{{
                            ordenUsuada?.orden_procedimiento?.orden?.user?.operador?.nombre_completo }}
                        </p>
                    </span>
                    <v-divider></v-divider>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">Servicio</b>
                        <br />
                        <p class="text-body-2">
                            {{ ordenUsuada?.orden_procedimiento?.cup?.codigo_nombre }}
                        </p>
                    </span>
                    <span>
                        <b class="text-subtitle-1 font-weight-bold">Observación(es)</b>
                        <br />
                        <p class="text-body-2">
                            {{ ordenUsuada?.orden_procedimiento?.observacion }}
                        </p>
                    </span>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="modalOrdenDetalle = false" color="error">
                        cerrar <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>

            </v-card>

        </v-dialog>



        <!-- Modal Detalles Orden -->
        <detallesOrdenConsulta :consultaActiva="citaSeleccionada" :mostrarDetallesOrden.sync="mostrarDetallesOrden" />
    </div>
</template>

<script>
import detallesOrdenConsulta from "@/components/afiliado/detallesOrdenConsulta.vue";
import moment from "moment";
moment.locale("es");

export default {
    props: {
        afiliadoId: {
            type: Number,
            required: true,
        },
    },
    components: {
        detallesOrdenConsulta,
    },
    data() {
        return {
            loading: false,
            preload: false,
            contadorCitasPendientes: null,
            consultasPendientes: [],
            consultasAtendidas: [],
            modalCitas: false,
            headersConsultasPendientes: [{
                text: "Especialidad",
                value: "cita.especialidad.nombre"
            },
            {
                text: "Cita",
                value: "cita.nombre"
            },
            {
                text: "Fecha",
                value: "fecha"
            },
            {
                text: "Hora",
                value: "hora"
            },
            {
                text: "Sede",
                value: "agenda.consultorio.rep.nombre"
            },
            {
                text: "Funcionario Asigna",
                value: "user_operador_nombre"
            },
            {
                text: "Consultorio",
                value: "agenda.consultorio.nombre"
            },
            {
                text: "Médico",
                value: "medicoAgenda",
            },
            {
                text: "Estado",
                value: "estado"
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            },
            ],
            headersConsultasAtendidas: [{
                text: "Especialidad",
                value: "cita.especialidad.nombre"
            },
            {
                text: "Cita",
                value: "cita.nombre"
            },
            {
                text: "Fecha",
                value: "fecha"
            },
            {
                text: "Hora",
                value: "hora"
            },
            {
                text: "Sede",
                value: "agenda.consultorio.rep.nombre"
            },
            {
                text: "Funcionario Asigna",
                value: "user_operador_nombre"
            },
            {
                text: "Consultorio",
                value: "agenda.consultorio.nombre"
            },
            {
                text: "Médico",
                value: "medicoAgenda"
            },
            {
                text: "Estado",
                value: "estado"
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            },
            ],
            demandaInsatisfecha: [],
            contadorDemandaInsatisfecha: null,
            dialogDemandaInsatisfecha: false,
            opciones: [5, 10, 20, 50, 100],
            opcionActual: 5,
            headersDemandaInsatisfecha: [{
                text: "Especialidad",
                value: "especialidad.nombre"
            },
            {
                text: "Cita",
                value: "cita.nombre"
            },
            {
                text: "Observación",
                value: "observacion"
            },
            {
                text: "Fecha de Registro",
                value: "fecha_registro"
            },
            {
                text: "Usuario registra",
                value: "usuario_operador_nombre"
            },
            {
                text: "Correo usuario registra",
                value: "usuario.email"
            },
            ],
            dialogAgregarDemanda: false,
            formDemandaInsatisfecha: {
                observacion: null,
                especialidad: null,
                cita: null,
            },
            citas: [],
            especialidades: [],
            paginaAtendidas: 1,
            totalAtentidas: 0,
            paginaPendientes: 1,
            totalPendientes: 0,
            dialogCancelacionConsulta: false,
            consultaCancelar: {
                id: null,
                motivoCancelacion: null,
            },
            dialogDetallesCita: false,
            citaSeleccionada: {},
            mostrarDetallesOrden: false,
            modalOrdenDetalle: false,
            ordenUsuada: {}
        };
    },
    mounted() {
        this.recargarDatos();
    },
    filters: {
        formatoFecha(fecha) {
            return moment(fecha).format("dddd, D MMMM, YYYY");
        },

        formatoHora(Hora_Inicio) {
            return moment(Hora_Inicio).format("hh:mm A");
        },
    },
    methods: {
        // Se usa para obtener el médico principal de la agenda (Grupales)
        obtenerUltimoMedico(medicos) {
            if (medicos && medicos.length > 0) {
                const operador = medicos[medicos.length - 1].operador;
                return [operador?.nombre, operador?.apellido].filter(Boolean).join(' ') || "No disponible";
            }
            return "No disponible";
        },

        contarCitasPendientes() {
            this.$axios
                .get(`/consultas/contadorConsultaPendientes/${this.afiliadoId}`)
                .then((res) => {
                    this.contadorCitasPendientes = res.data;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar la cantidad de citas pendientes"
                    );
                    console.log(error);
                });
        },
        listarConsultasPendientes() {
            this.loading = true;
            this.$axios
                .get(`/consultas/consultasPendientesPaciente/${this.afiliadoId}`, {
                    params: {
                        page: this.paginaPendientes,
                        per_page: 10,
                    },
                })
                .then((res) => {
                    this.consultasPendientes = res.data.data;
                    this.totalPendientes = res.data.last_page;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las consultas pendientes"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        listarConsultasAtendidas() {
            this.loading = true;
            this.$axios
                .get(`/consultas/consultasAtendidasPaciente/${this.afiliadoId}`, {
                    params: {
                        page: this.paginaAtendidas,
                        per_page: this.opcionActual,
                    },
                })
                .then((res) => {
                    this.consultasAtendidas = res.data.data;
                    this.totalAtentidas = res.data.last_page;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las consultas atendidas"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        obtenerColorEstado(estadoId) {
            switch (estadoId) {
                case 30:
                    return "warning";
                case 8:
                    return "info";
                case 9:
                    return "success";
                case 10:
                    return "warning";
                case 13:
                    return "info";
                case 59:
                    return "success";
                case 67:
                    return "purple lighten-2";
                default:
                    return "gray";
            }
        },

        cancelarConsulta(item) {
            // console.log('CONSULTA',item);
            this.dialogCancelacionConsulta = true;
            this.consultaCancelar.id = item.id;
        },

        confirmarCancelarConsulta() {
            if (!this.consultaCancelar.motivoCancelacion) {
                return this.$toast.error(
                    "Debes ingresar un motivo de cancelación para la consulta"
                );
            }
            this.preload = true;
            const data = {
                consulta: this.consultaCancelar.id,
                afiliado: this.afiliadoId,
                motivoCancelacion: this.consultaCancelar.motivoCancelacion,
            };
            this.$axios
                .post("/consultas/cancelar", data)
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.recargarDatos();
                    this.dialogCancelacionConsulta = false;
                    this.consultaCancelar = {
                        id: null,
                        motivoCancelacion: null,
                    };
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        confirmarConsulta(item) {

            if (item.estado.id === 9) {
                this.validarEstado();
                return false;
            }


            this.$swal({
                title: "Esta Seguro?",
                text: "Confirmar Cita Asignada",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
            }).then((res) => {
                if (res.value) {
                    this.preload = true;
                    const data = {
                        consulta: item.id,
                        afiliado: this.afiliadoId,
                        estado: item.estado.id,
                    };
                    this.$axios
                        .post("/consultas/confirmar", data)
                        .then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.recargarDatos();
                        })
                        .catch((error) => {
                            this.$toast.error(error.response.data.error);
                        })
                        .finally(() => {
                            this.preload = false;
                        });
                }
            });
        },

        validarEstado() {
            this.$swal({
                type: "error",
                title: "Oops...",
                text: "¡ Esta Cita ya ha sido Confirmada !",
            });
        },


        descargarComporbante(item) {
            const data = {
                afiliado_id: this.afiliadoId,
                id: item.agenda_id,
            };
            this.preload = true;
            this.$axios
                .post("/agenda/generarPdf", data, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurrió un error al descargar el comprobante de cita"
                    );
                    console.log(error);
                })
                .finally(() => {
                    this.preload = false;
                });
        },

        abrirModalAgregarDemanda() {
            this.listarEspecialidadesConCitas();
            this.dialogAgregarDemanda = true;
        },

        listarDemandaInsatisfecha() {
            this.$axios
                .get(`/demanda-insatisfecha/listar/${this.afiliadoId}`)
                .then((res) => {
                    this.demandaInsatisfecha = res.data;
                    this.contadorDemandaInsatisfecha = res.data.length;
                })
                .catch((error) => {
                    this.$toast.error(
                        "Ocurió un error al carga las demanda insatisfecha"
                    );
                    console.log(error);
                });
        },

        guardarDemandaInsatisfecha() {
            const validaciones = {
                observacion: "La observación es requerida",
                especialidad: "La especialidad es requerida",
                cita: "La cita es requerida",
            };

            for (let campo in validaciones) {
                if (!this.formDemandaInsatisfecha[campo]) {
                    this.$toast.error(validaciones[campo]);
                    return;
                }
            }
            const data = {
                cita_id: this.formDemandaInsatisfecha.cita.id,
                especialidad_id: this.formDemandaInsatisfecha.especialidad.id,
                observacion: this.formDemandaInsatisfecha.observacion,
                afiliado_id: this.afiliadoId,
            };

            this.loading = true;

            this.$axios
                .post("/demanda-insatisfecha/crear", data)
                .then((res) => {
                    this.formDemandaInsatisfecha = {};
                    this.dialogAgregarDemanda = false;
                    this.$toast.success(res.data.mensaje);
                    this.listarDemandaInsatisfecha();
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.mensaje);
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        recargarDatos() {
            this.listarConsultasPendientes();
            this.contarCitasPendientes();
            this.listarConsultasAtendidas();
            this.listarDemandaInsatisfecha();
        },

        listarEspecialidadesConCitas() {
            this.loading = true;
            this.$axios
                .get("/especialidades/listarEspecialidadesConMedicos")
                .then((res) => {
                    this.especialidades = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrio un error al cargar las especialidades");
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        onEspecialidadChange() {
            this.listarCitasEspecialidad();
        },

        listarCitasEspecialidad() {
            const especialidadSeleccionada =
                this.formDemandaInsatisfecha.especialidad?.id;
            const especialidad = this.especialidades.find(
                (e) => e.id === especialidadSeleccionada
            );
            this.citas = especialidad ? especialidad.citas : [];
        },

        abrirDetallesCita(item) {
            this.citaSeleccionada = item;
            this.dialogDetallesCita = true;
        },

        abrirDetallesOrden(item) {
            this.citaSeleccionada = item;
            this.mostrarDetallesOrden = true;
        },

        abrirDetalleOrden(item) {
            this.ordenUsuada = item.consulta_orden_procedimientos[0]
            this.modalOrdenDetalle = true;
        },

        verTipoOrden(tipoOrden) {
            // Removed console.log for production
            switch (tipoOrden) {
                case 1:
                    return 'Medicamentos'
                case 2:
                    return 'Servicios'
                case 3:
                    return 'Otros Servicios'
                case 4:
                    return 'Paquetes'
                default:
                    return 'Desconocido'
            }
        }
    },
};

</script>
