<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img
                                src="/images/ojo.svg"
                                alt=""
                                height="50px"
                                width="50px"
                            />
                            <span>HISTORICO DE DISPENSACIÓN</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-row>
                        <v-col cols="12" sm="3" md="3">
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-alert-circle-check-outline"
                            >
                                Ordenes Totales:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_totales
                                }}</b></v-alert
                            >
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            v-if="
                                contadorOrdenesDispensadas.ordenes_por_documento >
                                0
                            "
                        >
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-account-badge-outline"
                                >Ordenes Del afiliado:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_por_documento
                                }}</b></v-alert
                            >
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            v-if="
                                contadorOrdenesDispensadas.ordenes_por_ips > 0
                            "
                        >
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-hospital-building"
                                >Ordenes por ips:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_por_ips
                                }}</b></v-alert
                            >
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            v-if="
                                contadorOrdenesDispensadas.ordenes_por_nombre_afiliado >
                                0
                            "
                        >
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-account-badge-outline"
                                >Ordenes por afiliado:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_por_nombre_afiliado
                                }}</b></v-alert
                            >
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            v-if="
                                contadorOrdenesDispensadas.ordenes_por_bodega >
                                0
                            "
                        >
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-home-city-outline"
                                >Ordenes por bodega:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_por_bodega
                                }}</b></v-alert
                            >
                        </v-col>
                        <v-col
                            cols="12"
                            sm="3"
                            md="3"
                            v-if="
                                contadorOrdenesDispensadas.ordenes_por_usuario >
                                0
                            "
                        >
                            <v-alert
                                text
                                dense
                                color="success"
                                border="bottom"
                                icon="mdi-human-male"
                                >Ordenes por usuario:
                                <b>{{
                                    contadorOrdenesDispensadas.ordenes_por_usuario
                                }}</b></v-alert
                            >
                        </v-col>
                    </v-row>
                </v-toolbar>
            </v-card-title>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" sm="3" md="3">
                        <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="filtros.fecha_inicio"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="filtros.fecha_inicio"
                                    label="Fecha de inicio"
                                    dense
                                    outlined
                                    append-icon="mdi-calendar-badge"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="filtros.fecha_inicio"
                                no-title
                                scrollable
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="
                                        $refs.menu.save(filtros.fecha_inicio)
                                    "
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="3" md="3">
                        <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            :return-value.sync="filtros.fecha_fin"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="filtros.fecha_fin"
                                    label="Fecha Final"
                                    dense
                                    outlined
                                    append-icon="mdi-calendar-badge"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="filtros.fecha_fin"
                                no-title
                                scrollable
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu2 = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu2.save(filtros.fecha_fin)"
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete
                            label="Bodega Dispensación"
                            dense
                            outlined
                            v-model="filtros.bodega_id"
                            :loading="loadingBodegas"
                            :items="bodegas"
                            item-text="nombre"
                            item-value="id"
                            @click="listarBodegas()"
                        >
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete
                            label="Usuario que dispensó"
                            dense
                            outlined
                            v-model="filtros.user_dispensa_id"
                            :loading="loadingUsuarios"
                            :items="usuarios"
                            :item-text="
                                (item) => `${item.nombre} - ${item.apellido}`
                            "
                            item-value="user_id"
                        >
                        </v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="3" md="3">
                        <v-text-field
                            label="# Orden"
                            dense
                            outlined
                            v-model="filtros.orden_id"
                            type="number"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field
                            label="Documento afiliado"
                            dense
                            outlined
                            v-model="filtros.documento_afiliado"
                            type="number"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field
                            label="Nombre del afiliado"
                            dense
                            outlined
                            v-model="filtros.nombre_afiliado"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete
                            no-data-text="Digite el nombre de la sede para buscar."
                            label="IPS Afiliado"
                            dense
                            outlined
                            v-model="filtros.ips_id"
                            :search-input.sync="campoBusquedaRep"
                            :items="reps"
                            item-text="nombre"
                            item-value="id"
                        >
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-btn
                            small
                            color="success"
                            @click="
                                historicoDispensacion(),
                                    contadorHistoricoOrdenes(filtros)
                            "
                            :loading="loading"
                            >Filtrar <v-icon right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn
                            small
                            color="error"
                            @click="
                                limpiarFiltros(),
                                    contadorHistoricoOrdenes(filtros)
                            "
                            :loading="loading"
                            >Limpiar <v-icon right> mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>

            <v-data-table
                dense
                :loading="loading"
                hide-default-footer
                :headers="headerDispensados"
                :items="historicoMedicamentosDispensados"
                :items-per-page="opcionActual"
            >
                <template v-slot:[`item.nombreAfiliado`]="{ item }">
                    {{ item.consulta?.afiliado?.primer_nombre }} -
                    {{ item.consulta?.afiliado?.segundo_nombre }} -
                    {{ item.consulta?.afiliado?.primer_apellido }} -
                    {{ item.consulta?.afiliado?.segundo_apellido }}
                </template>
                <template v-slot:[`item.fechaDispensacion`]="{ item }">
                    <template v-if="item.articulos?.length">
                        <v-chip
                            v-for="(medicamentos, fecha) in agruparPorFecha(
                                item.articulos
                            )"
                            :key="fecha"
                            color="primary"
                            class="ma-1"
                            dark
                            small
                            label
                        >
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{ fecha }}
                                    </span>
                                </template>
                                <div>
                                    <span
                                        v-for="(
                                            medicamento, index
                                        ) in medicamentos"
                                        :key="index"
                                    >
                                        <v-icon small class="mr-1"
                                            >mdi-pill</v-icon
                                        >
                                        {{ medicamento }}<br />
                                    </span>
                                </div>
                            </v-tooltip>
                        </v-chip>
                    </template>
                </template>

                <template v-slot:[`item.bodega_dispensa`]="{ item }">
                    <div>
                        <template
                            v-if="item.articulos && item.articulos.length"
                        >
                            <div>
                                <v-chip
                                    v-for="(
                                        bodega, index
                                    ) in obtenerBodegasUnicas(item.articulos)"
                                    :key="index"
                                    class="ma-1"
                                    color="primary"
                                    dark
                                    small
                                    label
                                >
                                    <v-tooltip bottom>
                                        <template
                                            v-slot:activator="{ on, attrs }"
                                        >
                                            <span v-bind="attrs" v-on="on">{{
                                                bodega
                                            }}</span>
                                        </template>
                                        <div>
                                            <span
                                                v-for="(
                                                    usuario, idx
                                                ) in obtenerUsuariosUnicos(
                                                    item.articulos,
                                                    bodega
                                                )"
                                                :key="idx"
                                            >
                                                <v-icon small class="mr-1"
                                                    >mdi-account</v-icon
                                                >
                                                {{ usuario }}<br />
                                            </span>
                                        </div>
                                    </v-tooltip>
                                </v-chip>
                            </div>
                        </template>
                    </div>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                                color="success"
                                class="mr-2"
                                @click="abrirDialogoHistoricoOrdenes(item)"
                            >
                                mdi-folder-eye-outline
                            </v-icon>
                        </template>
                        <span
                            >Presiona para ver los detalles de la orden y de la
                            dispensación</span
                        >
                    </v-tooltip>
                </template>
            </v-data-table>

            <v-row no-gutters style="background-color: white">
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination
                        v-model="pagina"
                        class="my-4"
                        :length="total"
                        :total-visible="9"
                        @input="historicoDispensacion"
                    >
                    </v-pagination>
                </v-col>
                <v-col
                    md="3"
                    lg="3"
                    xl="1"
                    sm="1"
                    class="px-2"
                    cols
                    style="min-width: 100px"
                >
                    <v-select
                        class="my-4"
                        v-model="opcionActual"
                        :items="opciones"
                        dense
                        outlined
                        small
                        @change="historicoDispensacion()"
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog
            v-model="dialogHistoricoOrdenes"
            max-width="1200px"
            persistent
        >
            <v-card>
                <v-alert
                    text
                    dense
                    color="primary"
                    class="text-center"
                    icon="mdi-folder-account-outline"
                >
                    <b
                        >DETALLES DE LOS PRODUCTOS DISPENSADOS DE LA ORDEN #
                        {{ historicoOrdenArticulosDispensados?.id }}</b
                    >
                </v-alert>
                <v-card-text>
                    <v-data-table
                        dense
                        hide-default-footer
                        :headers="headersOrdenArticulosDispensados"
                        :items="historicoOrdenArticulos"
                        :loading="loadingArticulos"
                    >
                        <template v-slot:[`item.estado`]="{ item }">
                            <v-chip
                                small
                                label
                                :color="getColor(item.estado_id)"
                            >
                                {{ item.estado?.nombre }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        color="primary"
                                        class="mr-2"
                                        @click="abrirHistoricoMovimientos(item)"
                                    >
                                        mdi-history
                                    </v-icon>
                                </template>
                                <span
                                    >Haz clic para ver el histórico de
                                    movimientos</span
                                >
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        small
                        @click="dialogHistoricoOrdenes = false"
                        >Cerrar<v-icon right>mdi-close </v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogHistoricoMovimientos" max-width="1200px">
            <v-card :loading="loadingMovimientos">
                <v-alert
                    text
                    dense
                    color="primary"
                    class="text-center"
                    icon="mdi-history"
                >
                    <b>HISTÓRICO MOVIMIENTOS DE LA DISPENSACIÓN</b>
                </v-alert>
                <v-card-text>
                    <v-expansion-panels
                        v-if="historicoMovimientosOrdenArticulo.length"
                    >
                        <v-expansion-panel
                            v-for="(
                                movimiento, index
                            ) in historicoMovimientosOrdenArticulo"
                            :key="index"
                        >
                            <v-expansion-panel-header>
                                <b
                                    >Movimiento #{{ movimiento?.id }} -
                                    {{ movimiento?.user?.operador?.nombre }}
                                    {{
                                        movimiento?.user?.operador?.apellido
                                    }}</b
                                >
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-list dense>
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <v-icon color="blue"
                                                >mdi-warehouse</v-icon
                                            >
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title
                                                >Bodega de Origen:
                                                {{
                                                    movimiento?.bodega_origen
                                                        ?.nombre
                                                }}</v-list-item-title
                                            >
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                    <v-list-item
                                        v-for="(
                                            detalle, i
                                        ) in movimiento.detalle_movimientos"
                                        :key="i"
                                    >
                                        <v-list-item-icon>
                                            <v-icon color="green"
                                                >mdi-package-variant</v-icon
                                            >
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Cantidad Dispensada:
                                                <b>{{
                                                    detalle?.cantidad_solicitada
                                                }}</b>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider></v-divider>
                                    <v-list-item
                                        v-for="(
                                            detalle, i
                                        ) in movimiento.detalle_movimientos"
                                        :key="i"
                                    >
                                        <v-list-item-icon>
                                            <v-icon color="warning"
                                                >mdi-archive-eye</v-icon
                                            >
                                        </v-list-item-icon>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Lote N°:
                                                <b>{{
                                                    detalle?.lote?.codigo
                                                }}</b>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-alert v-else text dense color="warning">
                        No hay movimientos registrados.
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { listarBodegas } from "~/api/bodegas/bodegas";

