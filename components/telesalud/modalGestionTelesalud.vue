<template>
    <div>
        <v-dialog v-model="mostrarModalGestion" persistent max-width="1200px">
            <v-card>
                <v-alert text dense border="left" color="info" icon="mdi-book-alert-outline" class="text-center">
                    <b>Gestionar Telesalud</b>
                </v-alert>
                <v-card-text>
                    <v-row dense v-if="telesaludPorGestionar">
                        <v-col cols="12" sm="12" md="12">
                            <EditarAfiliadoComponente v-if="telesaludPorGestionar.afiliado"
                                :afiliado="telesaludPorGestionar.afiliado" :modoDetalle="true" :modoEdicion="true"
                                :mostrarClasificaciones="true" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="info" icon="mdi-account-details-outline"
                                class="text-center">
                                <b>Detalles {{ telesaludPorGestionar.tipo_estrategia }}</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <div style="
                  display: flex;
                  justify-content: space-between;
                  width: 100%;
                  align-items: center;
                  padding-right: 0.5rem;
                ">
                                <span>
                                    <b class="text-subtitle-1 font-weight-bold">Especialidad</b>
                                    <br />
                                    <p class="text-body-1 mb-0">
                                        {{ telesaludPorGestionar?.especialidad?.nombre }}
                                    </p>
                                    <br />
                                </span>
                                <v-btn small dark color="warning"
                                    v-if="mostrarBotonResponder && $can('teleapoyo.cambiar.especialidad')"
                                    @click="abrirModalEspecialidad">
                                    Cambiar Especialidad
                                </v-btn>
                            </div>
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Tipo de Solicitud</b>
                                <br />
                                <p class="text-body-1 mb-0">
                                    {{ telesaludPorGestionar?.tipo_solicitud?.nombre }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Motivo Interconsulta</b>
                                <br />
                                <p class="text-body-1 mb-0">
                                    {{ telesaludPorGestionar?.motivo_teleorientacion }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Resumen Historia Clínica</b>
                                <br />
                                <p class="text-body-1 mb-0">
                                    {{ telesaludPorGestionar?.resumen_historia_clinica }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Diagnósticos</b>
                                <br />
                                <v-chip dark small color="green darken-1" class="ma-1"
                                    v-for="item in telesaludPorGestionar.cie10s" :key="item.id">
                                    {{ item.Codigo_Nombre }}
                                </v-chip>
                                <br />
                            </span>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Archivos Adjuntos</b>
                                <br />
                                <v-btn small @click="consultarAdjunto(item.ruta)" dark class="ma-1"
                                    v-for="(item, index) in telesaludPorGestionar.adjuntos" :key="item.id"
                                    color="primary">Adjunto
                                    {{ index + 1 }}</v-btn>
                                <br />
                            </span>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="telesaludPorGestionar">
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline"
                                class="text-center">
                                <v-row dense align="center">
                                    <v-col class="grow">
                                        <b>Ordenamiento</b>
                                    </v-col>
                                    <v-row class="shrink">
                                        <v-btn v-if="mostrarBotonResponder" color="primary" small
                                            @click="abrirOrdenamiento()" class="mr-2">
                                            Ordenar
                                            <v-icon right small>mdi-plus</v-icon>
                                        </v-btn>
                                    </v-row>
                                </v-row>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headersOrdenamiento" :items="ordenesConsulta"
                                :loading="loading.tablaOrdenamiento" loading-text="Cargando... Por favor espere"
                                no-data-text="No se encontraron resultados">
                                <template v-slot:[`item.estado`]="{ item }">
                                    <v-chip small dark :color="obtenerColor(item.estado.id)">{{
                                        item.estado.nombre
                                        }}</v-chip>
                                </template>

                                <template v-if="mostrarBotonResponder" v-slot:[`item.acciones`]="{ item }">
                                    <div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      gap: 0.4rem;
                    ">
                                        <v-tooltip bottom v-if="[1, 4, 34].includes(item.estado.id)">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on" color="success"
                                                    @click="descargarOrden(item)">
                                                    mdi-file-download
                                                </v-icon>
                                            </template>
                                            <span>Descargar Orden</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="![5].includes(item.estado.id)">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon v-bind="attrs" v-on="on" color="error"
                                                    @click="abrirModalAnular(item)">
                                                    mdi-close-circle-outline
                                                </v-icon>
                                            </template>
                                            <span>Anular Orden</span>
                                        </v-tooltip>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                    <v-form ref="formRespuestaEspecialista" v-if="telesaludPorGestionar">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-alert text dense border="left" type="info" icon="mdi-message-alert-outline"
                                    class="text-center">
                                    <b>Respuesta Especialista</b>
                                </v-alert>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-select dense v-model="vModelSeleccionado.pertinencia_prioridad"
                                    :items="opcionesPrioridad" label="Prioridad" outlined
                                    :rules="[(v) => !!v || 'Este campo es requerido']" :readonly="esTeleapoyo">
                                </v-select>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-select dense v-model="vModelSeleccionado.pertinencia_evaluacion"
                                    :items="opcionesEvaluacionPertinencia" label="Evaluación - Pertinencia de Solicitud"
                                    outlined :rules="[(v) => !!v || 'Este campo es requerido']"
                                    :readonly="esTeleapoyo"></v-select>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow dense v-model="vModelSeleccionado.respuesta" label="Observación"
                                    outlined :rules="[
                                        (v) => !!v || 'Este campo es requerido',
                                        (v) => v.length >= 10 || 'Mínimo 10 caracteres',
                                        (v) => v.length <= 500 || 'Máximo 500 caracteres',
                                    ]" :readonly="esTeleapoyo"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
                    <v-btn v-if="mostrarBotonResponder" color="success" dark small
                        @click="guardarRespuestaEspecialista()">
                        Responder</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Ordenamiento -->
        <Ordenamiento :consulta="teleapoyo.consulta_id" :habilitarBoton="false" :dialog="mostrarOrdenamiento"
            @respuestaComponente="cerrarOrdenamiento" />

        <!-- Cambiar especialidad -->
        <modalCambiarEspecialidad :mostrar-modal-especialidad.sync="mostrarModalEspecialidad"
            :teleapoyo="teleapoyoSeleccionado" @buscarTeleapoyo="buscarTeleapoyo" />

        <!-- Anular -->
        <modalAnularOrden :mostrar-modal-anular.sync="mostrarModalAnular" :item="ordenSeleccionada"
            @buscarOrdenes="buscarOrdenes" />
    </div>
</template>
<script>
import {
    mapActions
} from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import modalCambiarEspecialidad from "@/components/telesalud/modalCambiarEspecialidad.vue";
import modalAnularOrden from "@/components/telesalud/modalAnularOrden.vue";

export default {
    props: {
        mostrarModalGestion: {
            type: Boolean,
            default: false,
        },
        teleapoyo: {
            type: Object,
            default: () => { },
        },
        mostrarBotonResponder: {
            type: Boolean,
            default: true,
        },
        banderaRespuestaEspecialista: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        EditarAfiliadoComponente,
        modalCambiarEspecialidad,
        modalAnularOrden,
    },
    data() {
        return {
            telesaludPorGestionar: {},
            headersOrdenamiento: [{
                text: "Tipo",
                align: "center",
                value: "tipo",
            },
            {
                text: "Código",
                align: "center",
                value: "codigo",
            },
            {
                text: "Nombre",
                align: "center",
                value: "nombreCodigo",
            },
            {
                text: "Cantidad",
                align: "center",
                value: "cantidad",
            },
            {
                text: "Paginación",
                align: "center",
                value: "paginacion",
            },
            {
                text: "Observaciones",
                align: "center",
                value: "observacion",
            },
            {
                text: "Estado",
                align: "center",
                value: "estado",
            },
            {
                text: "Acciones",
                align: "center",
                value: "acciones",
                sortable: false,
            },
            ],
            ordenesConsulta: [],
            loading: {
                tablaOrdenamiento: false,
            },
            mostrarOrdenamiento: false,
            teleapoyoSeleccionado: {},
            mostrarModalEspecialidad: false,
            ordenSeleccionada: {},
            mostrarModalAnular: false,
            formRespuesta: {
                respuesta: "",
                pertinencia_prioridad: "",
                pertinencia_evaluacion: "",
            },
            opcionesPrioridad: ["Pertinente", "No pertinente"],
            opcionesEvaluacionPertinencia: ["Pertinente", "No pertinente"],
        };
    },
    computed: {
        // Computada que elige entre formRespuesta o teleapoyo el v-model según la bandera
        vModelSeleccionado() {
            return this.banderaRespuestaEspecialista ? this.teleapoyo : this.formRespuesta;
        },
        esTeleapoyo() {
            return this.banderaRespuestaEspecialista;
        }
    },
    watch: {
        mostrarModalGestion(newValue) {
            if (newValue) {
                this.buscarTeleapoyo(this.teleapoyo.id);
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.telesaludPorGestionar = {};
            this.$emit("update:mostrarModalGestion", false);
        },

        buscarTeleapoyo(teleapoyoId) {
            this.setPreload(true);

            this.$axios
                .get(`/teleapoyo/buscarTeleapoyo/${teleapoyoId}`)
                .then((res) => {
                    this.telesaludPorGestionar = res.data;
                    this.buscarOrdenes(res.data.consulta_id);
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los datos");
                })
                .finally(() => {
                    this.setPreload(false);
                });
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

        buscarOrdenes() {
            this.loading.tablaOrdenamiento = true;
            this.$axios
                .get(
                    `/ordenamiento/detalleOrdenamientoPorConsulta/${this.teleapoyo.consulta_id}`
                )
                .then((res) => {
                    this.ordenesConsulta = res.data.map((item) => {
                        switch (item.tipo) {
                            case "medicamento":
                                return {
                                    tipo: "Medicamento",
                                    codigo: item.codesumi.codigo,
                                    nombreCodigo: item.codesumi.nombre,
                                    cantidad: item.dosificacion,
                                    paginacion: item.paginacion,
                                    observacion: item.observacion,
                                    estado_id: item.estado_id,
                                    codesumi_id: item.codesumi_id,
                                    id: item.id,
                                    orden_id: item.orden_id,
                                    estado: item.estado,
                                };
                            case "servicio":
                                return {
                                    tipo: "Servicio",
                                    codigo: item.cup.codigo,
                                    nombreCodigo: item.cup.nombre,
                                    cantidad: item.cantidad,
                                    paginacion: "No Aplica",
                                    observacion: item.observacion,
                                    estado_id: item.estado_id,
                                    cup_id: item.cup_id,
                                    id: item.id,
                                    orden_id: item.orden_id,
                                    estado: item.estado,
                                };
                            default:
                                break;
                        }
                    });
                })
                .catch((e) => {
                    console.log(e);
                    this.$toast.error("Error al cargar las ordenes");
                })
                .finally(() => {
                    this.loading.tablaOrdenamiento = false;
                });
        },

        alertColor() {
            return this.mostrarBotonResponder ? 'success' : 'info';
        },
        // Computed para el texto del alert
        alertText() {
            return this.mostrarBotonResponder ? 'Información - Telesalud' : 'Gestionar Telesalud';
        },
        obtenerColor(estadoId) {
            switch (estadoId) {
                case 1:
                case 4:
                case 34:
                    return "success";
                case 3:
                case 10:
                case 18:
                case 44:
                    return "warning";
                case 5:
                case 20:
                case 21:
                case 30:
                case 35:
                case 29:
                case 43:
                    return "error";
                case 14:
                case 54:
                    return "primary";
                default:
                    return "grey";
            }
        },

        abrirOrdenamiento() {
            this.mostrarOrdenamiento = true;
        },

        cerrarOrdenamiento() {
            this.mostrarOrdenamiento = false;
            this.buscarOrdenes(this.telesaludPorGestionar.consulta_id);
        },

        abrirModalEspecialidad() {
            console.log("AAAAAA");
            this.teleapoyoSeleccionado = this.telesaludPorGestionar;
            this.mostrarModalEspecialidad = true;
        },

        descargarOrden(item) {
            const data = {
                tipo: item.tipo === "Servicio" ? "servicio" : "medicamento",
                id: item.orden_id,
                filtro: item.estado.id,
                detalles: {
                    id: item.id,
                },
            };

            this.setPreload(true);

            this.$axios
                .post("/pdf", data, {
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
                .catch((e) => {
                    this.$toast.error("Error al generar el archivo");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalAnular(item) {
            this.ordenSeleccionada = item;
            this.mostrarModalAnular = true;
        },

        guardarRespuestaEspecialista() {
            if (!this.$refs.formRespuestaEspecialista.validate()) {
                return;
            }

            this.setPreload(true);

            this.$axios
                .put(`/teleapoyo/responder/${this.teleapoyo.id}`, this.formRespuesta)
                .then(() => {
                    this.$toast.success("Respuesta guardada correctamente");
                    this.limpiarRespuesta();
                    this.cerrarModal();
                    this.$emit("listarTeleapoyosPendientes");
                })
                .catch((e) => {
                    this.$toast.error("Error al guardar la respuesta");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiarRespuesta() {
            this.formRespuesta = {
                pertinencia_evaluacion: "",
                pertinencia_prioridad: "",
                respuesta: "",
            };
            this.$refs.formRespuestaEspecialista.resetValidation();
        },
    },
};

</script>
