<template>
    <div>
        <v-row dense class="mt-4">
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-text-box-search-outline" v-model="filtros.numero_radicado"
                    label="N° Radicado"></v-text-field>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-autocomplete dense outlined :items="barreras" item-text="nombre" item-value="nombre"
                    label="Tipo barrera" v-model="filtros.tipo_barrera" :loading="loadings.tipos"
                    @focus="listarTiposBarrerasAcceso()"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-text-field dense outlined append-icon="mdi-credit-card-search-outline"
                    v-model="filtros.numero_documento" label="N° Documento"></v-text-field>
            </v-col>
            <v-col cols="12" md="1" sm="6">
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
            <v-col cols="12" md="1" sm="6">
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
                    label="Centro de atención" v-model="filtros.sede" :loading="loadings.reps"
                    no-data-text="Ingresa 4 letras para iniciar la búsqueda"
                    loading-text="Cargando... Por favor espere" :search-input.sync="buscarRep"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="2" sm="6">
                <v-autocomplete dense outlined label="Asignado" v-model="filtros.asignadoA" :items="operadores"
                    item-text="nombre" item-value="id" :loading="loadings.operador" :search-input.sync="buscarOperador"
                    no-data-text="Ingresa 4 letras para iniciar la búsqueda"
                    loading-text="Cargando... Por favor espere"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="12" sm="12" align="right">
                <v-btn small class="ml-2" color="error" @click="limpiar()">
                    LIMPIAR FILTROS <v-icon dark right>mdi-close</v-icon>
                </v-btn>
                <v-btn small color="success" @click="listarBarrerasPresolucionadas()">
                    BUSCAR <v-icon dark right>mdi-magnify</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-data-table disable-pagination hide-default-footer loading-text="Cargando... Por favor espere"
                    :headers="headersPreSolucionadas" :items="preSolucionadas" :loading="loadings.preSolucionadas"
                    no-data-text="Sin datos para mostrar" dense>
                    <template v-slot:[`item.user_crea.operador`]="{ item }">
                        {{ [item.user_crea?.operador?.nombre, item.user_crea?.operador?.apellido].filter(Boolean).join(' ') || 'Sin usuario' }}
                    </template>
                    <template v-slot:[`item.observacion`]="{ item }">
                        <ObservacionComponente :observacion="item.observacion_cierre"></ObservacionComponente>
                    </template>
                    <template v-slot:[`item.asignadoA`]="{ item }">
                        <AsignadosBarreraAcceso :items="item"></AsignadosBarreraAcceso>
                    </template>
                    <template v-slot:[`item.created_at`]="{ item }">
                        {{ $moment(item.created_at).format("DD-MM-YYYY") }}
                    </template>
                    <template v-slot:[`item.n_documento`]="{ item }">
                        <p>{{ item?.afiliado?.numero_documento != null ? item?.afiliado.numero_documento
                            : 'SIN DOCUMENTO' }}
                        </p>
                    </template>
                    <template v-slot:[`item.nombre_afiliado`]="{ item }">
                        <p>{{
                            item?.afiliado?.primer_nombre
                                ? [
                                    item.afiliado.primer_nombre,
                                    item.afiliado.segundo_nombre,
                                    item.afiliado.primer_apellido,
                                    item.afiliado.segundo_apellido
                                ]
                                    .filter(Boolean)
                                    .join(' ')
                                : 'SIN AFILIADO'
                        }}</p>
                    </template>
                    <template v-slot:[`item.centro_atencion`]="{ item }">
                        <p>{{ item?.rep?.nombre != null ? item?.rep?.nombre : 'SIN CENTRO DE ATENCION' }}</p>
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
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on" @click="abrirModalGestionar(item)">
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
                            @input="listarBarrerasPresolucionadas()">
                        </v-pagination>
                    </v-col>
                    <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                        <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                            @change="listarBarrerasPresolucionadas()">
                        </v-select>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <ModalGestionarBarrearAcceso :mostrarModal.sync="mostrarModal" :barreraSelecionada="barreraSelecionada"
            @listar="listarBarrerasPresolucionadas">
        </ModalGestionarBarrearAcceso>
    </div>
