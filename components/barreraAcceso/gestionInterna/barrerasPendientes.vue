<template>
    <div>
        <v-row dense class="mt-4">
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-text-box-search-outline" v-model="filtros.numero_radicado"
                    label="N° Radicado"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-autocomplete dense outlined :items="barreras" item-text="nombre" item-value="nombre"
                    label="Tipo barrera" v-model="filtros.tipo_barrera" :loading="loading.tipos"
                    @focus="listarTiposBarrerasAcceso()"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-credit-card-search-outline"
                    v-model="filtros.numero_documento" label="N° Documento"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-menu dense v-model="menu.fechaInicio" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field dense outlined clearable label="Fecha Inicial" append-icon="mdi-calendar"
                            v-bind="attrs" v-on="on" v-model="filtros.fecha_inicio"
                            @click:clear="filtros.fecha_inicio = null" readonly></v-text-field>
                    </template>
                    <v-date-picker v-model="filtros.fecha_inicio" @input="menu.fechaInicio = false"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-menu dense v-model="menu.fechaFin" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field dense outlined clearable label="Fecha Final" append-icon="mdi-calendar"
                            v-bind="attrs" v-on="on" v-model="filtros.fecha_fin" @click:clear="filtros.fecha_fin = null"
                            readonly></v-text-field>
                    </template>
                    <v-date-picker v-model="filtros.fecha_fin" @input="menu.fechaFin = false"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-autocomplete dense outlined :items="reps" item-text="nombre" item-value="id"
                    label="Centro de atención" v-model="filtros.sede"
                    no-data-text="Ingresa 4 letras para iniciar la búsqueda"
                    loading-text="Cargando... Por favor espere" :search-input.sync="buscarRep"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="12" sm="12" align="right">
                <v-btn small class="ml-2" color="error" @click="limpiar()">
                    LIMPIAR FILTROS <v-icon dark right>mdi-close</v-icon>
                </v-btn>
                <v-btn small color="success" @click="listarBarrerasPendientes()">
                    BUSCAR <v-icon dark right>mdi-magnify</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-divider></v-divider>
            </v-col>

            <v-col cols="12" md="12" sm="12">
                <v-data-table disable-pagination hide-default-footer loading-text="Cargando... Por favor espere"
                    :headers="headersPendientes" :items="pendientes" :loading="loading.pendientes"
                    no-data-text="Sin datos para mostrar" dense>
                    <template v-slot:[`item.user_crea.operador`]="{ item }">
                        {{ [item.user_crea?.operador?.nombre, item.user_crea?.operador?.apellido].filter(Boolean).join(' ') || 'Sin usuario' }}
                    </template>
                    <template v-slot:[`item.observacion`]="{ item }">
                        <ObservacionComponente :observacion="item?.observacion"></ObservacionComponente>
                    </template>
                    <template v-slot:[`item.created_at`]="{ item }">
                        {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                    </template>
                    <template v-slot:[`item.n_documento`]="{ item }">
                        <p>{{ item?.afiliado?.numero_documento != null ? item?.afiliado.numero_documento : 'SIN DOCUMENTO' }}</p>
                    </template>
                    <template v-slot:[`item.nombre_afiliado`]="{ item }">
                        <p>{{
                            item?.afiliado?.primer_nombre
                                ? [
                                    item?.afiliado?.primer_nombre,
                                    item?.afiliado?.segundo_nombre,
                                    item?.afiliado?.primer_apellido,
                                    item?.afiliado?.segundo_apellido
                                ]
                                    .filter(Boolean)
                                    .join(' ')
                                : 'SIN AFILIADO'
                        }}</p>
                    </template>
                    <template v-slot:[`item.general`]="{ item }">
                        <v-chip label dark small :color="item?.barrera_general ? 'success' : 'primary'">
                            <b>{{ item?.barrera_general ? 'SI' : 'NO' }}</b>
                        </v-chip>
                    </template>
                    <template v-slot:[`item.prioridad`]="{ item }">
                        <v-chip label dark small :color="item?.prioridad ? 'error' : 'primary'">
                            <b>{{ item?.prioridad ? 'PRIORITARIO' : 'NO PRIORITARIO' }}</b>
                        </v-chip>
                    </template>
                    <template v-slot:[`item.centro_atencion`]="{ item }">
                        <p>{{ item?.rep?.nombre != null ? item?.rep?.nombre : 'SIN CENTRO DE ATENCION' }}</p>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on"
                                    @click="abrirModalGestionarPendientes(item)">
                                    mdi-file-eye-outline
                                </v-icon>
                            </template>
                            <span>Gestionar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
                <v-row no-gutters>
                    <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                        <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                            @input="listarBarrerasPendientes()">
                        </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                            @change="listarBarrerasPendientes()">
                        </v-select>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <ModalGestionarBarrearAcceso :mostrarModal.sync="mostrarModal" :barreraSelecionada="barreraSelecionada"
            @listar="listarBarrerasPendientes">
        </ModalGestionarBarrearAcceso>
    </div>
</template>
<script>
import ModalGestionarBarrearAcceso from '../barreraAccesoComponentes/modalGestionarBarrearAcceso.vue';
import ObservacionComponente from '../barreraAccesoComponentes/observacionComponente.vue';

export default {
    components: {
        ModalGestionarBarrearAcceso,
        ObservacionComponente,
    },

    data() {
        return {
            pendientes: [],
            barreras: [],
            reps: [],
            tiposCargados: false,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            filtros: {
                numero_radicado: null,
                tipo_barrera: null,
                numero_documento: null,
                sede: null,
                fecha_inicio: null,
                fecha_fin: null,
            },
            menu: {
                fechaInicio: false,
                fechaFin: false,
            },
            loading: {
                pendientes: false,
                tipos: false,
                reps: false
            },
            headersPendientes: [
                {
                    text: "N°",
                    value: "id",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Tipo",
                    value: "barrera",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Descripción",
                    value: "observacion",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "N° Documento",
                    value: "n_documento",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Afiliado",
                    value: "nombre_afiliado",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Centro atención",
                    value: "centro_atencion",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Fecha ingreso",
                    value: "created_at",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Reporta",
                    value: "user_crea.operador",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Correo reportante",
                    value: "user_crea.email",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "General",
                    value: "general",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Prioritario",
                    value: "prioridad",
                    align: "center",
                    sortable: false,
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    align: "center",
                    sortable: false,
                },
            ],
            mostrarModal: false,
            barreraSelecionada: {},
            buscarRep: null,
        }
    },

    mounted() {
        this.listarBarrerasPendientes();
    },

    watch: {
        buscarRep(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarReps();
            }
        }
    },

    methods: {
        listarBarrerasPendientes() {
            this.loading.pendientes = true;
            const data = {
                id: this.filtros.numero_radicado,
                barrera: this.filtros.tipo_barrera,
                documento: this.filtros.numero_documento,
                rep_id: this.filtros.sede,
                fecha_inicio: this.filtros.fecha_inicio,
                fecha_fin: this.filtros.fecha_fin,
            }
            this.$axios.post(
                "/barrera-acceso/listar-barreas-pendientes?page=" + this.pagina + "&cant=" + this.opcionActual, data
            )
                .then((res) => {
                    this.pendientes = res.data.data;
                    this.total = res.data.last_page;
                    this.$emit("actualizarConteo", res.data.total)
                })
                .catch((e) => {
                    this.$toast.error("Error al listar las barreras de acceso pendientes");
                })
                .finally(() => {
                    this.loading.pendientes = false;
                });
        },

        limpiar() {
            this.filtros = {
                numero_radicado: null,
                tipo_barrera: null,
                numero_documento: null,
                sede: null,
                fecha_inicio: null,
                fecha_fin: null,
            }
            this.listarBarrerasPendientes();
        },

        listarTiposBarrerasAcceso() {
            if (this.tiposCargados) return;
            this.loading.tipos = true;
            this.$axios.get(
                "/tipo-barrera-acceso/listar-tipos-barrera_acceso-activos")
                .then((res) => {
                    this.barreras = res.data;
                    this.tiposCargados = true;
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los tipos de barreras acceso");
                    this.tiposCargados = false;
                })
                .finally(() => {
                    this.loading.tipos = false;
                })
        },

        listarReps() {
            this.loading.reps = true;
            this.$axios.get(`/reps/buscarRep/${this.buscarRep}`)
                .then((res) => {
                    this.reps = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Hubo un error al listar los reps");
                })
                .finally(() => {
                    this.loading.reps = false;
                })
        },

        abrirModalGestionarPendientes(item) {
            this.mostrarModal = true;
            this.barreraSelecionada = item;
        }
    }
}
</script>
