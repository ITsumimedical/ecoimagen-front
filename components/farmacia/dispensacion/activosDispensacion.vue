<template>
    <div>
        <v-row dense class="mt-2">
            <v-col cols="12" sm="12" md="12">
                <v-text-field label="Buscar" prepend-inner-icon="mdi-magnify" outlined dense v-model="search"
                    no-results-text="No se encontraron resultados para su búsqueda"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headersOrdenesActivas" :items="ordenesActivas"
                    :loading="loading.tablaOrdenesActivas" no-data-text="El afiliado no cuenta con Ordenes Activas"
                    loading-text="Cargando... Por favor espere" :search="search">
                    <template v-slot:[`item.acciones`]="{ item }">
                        <div style="display: flex; justify-content: center; gap: 0.2rem">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="primary" v-bind="attrs" v-on="on" @click="abrirModalDetalles(item)">
                                        mdi-file-eye
                                    </v-icon>
                                </template>
                                <span>Ver Detalles</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="success" v-bind="attrs" v-on="on" @click="descargarOrden(item)">
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

        <!-- Modal Detalles -->
        <modalDetalleArticulos :mostrarModalDetalles.sync="mostrarModalDetalles" :orden.sync="ordenSeleccionada"
            :farmaciaId="farmaciaId" @listarOrdenesActivas="listarOrdenesActivas"></modalDetalleArticulos>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import modalDetalleArticulos from "@/components/farmacia/dispensacion/modalDetalleArticulos.vue";

export default {
    name: "activosDispensacion",
    props: {
        afiliadoId: {
            type: Number,
            required: true,
        },
        farmaciaId: {
            type: Number,
            required: true,
        },
    },
    components: {
        modalDetalleArticulos,
    },
    data() {
        return {
            headersOrdenesActivas: [
                { text: "N° Orden", value: "id", align: "center" },
                {
                    text: "Fecha de Vigencia",
                    value: "fecha_vigencia",
                    align: "center",
                },
                {
                    text: "Página",
                    value: "paginacion",
                    align: "center",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    sortable: false,
                    align: "center",
                },
            ],
            ordenesActivas: [],
            loading: {
                tablaOrdenesActivas: false,
            },
            search: "",
            mostrarModalDetalles: false,
            ordenSeleccionada: {},
        };
    },
    mounted() {
        this.listarOrdenesActivas();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        listarOrdenesActivas() {
            this.loading.tablaOrdenesActivas = true;
            this.$axios
                .get(`/ordenamiento/listar-ordenes-activas/${this.afiliadoId}`)
                .then((res) => {
                    this.ordenesActivas = res.data;
                })
                .catch(() => {
                    this.$toast.error(
                        "Ocurrió un error al cargar las ordenes activas del afiliado"
                    );
                })
                .finally(() => {
                    this.loading.tablaOrdenesActivas = false;
                });
        },

        abrirModalDetalles(item) {
            this.ordenSeleccionada = item;
            this.mostrarModalDetalles = true;
        },

        descargarOrden(item) {
            const data = {
                id: item.id,
                tipo: "medicamento",
                filtro: item.estado_id,
                detalles: {
                    id: item.id,
                    movimiento: item.id,
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
                .catch(() => {
                    this.$toast.error("Ocurrió un error al descargar la orden");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },
    },
};
</script>