</template>
<script>
import AsignadosBarreraAcceso from '../barreraAccesoComponentes/asignadosBarreraAcceso.vue';
import ModalGestionarBarrearAcceso from '../barreraAccesoComponentes/modalGestionarBarrearAcceso.vue';
import ObservacionComponente from '../barreraAccesoComponentes/observacionComponente.vue';

export default {
    components: {
        ModalGestionarBarrearAcceso,
        ObservacionComponente,
        AsignadosBarreraAcceso
    },

    data() {
        return {
            preSolucionadas: [],
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
                asignadoA: null
            },
            menu: {
                fechaInicio: false,
                fechaFin: false,
            },
            headersPreSolucionadas: [
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
                    text: "Asignado A",
                    value: "asignadoA",
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
            operadores: [],
            barreras: [],
            tiposCargados: false,
            reps: [],
            loadings: {
                preSolucionadas: false,
                tipos: false,
                reps: false,
                operador: false,
            },
            buscarOperador: null,
            buscarRep: null,
            mostrarModal: false,
            barreraSelecionada: null
        }
    },

    watch: {
        buscarOperador(newVal) {
            if (newVal && newVal.length === 4) {
                this.listarResponsables();
            }
        },

        buscarRep(newValue) {
            if (newValue && newValue.length === 4) {
                this.listarReps();
            }
        }
    },

    mounted() {
        this.listarBarrerasPresolucionadas();
    },

    methods: {
        listarBarrerasPresolucionadas() {
            this.loadings.preSolucionadas = true;
            const data = {
                id: this.filtros.numero_radicado,
                barrera: this.filtros.tipo_barrera,
                documento: this.filtros.numero_documento,
                rep_id: this.filtros.sede,
                fecha_inicio: this.filtros.fecha_inicio,
                fecha_fin: this.filtros.fecha_fin,
                responsable_barrera_accesos_id: this.filtros.asignadoA
            }
            this.$axios.post('/barrera-acceso/listar-barreras-presolucionadas?page=' + this.pagina + "&cant=" + this.opcionActual, data)
                .then((res) => {
                    this.preSolucionadas = res.data.data;
                    this.total = res.data.last_page;
                    this.$emit("actualizarConteo", res.data.total)
                })
                .catch((e) => {
                    this.$toast.error("Error al listar las barreras de acceso preSolucionadas");
                })
                .finally(() => {
                    this.loadings.preSolucionadas = false;
                });
        },

        listarTiposBarrerasAcceso() {
            if (this.tiposCargados) return;
            this.loadings.tipos = true;
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
                    this.loadings.tipos = false;
                })
        },

        listarReps() {
            this.loadings.reps = true;
            this.$axios.get(`/reps/buscarRep/${this.buscarRep}`)
                .then((res) => {
                    this.reps = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Hubo un error al listar los reps");
                })
                .finally(() => {
                    this.loadings.reps = false;
                })
        },

        listarResponsables() {
            this.loadings.operador = true;
            const data = {
                nombre: this.buscarOperador
            }
            this.$axios.post("/responsable-barrera-acceso/listar-responsables-activos", data)
                .then((res) => {
                    this.operadores = res.data.map(responsable => {
                        return {
                            id: responsable.id,
                            nombre: `${responsable.nombre} - ${responsable.area_responsable.nombre}`
                        }
                    });
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los responsables");
                }).finally(() => {
                    this.loadings.operador = false;
                });
        },

        abrirModalGestionar(item) {
            this.mostrarModal = true;
            this.barreraSelecionada = item;
        },

        limpiar() {
            this.filtros = {
                numero_radicado: null,
                tipo_barrera: null,
                numero_documento: null,
                sede: null,
                fecha_inicio: null,
                fecha_fin: null,
                asignadoA: null
            };
            this.listarBarrerasPresolucionadas();
        }
    }
}
</script>
