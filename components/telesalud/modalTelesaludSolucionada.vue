<template>
    <div>
        <v-dialog v-model="mostrarModalSolucionada" persistent max-width="1400px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-file-document-check-outline"
                    class="text-center">
                    <b>Detalles - Telesalud N° {{ telesaludSeleccionada?.id }}</b>
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
                            <span>
                                <b class="text-subtitle-1 font-weight-bold">Especialidad</b>
                                <br />
                                <p class="text-body-1 mb-0">
                                    {{ telesalud?.especialidad?.nombre }}
                                </p>
                                <br />
                                <v-divider></v-divider>
                            </span>
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
                                <b>Ordenamiento</b>
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
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="telesalud">
                        <v-col cols="12" sm="12" md="12" class="mt-2">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="info" icon="mdi-message-alert-outline"
                                class="text-center">
                                <b>Respuesta Especialista</b>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense outlined readonly label="Prioridad *"
                                :value="gestionRespuesta?.prioridad || '-'"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense outlined readonly label="Evaluación - Pertinencia de la Solicitud *"
                                :value="gestionRespuesta?.pertinencia_solicitud || '-'"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea auto-grow dense outlined readonly label="Observación *"
                                :value="gestionRespuesta?.observacion || '-'"></v-textarea>
                        </v-col>

                        <v-col cols="6" sm="6" md="6">
                            <v-text-field :value="gestionRespuesta?.finalidad?.nombre" dense outlined readonly
                                label="Finalidad de Atencion"></v-text-field>
                        </v-col>

                        <v-col cols="6" sm="6" md="6">
                            <v-text-field :value="gestionRespuesta?.causas?.nombre" label="Causa Externa" dense outlined
                                readonly></v-text-field>
                        </v-col>

                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    components: {
        EditarAfiliadoComponente,
    },
    props: {
        mostrarModalSolucionada: {
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
            loading: {
                tablaOrdenamiento: false,
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
            nombreCausa: null,
            nombreFinalidad: null,
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
        gestionRespuesta() {
            // Filtra la gestión de tipo_id = 47 para obtener los valores de la respuesta especialista
            if (this.telesalud?.gestiones) {
                return this.telesalud?.gestiones.find(
                    (gestion) => gestion.tipo_id === 47
                );
            }
            return null;
        },
    },

    watch: {
        mostrarModalSolucionada(newValue) {
            if (newValue) {
                this.listarDetallesTelesalud(this.telesaludSeleccionada);
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.telesalud = {};
            this.$emit("update:mostrarModalSolucionada", false);
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



    },
};
</script>