export default {
    data() {
        return {
            historicoMedicamentosDispensados: [],
            loading: false,
            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            dialogHistoricoOrdenes: false,
            menu: false,
            menu2: false,
            campoBusquedaRep: null,
            historicoOrdenArticulos: [],
            historicoOrdenArticulosDispensados: {},
            loadingArticulos: false,
            dialogHistoricoMovimientos: false,
            historicoMovimientosOrdenArticulo: [],
            loadingMovimientos: false,
            bodegas: [],
            loadingBodegas: false,
            contadorOrdenesDispensadas: [],
            usuarios: [],
            loadingUsuarios: false,
            filtros: {
                fecha_inicio: "",
                fecha_fin: "",
                orden_id: "",
                documento_afiliado: "",
                nombre_afiliado: "",
                ips_id: "",
                bodega_id: "",
                user_dispensa_id: "",
            },
            reps: [],
            headerDispensados: [
                {
                    text: "# Orden",
                    value: "id",
                },
                {
                    text: "Documento afiliado",
                    value: "consulta.afiliado.numero_documento",
                },
                {
                    text: "Nombre del afiliado",
                    value: "nombreAfiliado",
                },
                {
                    text: "IPS Primaria",
                    value: "consulta.afiliado.ips.nombre",
                },
                {
                    text: "Fecha Dispensación",
                    value: "fechaDispensacion",
                },
                {
                    text: "Bodega que dispensa",
                    value: "bodega_dispensa",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                },
            ],
            headersOrdenArticulosDispensados: [
                {
                    text: "# Articulo",
                    value: "id",
                },
                {
                    text: "Código",
                    value: "codesumi.codigo",
                },
                {
                    text: "Nombre producto",
                    value: "codesumi.nombre",
                },
                {
                    text: "Estado Orden",
                    value: "estado",
                },
                {
                    text: "Cantidad Ordenada",
                    value: "cantidad_medico",
                },
                {
                    text: "Acciones",
                    value: "acciones",
                },
            ],
        };
    },

    mounted() {
        this.historicoDispensacion();
        this.listarOperadores();
    },

    watch: {
        campoBusquedaRep(newVal) {
            if (newVal && newVal.length === 4) {
                this.listarReps();
            }
        },
    },

    methods: {
        async historicoDispensacion() {
            try {
                this.loading = true;
                const params = {
                    page: this.pagina,
                    cantidad: this.opcionActual,
                    orden_id: this.filtros.orden_id,
                    documento_afiliado: this.filtros.documento_afiliado,
                    ips_id: this.filtros.ips_id,
                    nombre_afiliado: this.filtros.nombre_afiliado,
                    fecha_inicio: this.filtros.fecha_inicio,
                    fecha_final: this.filtros.fecha_fin,
                    bodega_id: this.filtros.bodega_id,
                    user_dispensa_id: this.filtros.user_dispensa_id,
                };
                const res = await this.$axios.post(
                    "bodegas/historicoDispensadoMovimientos",
                    params
                );
                this.historicoMedicamentosDispensados = res.data.data;
                this.total = res.data.last_page;
            } catch (error) {
                console.log(error.response.data.error);
            } finally {
                this.loading = false;
            }
        },

        limpiarFiltros() {
            (this.filtros = {}), this.historicoDispensacion();
            this.opcionActual = 5;
        },

        listarReps() {
            this.$axios
                .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.reps = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                    console.log(error);
                })
                .finally(() => {});
        },

        historicoOrdenArticulosPorOrden(item) {
            this.loadingArticulos = true;
            this.$axios
                .get("bodegas/historico-orden-articulos-dispensados/" + item)
                .then((res) => {
                    this.historicoOrdenArticulos = res.data;
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                })
                .finally(() => {
                    this.loadingArticulos = false;
                });
        },

        abrirDialogoHistoricoOrdenes(item) {
            this.historicoOrdenArticulosDispensados = item;
            this.dialogHistoricoOrdenes = true;
            this.historicoOrdenArticulosPorOrden(item.id);
        },

        getColor(estado) {
            switch (estado) {
                case 34:
                    return "success";
                case 18:
                    return "primary";
            }
        },

        abrirHistoricoMovimientos(item) {
            this.dialogHistoricoMovimientos = true;
            this.listarMovimientosPorOrdenArticulo(item.id);
        },

        obtenerBodegasUnicas(articulos) {
            const bodegas = new Set();

            articulos.forEach((articulo) => {
                articulo.movimientos.forEach((mov) => {
                    if (mov.bodega_origen?.nombre) {
                        bodegas.add(mov.bodega_origen.nombre);
                    }
                });
            });

            return Array.from(bodegas);
        },

        obtenerUsuariosUnicos(articulos, bodega) {
            const usuarios = new Set();
            articulos.forEach((articulo) => {
                articulo.movimientos.forEach((mov) => {
                    if (mov.bodega_origen?.nombre === bodega) {
                        const nombreUsuario =
                            mov.user?.operador?.nombre_completo ||
                            "Usuario no disponible";
                        usuarios.add(nombreUsuario);
                    }
                });
            });

            return Array.from(usuarios);
        },

        listarMovimientosPorOrdenArticulo(item) {
            this.loadingMovimientos = true;
            this.$axios
                .get("bodegas/historico-movimientos-orden-articulos/" + item)
                .then((res) => {
                    this.historicoMovimientosOrdenArticulo = res.data;
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                })
                .finally(() => {
                    this.loadingMovimientos = false;
                });
        },

        listarBodegas() {
            this.loadingBodegas = true;
            this.$axios
                .get("bodegas/listar")
                .then((res) => {
                    this.bodegas = res.data;
                })
                .catch((error) => {
                    this.$toast.success("error al listar las bodegas");
                })
                .finally(() => {
                    this.loadingBodegas = false;
                });
        },

        async contadorHistoricoOrdenes(parametros) {
            try {
                const res = await this.$axios.post(
                    "bodegas/contador-historico-ordenes-dispensadas",
                    parametros
                );
                this.contadorOrdenesDispensadas = res.data;
            } catch (error) {
                console.log(error.response.data.error);
            }
        },

        listarOperadores() {
            this.loadingUsuarios = true;
            this.$axios
                .get("operador/listarActivos")
                .then((res) => {
                    this.usuarios = res.data;
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                })
                .finally(() => {
                    this.loadingUsuarios = false;
                });
        },
        agruparPorFecha(articulos) {
            const agrupado = {};
            articulos.forEach((articulo) => {
                articulo.movimientos?.forEach((movimiento) => {
                    const fecha = new Date(movimiento?.created_at).toLocaleDateString("es-CO", {
                    timeZone: "America/Bogota",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    });
                    const medicamento =
                        articulo.codesumi?.nombre || "Desconocido";

                    if (!agrupado[fecha]) {
                        agrupado[fecha] = [];
                    }
                    if (!agrupado[fecha].includes(medicamento)) {
                        agrupado[fecha].push(medicamento);
                    }
                });
            });

            return agrupado;
        },
    },
};
</script>
