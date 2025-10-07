<template>
    <div>
        <v-dialog v-model="mostrarModalDetalles" persistent max-width="1500px">
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-pill-multiple" class="text-center">
                    <b>Orden N° {{ orden?.id }}</b>
                </v-alert>
                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="12" sm="12">
                            <v-data-table dense :headers="headersOrdenesArticulos" :items="ordenArticulos"
                                :loading="loading.tablaOrdenesArticulos" loading-text="Cargando... Por favor espere"
                                no-data-text="Esta orden no cuenta con articulos activos">
                                <template v-slot:[`item.estadoOrdenArticulo`]="{ item }">
                                    <v-chip dark small :color="obtenerColorEstado(item.estado.id)">
                                        {{ item.estado.nombre }}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.codesumi.nombre`]="{ item }">
                                    <v-icon large small :color="getColor(item.codesumi.codigo_lasa)">
                                        mdi-pill
                                    </v-icon>
                                    {{ item.codesumi.nombre }}
                                </template>
                                <template v-slot:[`item.domicilio`]="{ item }">
                                    <v-chip small dark :color="item.domicilio ? 'success' : 'error'">
                                        {{ item.domicilio ? "Si" : "No" }}
                                    </v-chip>
                                </template>
                                <template v-slot:[`item.tipo_domicilio`]="{ item }">
                                    {{ item.domicilio ? item.tipo_domicilio : "No Aplica" }}
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <div style="display: flex; justify-content: center; gap: 0.4rem">
                                        <v-tooltip bottom v-if="
                                            [1, 4].includes(item.estado.id) &&
                                            $can('farmacia.pasarAPendiente')
                                        ">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" v-bind="attrs" v-on="on"
                                                    @click="pasarAPendiente(item)">
                                                    mdi-pill-off</v-icon>
                                            </template>
                                            <span>Pasar a Pendiente</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="
                                            [1, 4].includes(item.estado.id) &&
                                            $can('farmacia.consultarLotes')
                                        ">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="success" v-bind="attrs" v-on="on"
                                                    @click="consultarLotes(item)">
                                                    mdi-package-variant</v-icon>
                                            </template>
                                            <span>Listar Lotes</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="[1, 4].includes(item.estado.id)">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                                    @click="abrirModalDomicilio(item)">
                                                    mdi-truck-fast
                                                </v-icon>
                                            </template>
                                            <span>Parametrizar Domicilio</span>
                                        </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="[45].includes(item.estado.id) && $can('farmacia.autorizarMipres')">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon color="warning" v-bind="attrs" v-on="on"
                                                    @click="abrirAuditoriaMipres(item)">
                                                    mdi-clipboard-text
                                                </v-icon>
                                            </template>
                                            <span>Autorizar MIPRES</span>
                                        </v-tooltip>
                                    </div>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal()">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Modal Lotes -->
        <listarLotesModal :mostrarLotesModal.sync="mostrarLotesModal" :articulo="articuloSeleccionado" :lotes="lotes"
            :farmaciaId="farmaciaId" @listarOrdenArticulos="listarOrdenArticulos" @recargarOrdenes="recargarOrdenes"
            :esPendiente="false" />

        <!-- Modal Domicilio -->
        <modalDomicilio :mostrarDomicilioModal.sync="mostrarDomicilioModal" :articulo="articuloSeleccionado"
            @listarOrdenArticulos="listarOrdenArticulos" />

        <v-dialog v-model="mostrarAuditoriaModal" persistent max-width="590">
            <v-card>
                <v-card-title class="text-h5">
                    Autorizar Medicamento {{ articuloSeleccionado?.codesumi?.codigo | '' }} - {{
                        articuloSeleccionado?.codesumi?.nombre | '' }}
                </v-card-title>
                <v-card-text>
                    <v-textarea dense outlined label="Observacion Auditoria"
                        v-model="formAuditoriaObservacion"></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark dense
                        @click="mostrarAuditoriaModal = false, formAuditoriaObservacion = null">
                        Cerrar
                    </v-btn>
                    <v-btn color="boton" dark dense @click="auditarMedicamento(articuloSeleccionado)">
                        Auditar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import {
    mapActions
} from "vuex";
import listarLotesModal from "@/components/farmacia/dispensacion/listarLotesModal.vue";
import modalDomicilio from "@/components/farmacia/dispensacion/modalDomicilio.vue";

export default {
    props: {
        mostrarModalDetalles: {
            type: Boolean,
            required: true,
        },
        orden: {
            type: Object,
            default: () => { },
        },
        farmaciaId: {
            type: Number,
            required: true,
        },
    },
    components: {
        listarLotesModal,
        modalDomicilio,
    },
    data() {
        return {
            loading: {
                tablaOrdenesArticulos: false,
            },
            formAuditoriaObservacion: null,
            ordenArticulos: [],
            headersOrdenesArticulos: [{
                text: "Código",
                value: "codesumi.codigo"
            },
            {
                text: "Nombre",
                value: "codesumi.nombre"
            },
            {
                text: "Cantidad",
                value: "cantidad_medico",
                align: "center",
                sortable: false,
            },
            {
                text: "Estado",
                value: "estadoOrdenArticulo",
                align: "center"
            },
            {
                text: "Domicilio",
                value: "domicilio",
                align: "center"
            },
            {
                text: "Tipo de Domicilio",
                value: "tipo_domicilio",
                align: "center"
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            },
            ],
            mostrarLotesModal: false,
            lotes: [],
            articuloSeleccionado: {},
            mostrarDomicilioModal: false,
            mostrarAuditoriaModal: false,
        };
    },
    watch: {
        mostrarModalDetalles(newVal) {
            if (newVal) {
                this.listarOrdenArticulos(this.orden?.id);
            }
        },
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.$emit("update:mostrarModalDetalles", false);
        },

        listarOrdenArticulos(ordenId) {
            this.loading.tablaOrdenesArticulos = true;
            this.$axios
                .get(`/ordenamiento/listar-articulo/${ordenId}`)
                .then((res) => {
                    this.ordenArticulos = res.data;
                    console.log('piti', res.data);

                })
                .catch((err) => {
                    this.$toast.error(
                        "Ocurrió un error al cargar los detalles de la orden"
                    );
                })
                .finally(() => {
                    this.loading.tablaOrdenesArticulos = false;
                });
        },

        pasarAPendiente(item) {
            this.$swal({
                title: "¿Está seguro?",
                text: "Esta acción moverá este artículo a pendientes",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, pasar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .put(`/ordenamiento/set-pendiente/${item.id}`, {
                            bodega_responsable_id: this.farmaciaId,
                            orden_id: this.orden.id,
                            orden_articulo_id: item.id,
                        })
                        .then(() => {
                            this.$toast.success("Artículo movido a pendientes correctamente");
                            this.listarOrdenArticulos(this.orden?.id);
                            this.recargarOrdenes();
                        })
                        .catch(() => {
                            this.$toast.error(
                                "Ocurrió un error al mover el articulo a pendientes"
                            );
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        consultarLotes(articulo) {
            this.articuloSeleccionado = articulo;
            this.setPreload(true);
            this.$axios
                .get(
                    `/bodega-medicamentos/lotesDispensacion/${this.farmaciaId}/${this.articuloSeleccionado.codesumi_id}`
                )
                .then((res) => {
                    this.lotes = res.data;
                    this.abrirModalLotes();
                })
                .catch((error) => {
                    this.$toast.error("Ocurrio un error al cargar los lotes");
                    console.log(error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        abrirModalLotes() {
            if (this.lotes.length < 1) {
                this.$toast.error("El lote no tiene existencias");
                return;
            } else {
                this.mostrarLotesModal = true;
            }
        },

        recargarOrdenes() {
            this.$emit("listarOrdenesActivas");
        },

        abrirModalDomicilio(item) {
            this.articuloSeleccionado = item;
            this.mostrarDomicilioModal = true;
        },

        abrirAuditoriaMipres(item) {
            this.articuloSeleccionado = item;
            this.mostrarAuditoriaModal = true;
        },

        auditarMedicamento(item) {
            this.$swal({
                title: "¿Está seguro?",
                text: "Esta acción moverá este artículo a autorizado",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Autorizar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.setPreload(true);
                    this.$axios
                        .put(`/ordenamiento/set-autorizado/${item.id}`, {
                            bodega_responsable_id: this.farmaciaId,
                            orden_id: this.orden.id,
                            orden_articulo_id: item.id,
                            observacion: this.formAuditoriaObservacion,
                        })
                        .then(() => {
                            this.$toast.success("Artículo Autorizado correctamente");
                            this.mostrarAuditoriaModal = false;
                            this.formAuditoriaObservacion = null;
                            this.listarOrdenArticulos(this.orden?.id);
                            this.recargarOrdenes();
                        })
                        .catch(() => {
                            this.$toast.error(
                                "Ocurrió un error al autorizar"
                            );
                        })
                        .finally(() => {
                            this.setPreload(false);
                        });
                }
            });
        },

        obtenerColorEstado(estadoId) {
            switch (estadoId) {
                case 1:
                case 4:
                    return "success";
                case 3:
                    return "warning";
                default:
                    return "red";
            }
        },

        getColor(codigo) {
            const colores = {
                Azul: 'blue',
                Amarillo: 'yellow',
                Verde: 'green',
                Naranja: 'orange'
            };
            return colores[codigo] || 'white';
        }
    },
};

</script>
