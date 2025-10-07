<template>
    <v-card>
        <v-card-title>
            <div class="d-flex align-center">
                <img
                    src="/images/ojo.svg"
                    alt="Icono Proveedores"
                    height="50"
                    width="50"
                />
                <span class="ml-3">PROVEEDORES</span>
            </div>
            <v-divider class="mx-4" inset vertical></v-divider>
        </v-card-title>
        <v-row dense style="max-width: 30%" class="flex-nowrap">
            <v-col
                v-for="(contador, index) in contadores"
                :key="index"
                cols="auto"
            >
                <v-chip
                    label
                    class="ma-1"
                    :color="coloresEstados(index)"
                    text-color="white"
                >
                    <v-icon left small>{{ iconosEstado(index) }}</v-icon>
                    {{ nombreEstado(index) }}: {{ contador.total }}
                </v-chip>
            </v-col>
        </v-row>

        <v-col>
            <v-alert
                text
                dense
                border="left"
                type="info"
                color="blue-grey"
                icon="mdi-filter-variant"
                ><b>Filtros de búsqueda</b>
            </v-alert>
            <v-spacer></v-spacer>
            <v-col cols="12">
                <v-btn block small color="primary" @click="cargueMasivo()">
                    <v-icon dense class="mr-1">mdi-upload-circle</v-icon> Cargue
                    masivo de Proveedores</v-btn
                >
            </v-col>
        </v-col>

        <v-row>
            <v-col cols="2" class="ml-5">
                <v-text-field
                    clearable
                    dense
                    label="NIT del proveedor"
                    v-model="nitaBuscar"
                    outlined
                >
                </v-text-field>
            </v-col>

            <v-col cols="2">
                <v-autocomplete
                    clearable
                    dense
                    label="Tipo de Contrato"
                    v-model="contratoaBuscar"
                    :items="modadlidadVinculacion"
                    item-value="modalidad"
                    item-text="modalidad"
                    outlined
                >
                </v-autocomplete>
            </v-col>

            <v-col cols="2">
                <v-text-field
                    label="Actividad Economica *"
                    dense
                    outlined
                ></v-text-field>
            </v-col>

            <v-row class="pt-4" justify="start">
                <v-col md="3">
                    <v-btn block small color="info" @click="aplicarFiltro">
                        Aplicar Filtro
                        <v-icon right>mdi-filter-variant-plus</v-icon>
                    </v-btn>
                </v-col>

                <v-col md="3">
                    <v-btn block small color="red" dark @click="limpiarFiltros">
                        Limpiar
                    </v-btn>
                </v-col>
                <v-col md="3">
                    <v-btn block small color="success" @click="abrirModal">
                        Nuevo Proveedor
                        <v-icon right>mdi-plus-circle</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-row>

        <v-data-table :headers="headers" :items="proveedores" dense>
            <template v-slot:[`item.estado`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-chip
                            small
                            :color="GetColor(item.estado)"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            @click="cambiarEstado(item)"
                        >
                            {{ item.estado == 1 ? "Activo" : "Inactivo" }}
                        </v-chip>
                    </template>
                    <span>{{
                        item.estado == 1
                            ? "Desactivar proveedor"
                            : "Activar proveedor"
                    }}</span>
                </v-tooltip>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            small
                            color="warning"
                            class="mr-2"
                            v-bind="attrs"
                            v-on="on"
                            @click="actualizarProveedor(item)"
                        >
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>
            </template>
        </v-data-table>

        <v-dialog v-model="modalCrearProveedorComponent" persistent>
            <modalCrearProveedorComponent @cerrar="cerrarProveedor" />
        </v-dialog>

        <v-dialog v-model="modalEditarProveedorComponent" persistent>
            <modalEditarProveedorComponent
                ref="modalEditarProveedor"
                :proveedor="proveedorSeleccionado"
                @cerrar="cerrarProveedor"
            />
        </v-dialog>

        <v-dialog
            max-width="1000px"
            v-model="modalCargueMasivoComponent"
            style="height: auto;"
        >
            <modalCargueMasivoComponent
                ref="modalCargueMasivo"
                @cerrar="cerrarProveedor"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import modalCrearProveedorComponent from "~/components/compras/modales/proveedor/modalCrearProveedorComponent.vue";
import modalEditarProveedorComponent from "~/components/compras/modales/proveedor/modalEditarProveedorComponent.vue";
import modalCargueMasivoComponent from "~/components/compras/modales/proveedor/modalCargueMasivoComponent.vue";
import { mapActions } from "vuex";

export default {
    components: {
        modalCrearProveedorComponent,
        modalEditarProveedorComponent,
        modalCargueMasivoComponent,
    },

    data() {
        return {
            proveedores: [],
            modalCrearProveedorComponent: false,
            modalEditarProveedorComponent: false,
            modalCargueMasivoComponent: false,
            proveedorSeleccionado: null,
            menu: null,
            contadores: [],
            nitaBuscar: null,
            contratoaBuscar: null,
            modadlidadVinculacion: [
                { id: 1, modalidad: "Contrato" },
                { id: 2, modalidad: "Cotización" },
                { id: 3, modalidad: "Lista de Precios" },
                { id: 4, modalidad: "Garantia" },
            ],
            headers: [
                { text: "ID", value: "id", align: "center", sortable: false },
                {
                    text: "Nombre Proveedor",
                    value: "nombre_proveedor",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "NIT",
                    value: "nit",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Teléfono",
                    value: "telefono",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Correo Electronico",
                    value: "email",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Actividad Economica",
                    value: "actividad_economica",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Modalida de Vinculación",
                    value: "modalidad_vinculacion",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Estado",
                    value: "estado",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Fecha de Creación",
                    value: "created_at",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Acciones",
                    value: "actions",
                    align: "center",
                    sortable: false,
                },
            ],
        };
    },

    mounted() {
        this.listarProveedor(), this.contadoresEstado();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        abrirModal() {
            this.modalCrearProveedorComponent = true;
        },

        listarProveedor() {
            this.setPreload(true);
            this.$axios
                .get("/proveedores-compras/listar-proveedores")
                .then((response) => {
                    this.proveedores = response.data.map((item) => {
                        if (item.created_at) {
                            item.created_at = this.$moment(
                                item.created_at
                            ).format("L");
                        }
                        return item;
                    });
                })
                .catch((error) => {
                    this.$toast.error(
                        error.response?.data?.error || error.response?.data?.file
                    );
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        nombreEstado(index) {
            const labels = [
                "Modalidad de Vinculación Contrato",
                "Modalidad de Vinculación Cotización",
                "Modalidad de Vinculación Lista de Precios",
                "Modalidad de Vinculación Garantia",
            ];
            return labels[index] || "Desconocido";
        },
        iconosEstado(index) {
            const icons = [
                "mdi-check-circle",
                "mdi-clock-alert",
                "mdi-account-arrow-right",
                "mdi-eye",
                "mdi-lightbulb-on",
                "mdi-magnify",
            ];
            return icons[index] || "mdi-help-circle";
        },

        coloresEstados(index) {
            const colors = [
                "green lighten-2",
                "indigo lighten-2",
                "blue lighten-2",
                "purple lighten-2",
                "teal lighten-2",
            ];
            return colors[index] || "grey";
        },

        contadoresEstado() {
            this.$axios
                .get("proveedores-compras/contadores-proveedor")
                .then((res) => {
                    this.contadores = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        limpiarFiltros() {
            this.contratoaBuscar = null;
            this.nitaBuscar = "";
            this.listarProveedor();
        },

        aplicarFiltro() {
            this.setPreload(true);
            this.$axios
                .get("/proveedores-compras/listar-proveedores", {
                    params: {
                        nit: this.nitaBuscar || null,
                        contrato: this.contratoaBuscar || null,
                    },
                })
                .then((response) => {
                    this.proveedores = response.data.map((item) => {
                        if (item.created_at) {
                            item.created_at = this.$moment(
                                item.created_at
                            ).format("L");
                        }
                        return item;
                    });
                })
                .catch((error) => {
                    console.error("Error al aplicar el filtro:", error);
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        cerrarProveedor() {
            this.modalCrearProveedorComponent = false;
            this.modalEditarProveedorComponent = false;
            this.modalCargueMasivoComponent = false;
            this.listarProveedor();
        },

        GetColor(estado) {
            return Number(estado) ? "green" : "red";
        },

        actualizarProveedor(item) {
            this.modalEditarProveedorComponent = true;
            this.proveedorSeleccionado = item;
            this.$nextTick(() => {
                this.$refs.modalEditarProveedor.obtenerAdjuntos();
            });
        },

        cambiarEstado(item) {
            this.$swal({
                title: "¿Está Seguro?",
                text: `Esta opción modifica el estado del proveedor ${item.nombre_proveedor}`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Aceptar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.$axios
                        .post(`/proveedores-compras/cambiar-estado/${item.id}`)
                        .then(() => {
                            this.$toast.success(
                                "Se ha modificado el proveedor exitosamente."
                            );
                            this.listarProveedor();
                        })
                        .catch((error) => {
                            this.$toast.error(
                                error.response?.data?.error ||
                                    "Error al cambiar estado."
                            );
                        });
                }
            });
        },

        cargueMasivo() {
            this.modalCargueMasivoComponent = true;
        },

        limpiarCampos() {
            this.formData = {
                nombre_proveedor: "",
                nit: "",
                nombre_representante: "",
                telefono: "",
                direccion: "",
                municipio_id: null,
                email: "",
                actividad_economica: "",
                modalidad_vinculacion: null,
                forma_pago: "",
                tiempo_entrega: null,
                operador_seleccionado: null,
                estado: null,
                fecha_ingreso: null,
                tipo_proveedor: null,
                linea_id: null,
                observaciones: "",
                adjuntoRut: {
                    file: null,
                    tipo: 1,
                },
                adjuntoCamara: {
                    file: null,
                    tipo: 2,
                },
                adjuntoCliente: {
                    file: null,
                    tipo: 3,
                },
                adjuntoCuentaB: {
                    file: null,
                    tipo: 4,
                },
            };
        },
    },
};
</script>
