<template>
    <div>
        <v-dialog v-model="mostrarModalPendiente" persistent max-width="1400px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline"
                    class="text-center">
                    <b>Gestionar Telesalud N° {{ telesaludSeleccionada?.id }}</b>
                </v-alert>
                <v-card-text>
                    <v-row dense v-if="telesalud">
                        <v-col cols="12" md="12" sm="12">
                            <EditarAfiliadoComponente v-if="telesalud.afiliado" :afiliado="telesalud.afiliado"
                                :modoDetalle="true" :modoEdicion="true" :mostrarClasificaciones="true" />
                        </v-col>
                    </v-row>
                    <v-row dense v-if="telesalud">
                        <v-col cols="12" md="12" sm="12" class="my-2">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense border="left" type="info" icon="mdi-file-document-alert-outline"
                                class="text-center">
                                <b>Detalles {{ telesalud?.tipo_estrategia?.nombre }}</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <div
                                style="display: flex;justify-content: space-between;width: 100%;align-items: center;padding-right: 0.5rem;">
                                <span>
                                    <b class="text-subtitle-1 font-weight-bold">Especialidad</b>
                                    <br />
                                    <p class="text-body-1 mb-0">
                                        {{ telesalud?.especialidad?.nombre }}
                                    </p>
                                    <br />
                                </span>
                                <v-btn small dark color="warning" v-if="$can('telesalud.cambiar.especialidad')"
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
                                    {{ telesalud?.tipo_solicitud?.nombre }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Motivo</b>
                                <br />
                                <p class="text-body-1 mb-0">
                                    {{ telesalud?.motivo }}
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
                                    {{ telesalud?.resumen_hc }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" v-if="telesalud?.consulta?.cie10_afiliado">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Diagnósticos</b>
                                <br />
                                <v-chip dark small :color="item?.esprimario ? 'green darken-1' : 'primary'" class="ma-1"
                                    v-for="item in telesalud?.consulta?.cie10_afiliado" :key="item.id">
                                    {{ item?.cie10?.Codigo_Nombre }}&nbsp;
                                    <b>
                                        {{ item?.esprimario ? " - PRINCIPAL" : "" }}
                                    </b>
                                </v-chip>
                                <br />
                            </span>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" v-if="gestionCreacion">
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Archivos Adjuntos</b>
                                <br />
                                <v-btn small dark class="ma-1" v-for="item in gestionCreacion?.adjuntos" :key="item.id"
                                    color="blue-grey" @click="consultarAdjunto(item.ruta)">
                                    {{ item.nombre }}
                                </v-btn>
                                <br />
                            </span>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="telesalud">
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline"
                                class="text-center">
                                <v-row dense align="center">
                                    <v-col class="grow">
                                        <b>Ordenamiento</b>
                                    </v-col>
                                    <v-row class="shrink">
                                        <v-btn color="primary" small @click="abrirOrdenamiento()" class="mr-2">
                                            Ordenar
                                            <v-icon right small>mdi-plus</v-icon>
                                        </v-btn>
                                    </v-row>
                                </v-row>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headersOrdenamiento" :items="ordenesConsultaTelesalud"
                                :loading="loading.tablaOrdenamiento" loading-text="Cargando... Por favor espere"
                                no-data-text="No se encontraron resultados">
                                <template v-slot:[`item.estado`]="{ item }">
                                    <v-chip small dark :color="obtenerColorEstado(item.estado.id)">{{ item.estado.nombre
                                    }}</v-chip>
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
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
                    </v-row>
                    <v-form ref="formRespuestaJunta" v-if="telesalud">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12" class="mt-2">
                                <v-divider></v-divider>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-alert text dense border="left" type="info" icon="mdi-account-group-outline"
                                    class="text-center">
                                    <b>Respuesta - Junta Profesionales</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select dense outlined v-model="formRespuesta.prioridad" :items="opcionesPertinencia"
                                    label="Prioridad *" :rules="[rules.obligatorio]"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select dense outlined v-model="formRespuesta.pertinencia_solicitud"
                                    :items="opcionesPertinencia" label="Evaluación - Pertinencia de la Solicitud *"
                                    :rules="[rules.obligatorio]"></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow dense outlined v-model="formRespuesta.observacion"
                                    label="Observación *" :rules="[rules.obligatorio, rules.min]"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense outlined label="Integrantes *" v-model="formRespuesta.integrantes"
                                    :items="opcionesIntegrantes" :loading="loading.opcionesIntegrantes"
                                    item-text="nombre_completo" item-value="user_id" multiple clearable chips
                                    deletable-chips small-chips :rules="[rules.integrantesMinimos]"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-autocomplete dense outlined label="Institución Prestadora *"
                                    v-model="formRespuesta.institucion_prestadora"
                                    :items="opcionesInstitucionPrestadora"
                                    :loading="loading.opcionesInstitucionPrestadora" item-text="nombre" item-value="id"
                                    :rules="[rules.obligatorio]" :search-input.sync="campoBusquedaInsitucionPrestadora"
                                    no-data-text="Digite el nombre de la institución para iniciar la búsqueda."></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-autocomplete dense outlined label="EAPB *" v-model="formRespuesta.eapb"
                                    :items="opcionesEAPB" :loading="loading.opcionesEAPB" item-text="nombre"
                                    item-value="id" :rules="[rules.obligatorio]" :search-input.sync="campoBusquedaEAPB"
                                    no-data-text="Digite el nombre de la institución para iniciar la búsqueda."></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow v-model="formRespuesta.evaluacion_junta"
                                    label="Evaluación Junta Profesionales *"
                                    :rules="[rules.obligatorio, rules.min]"></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-radio-group v-model="formRespuesta.junta_aprueba"
                                    label="¿LA JUNTA DE PROFESIONALES DE SALUD APRUEBA?" :rules="[rules.obligatorio]">
                                    <v-radio v-for="item in opcionesAprobacionJunta" :key="item" :label="`${item}`"
                                        :value="item" color="primary">
                                    </v-radio>
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-radio-group v-model="formRespuesta.clasificacion_prioridad"
                                    label="CLASIFICACIÓN DE PRIORIDAD DE SERVICIO AMBULATORIO"
                                    :rules="[rules.obligatorio]">
                                    <v-radio v-for="item in opcionesClasificacionPrioridad" :key="item"
                                        :label="`${item}`" :value="item" color="primary">
                                    </v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal">Cerrar</v-btn>
                    <v-btn color="success" small dark @click="enviarFormulario">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Cambiar Especialidad -->
        <modalCambiarEspecialidad :mostrarModalEspecialidad.sync="mostrarModalEspecialidad" :telesalud="telesalud"
            @recargarTelesalud="recargarTelesalud()" />

        <!-- Ordenamiento -->
        <Ordenamiento :consulta="telesalud.consulta_id" :habilitarBoton="false" :dialog="mostrarOrdenamiento"
            @respuestaComponente="cerrarOrdenamiento" />

        <!-- Anular -->
        <modalAnularOrden :mostrarModalAnular.sync="mostrarModalAnular" :item="ordenSeleccionada"
            @buscarOrdenes="buscarOrdenesTeleconsulta(telesalud.consulta_id)" />
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import modalCambiarEspecialidad from "@/components/telesalud/modalCambiarEspecialidad.vue";
import Ordenamiento from "@/components/ordenamiento/ordenamiento.vue";
import modalAnularOrden from "@/components/telesalud/modalAnularOrden.vue";

export default {
    components: {
        EditarAfiliadoComponente,
        modalCambiarEspecialidad,
        modalAnularOrden,
        Ordenamiento,
    },
    props: {
        mostrarModalPendiente: {
            type: Boolean,
            default: false,
        },
        telesaludSeleccionada: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            telesalud: {},
            mostrarModalEspecialidad: false,
            formRespuesta: {
                prioridad: "",
                pertinencia_solicitud: "",
                observacion: "",
                integrantes: [],
                institucion_prestadora: null,
                eapb: null,
                evaluacion_junta: "",
                junta_aprueba: null,
                clasificacion_prioridad: null,
            },
            mostrarOrdenamiento: false,
            loading: {
                tablaOrdenamiento: false,
                opcionesIntegrantes: false,
                opcionesInstitucionPrestadora: false,
                opcionesEAPB: false,
            },
            headersOrdenamiento: [
                {
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
            ordenesConsultaTelesalud: [],
            mostrarModalAnular: false,
            ordenSeleccionada: {},
            opcionesIntegrantes: [],
            opcionesInstitucionPrestadora: [],
            opcionesEAPB: [],
            opcionesAprobacionJunta: ["SI", "NO", "NO REQUIERE JUNTA"],
            opcionesClasificacionPrioridad: [
                "PRIORIZADO (Notificar en 24 horas)",
                "NO PRIORIZADO (Notificar en 5 días)",
            ],
            campoBusquedaInsitucionPrestadora: null,
            campoBusquedaEAPB: null,
            rules: {
                integrantesMinimos: (value) =>
                    (value && value.length > 0) || "Debe agregar al menos un integrante",
                obligatorio: (v) => !!v || "Este campo es obligatorio.",
                min: (v) =>
                    v.length >= 10 || "Este campo debe tener al menos 10 caracteres",
            },
            opcionesPertinencia: ["Pertinente", "No pertinente"],
        };
    },
    computed: {
        gestionCreacion() {
            // Filtra por la gestion de la creacion para obtener solo esta y sus adjuntos
            if (this.telesalud?.gestiones) {
                return this.telesalud?.gestiones.find(
                    (gestion) => gestion.tipo_id === 45
                );
            }

            return null;
        },
    },
    watch: {
        mostrarModalPendiente(newValue) {
            if (newValue) {
                this.listarDetallesTelesalud(this.telesaludSeleccionada);
                this.listarOpcionesIntegrantes();
            }
        },
        campoBusquedaInsitucionPrestadora(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesReps("institucionPrestadora");
            }
        },
        campoBusquedaEAPB(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarOpcionesReps("eapb");
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.telesalud = {};
            this.limpiarFormulario();
            this.$emit("update:mostrarModalPendiente", false);
        },

        async listarDetallesTelesalud(telesalud) {
            this.telesalud = {};
            this.ordenesConsultaTelesalud = [];
            this.setPreload(true);
            try {
                const res = await this.$axios.get(
                    `/telesalud/listarDetallesTelesalud/${telesalud.id}`
                );
                this.telesalud = res.data;

                this.buscarOrdenesTeleconsulta(this.telesalud.consulta_id);
            } catch (error) {
                this.$toast.error(
                    "Ocurrió un error al cargar los datos de la telesalud."
                );
            } finally {
                this.setPreload(false);
            }
        },

        abrirModalEspecialidad() {
            this.mostrarModalEspecialidad = true;
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

        limpiarFormulario() {
            this.formRespuesta = {
                prioridad: "",
                pertinencia_solicitud: "",
                observacion: "",
                integrantes: [],
                institucion_prestadora: null,
                eapb: null,
                evaluacion_junta: "",
                junta_aprueba: null,
                clasificacion_prioridad: null,
            };

            this.$refs.formRespuestaJunta.resetValidation();
        },

        recargarTelesalud() {
            this.cerrarModal();
            this.$emit("recargarTelesalud");
        },

        abrirOrdenamiento() {
            this.mostrarOrdenamiento = true;
        },

        cerrarOrdenamiento() {
            this.mostrarOrdenamiento = false;
            this.buscarOrdenesTeleconsulta(this.telesalud.consulta_id);
        },

        buscarOrdenesTeleconsulta(consultaId) {
            this.loading.tablaOrdenamiento = true;
            this.$axios
                .get(`/ordenamiento/detalleOrdenamientoPorConsulta/${consultaId}`)
                .then((res) => {
                    this.ordenesConsultaTelesalud = res.data.map((item) => {
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
                            case "codigoPropio":
                                return {
                                    tipo: "Otro Servicio",
                                    codigo: item.codigo_propio.cup.codigo,
                                    nombreCodigo: item.codigo_propio.cup.nombre,
                                    cantidad: item.cantidad,
                                    paginacion: "No Aplica",
                                    observacion: item.observacion,
                                    estado_id: item.estado_id,
                                    cup_id: item.codigo_propio.cup_id,
                                    id: item.id,
                                    orden_id: item.orden_id,
                                    estado: item.estado,
                                };
                            default:
                                break;
                        }
                    });
                })
                .catch(() => {
                    this.$toast.error("Error al cargar las ordenes");
                })
                .finally(() => {
                    this.loading.tablaOrdenamiento = false;
                });
        },

        obtenerColorEstado(estadoId) {
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

        descargarOrden(item) {
            let tipoOrden = "";

            switch (item.tipo) {
                case "Servicio":
                    tipoOrden = "servicio";
                    break;
                case "Medicamento":
                    tipoOrden = "medicamento";
                    break;
                case "Otro Servicio":
                    tipoOrden = "codigoPropio";
                    break;
                default:
                    break;
            }

            const data = {
                tipo: tipoOrden,
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

        enviarFormulario() {
            if (!this.$refs.formRespuestaJunta.validate()) {
                return;
            }
            this.setPreload(true);
            this.$axios
                .post(
                    `/telesalud/respuestaJunta/${this.telesalud.id}`,
                    this.formRespuesta
                )
                .then(() => {
                    this.$toast.success("Respuesta guardada con éxito.");
                    this.limpiarFormulario();
                    this.recargarTelesalud();
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al responder la solicitud.");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarOpcionesIntegrantes() {
            this.loading.opcionesIntegrantes = true;
            this.$axios
                .get("/operador/listarActivosSumi")
                .then((res) => {
                    this.opcionesIntegrantes = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar los operadores");
                })
                .finally(() => {
                    this.loading.opcionesIntegrantes = false;
                });
        },

        listarOpcionesReps(tipo) {
            const isInstitucionPrestadora = tipo === "institucionPrestadora";

            if (isInstitucionPrestadora) {
                this.loading.opcionesInstitucionPrestadora = true;
            } else {
                this.loading.opcionesEAPB = true;
            }

            const campoBusqueda = isInstitucionPrestadora
                ? this.campoBusquedaInsitucionPrestadora
                : this.campoBusquedaEAPB;

            this.$axios
                .get(`/reps/buscarRep/${campoBusqueda}`)
                .then((res) => {
                    const opciones = res.data.map((rep) => ({
                        id: rep.id,
                        nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
                    }));

                    if (isInstitucionPrestadora) {
                        this.opcionesInstitucionPrestadora = opciones;
                    } else {
                        this.opcionesEAPB = opciones;
                    }
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al cargar las instituciones");
                })
                .finally(() => {
                    if (isInstitucionPrestadora) {
                        this.loading.opcionesInstitucionPrestadora = false;
                    } else {
                        this.loading.opcionesEAPB = false;
                    }
                });
        },
    },
};
</script>
