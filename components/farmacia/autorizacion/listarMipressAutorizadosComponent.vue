<template>

    <v-card elevation="1">
        <v-card-text>
            <v-form ref="filtrarOrden">
                <v-row dense>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field dense label="N° de Orden" v-model="filtrarOrden.orden_id" type="number"
                            outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-text-field type="number" dense outlined label="Número de documento"
                            v-model="filtrarOrden.numero_documento"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense v-model="filtrarOrden.articulo" :loading="loading.busquedaArticulo"
                            :items="opcionesArticulos" outlined item-value="codesumi.id" item-text="codesumi.nombre"
                            :search-input.sync="campoBusquedaArticulo" label="Medicamento "
                            no-data-text="Escriba el nombre del medicamento para iniciar la búsqueda"
                            hint="Escriba el nombre del medicamento para iniciar la búsqueda">
                        </v-autocomplete>

                    </v-col>

                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense label="Usuario que ordeno" :items="operadores" item-value="user_id"
                            item-text="nombre" v-model="filtrarOrden.operadorNombre" outlined></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="4" md="4">
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
                            transition="scale-transition" offset-y max-width="290px" min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field dense v-model="filtrarOrden.mes" type="month" outlined readonly
                                    label="Mes" prepend-icon="mdi-calendar" v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="filtrarOrden.mes" type="month" scrollable locale="CO">
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="menu = false">
                                    Cancelar
                                </v-btn>
                                <v-btn text color="primary" @click="$refs.menu.save(date)">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="4" md="4">
                        <v-autocomplete outlined dense :items="reps" v-model="filtrarOrden.ips" label="Ips primaria  *"
                            :search-input.sync="campoBusquedaRep" :loading="loading.reps" item-text="nombre"
                            item-value="id" no-data-text="Escriba el nombre de la Ips para iniciar la búsqueda"
                            hint="Escriba el nombre del Ips para iniciar la búsqueda"></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="4" md="4">
                        <v-autocomplete outlined v-model="filtrarOrden.departamento" :items="opcionesDepartamentos"
                            dense item-text="nombre" :loading="loading.departamento" item-value="id"
                            label="Departamento *"></v-autocomplete>

                    </v-col>

                    <v-col cols="12" sm="4" md="4">
                        <v-autocomplete label="Entidades" dense outlined :items="entidadesUsuario"
                            v-model="filtrarOrden.entidad_id" item-text="nombre" item-value="id"></v-autocomplete>
                    </v-col>


                    <v-col cols="12" sm="4" md="4">
                        <v-spacer></v-spacer>
                        <v-btn small color="success" @click="listar()"><v-icon>mdi-filter-variant-plus</v-icon> Aplicar
                            filtro</v-btn>
                        <v-btn small color="error" @click="limpiarFormulario()"><v-icon>mdi-close</v-icon> Limpiar
                            filtros</v-btn>
                    </v-col>

                </v-row>
            </v-form>
            <v-data-table :headers="headersOrdenes" :loading="loading.ordenArticulos" :search="search"
                :items="ordenesFiltradas" class="elevation-1 mt-4 text-center" loading-text="cargando..."
                hide-default-footer disable-pagination no-data-text="Sin datos para mostrar"
                :items-per-page="opcionActual" dense>
                <template v-slot:[`item.orden.funcionario.operador`]="{ item }">
                    {{
                        item.orden?.funcionario?.operador
                            ? `${item.orden.funcionario.operador.nombre || ''} ${item.orden.funcionario.operador.apellido ||
                    ''}`.trim()
                    : 'Sin nombre'
                    }}
                </template>
                <template v-slot:[`item.nombre_paciente`]="{ item }">
                    <td class="text-center">
                        {{
                            [
                                item.orden?.consulta?.afiliado?.primer_nombre,
                                item.orden?.consulta?.afiliado?.segundo_nombre,
                                item.orden?.consulta?.afiliado?.primer_apellido,
                                item.orden?.consulta?.afiliado?.segundo_apellido
                            ].filter(Boolean).join(' ')
                        }}
                    </td>
                </template>

                <template v-slot:[`item.estado.nombre`]="{ item }">
                    <template class="text-center">
                        <v-chip small :color="getColor(item.estado.id)">
                            {{ item.estado ? item.estado.nombre : 'Estado no disponible' }}

                        </v-chip>
                    </template>
                </template>

                <template v-slot:[`item.entidad_afiliado`]="{ item }">
                    <template class="text-center">
                        <v-chip dark small :color="colorEntidad(item.orden?.consulta?.afiliado?.entidad_id)">
                            {{ item.orden?.consulta?.afiliado?.entidad?.nombre || 'No posee entidad' }}

                        </v-chip>
                    </template>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <td class="text-center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn icon color="info" v-on="on" :disabled="generando" @click="imprimir(item)">
                                    <v-icon>mdi-file-download</v-icon>
                                </v-btn>
                            </template>
                            <span>Imprimir orden</span>
                        </v-tooltip>
                    </td>
                </template>

            </v-data-table>

            <v-row no-gutters style="background-color: white;">
                <v-col md="8" lg="9" xl="10" sm="10" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9" @input="listar">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense outlined small
                        @change="listar()">
                    </v-select>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
export default {

    data() {
        return {
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            search: "",
            preload: false,
            filtrarOrden: {
                orden_id: "",
                articulo: "",
                operadorNombre: "",
                mes: "",
                ips: "",
                departamento: "",
                numero_documento: "",
                entidad_id: ''
            },
            opcionesDepartamentos: [],
            entidadesUsuario: [],
            generando: false,
            opcionesArticulos: [],
            campoBusquedaRep: "",
            reps: [],
            ordenesFiltradas: [],
            operadores: [],
            loading: {
                busquedaArticulo: false,
                ordenArticulos: false,
                busquedaRep: false,
                departamento: false,
            },
            campoBusquedaArticulo: null,
            campoBusquedaIps: null,
            headersOrdenes: [
                {
                    text: "Consecutivo",
                    align: "center",
                    sortable: true,
                    value: "id"
                },
                {
                    text: "Numero de orden",
                    align: "center",
                    sortable: true,
                    value: "orden_id"
                }, {
                    text: "Tipo documento",
                    align: "center",
                    sortable: true,
                    value: "orden.consulta.afiliado.tipo_documento.nombre"
                },
                {
                    text: "Documento",
                    align: "center",
                    sortable: true,
                    value: "orden.consulta.afiliado.numero_documento"
                },
                {
                    text: "Ips primaria",
                    align: "center",
                    sortable: true,
                    value: "orden.consulta.afiliado.ips.nombre",
                },
                {
                    text: "Departamentos",
                    align: "center",
                    sortable: true,
                    value: "orden.consulta.afiliado.departamento_afiliacion.nombre",

                },
                {
                    text: "Nombre paciente",
                    align: "center",
                    sortable: true,
                    value: "nombre_paciente"
                },
                {
                    text: 'Entidad paciente',
                    value: 'center',
                    sortable: true,
                    value: 'entidad_afiliado'
                },
                {
                    text: "Codigo",
                    align: "center",
                    sortable: true,
                    value: "codesumi.codigo"
                },
                {
                    text: "Nombre",
                    sortable: true,
                    align: "center",
                    value: "codesumi.nombre"
                },
                {
                    text: "Cantidad",
                    align: "center",
                    sortable: true,
                    value: "cantidad_medico"
                },
                {
                    text: "Estado",
                    align: "center",
                    sortable: true,
                    value: "estado.nombre"
                },
                {
                    text: "Funcionario",
                    align: "center",
                    sortable: true,
                    value: "orden.funcionario.operador"
                },
                {
                    text: "Fecha vigencia",
                    align: "center",
                    sortable: true,
                    value: "fecha_vigencia"
                },
                {
                    text: "Acciones",
                    align: "center",
                    value: "acciones",
                    sortable: false,
                },
            ],
            pagina: 1,
            total: 0,
            opcionActual: 5,
            opciones: [5, 10, 20, 50, 100],
            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio",
            },
        }

    },

    watch: {
        campoBusquedaArticulo(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarMedicamento();
            }
        },

        campoBusquedaRep(newVal) {
            if (newVal && newVal.length === 4) {
                this.listarReps();
            }
        },
    },

    mounted() {
        this.listar();
        this.cargarDepartamentos();
        this.operadoresBuscar();
        this.listarEntidades()
    },

    methods: {
        async listar() {
            try {
                const data = {
                    page: this.pagina,
                    cantidad: this.opcionActual,
                    //   paginacion: this.paginacion,
                    ...this.filtrarOrden,
                    estado: [4, 34],
                };
                this.loading.ordenArticulos = true;
                const response = await this.$axios.post(`/ordenamiento/buscarOrdenArticulo`, data);
                this.ordenesFiltradas = response.data.data;
                this.total = response.data.last_page;
            } catch (error) {
                console.log(error);
                this.$toast.error('Ha ocurrido un error al listar los Orden Articulos');
            } finally {
                this.loading.ordenArticulos = false;
            }
        },

        buscarMedicamento() {
            this.loading.busquedaArticulo = true;
            this.$axios
                .post("medicamentos/listarMedicamentoOrdenamiento", {
                    nombre: this.campoBusquedaArticulo,
                })
                .then((res) => {
                    this.opcionesArticulos = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al listar los medicamentos");
                })
                .finally(() => {
                    this.loading.busquedaArticulo = false;
                });
        },

        listarReps() {
            this.loading.reps = true;
            this.$axios.get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                    console.log(error);
                })
                .finally(() => {
                    this.loading.reps = false;
                });
        },

        cargarDepartamentos() {
            this.loading.departamento = true;
            this.$axios
                .get("departamento")
                .then((res) => {
                    this.opcionesDepartamentos = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al cargar departamentos");
                    console.log(e);
                })
                .finally(() => {
                    this.loading.departamento = false;
                });
        },

        buscarReps() {
            this.listarReps(searchTerm);
        },

        async operadoresBuscar() {
            try {
                const response = await this.$axios.get('/operador/listar');
                this.operadores = response.data;
            } catch (error) {
                this.$toast.error('Ha ocurrido un error al traer los prestadores');
            }
        },

        imprimir(item) {
            this.preload = true;
            let pdf = {
                tipo: "medicamento",
                id: item.orden_id,
                filtro: item.estado_id,
                detalles: {
                    id: item.id,
                },
                documento: item.orden.consulta.afiliado.numero_documento
            };
            this.$axios
                .post("/pdf", pdf, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    this.preload = false;
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch((res) => {
                    this.preload = false;
                });
        },

        limpiarFormulario() {
            this.filtrarOrden = {
                orden_id: "",
                articulo: "",
                operadorNombre: "",
                mes: "",
                entidad_id: ''
            };
            this.listar();
        },

        getColor(estado) {
            switch (estado) {
                case 4:
                    return 'success';
                case 34:
                    return 'info';
                case 45:
                    return 'error';
            }
        },

        listarEntidades() {
            this.$axios.get('entidad/listar-entidades-usuario').then((res) => {
                this.entidadesUsuario = res.data
            }).catch((error) => {
                console.log(error.response.data.error)
            })
        },

        colorEntidad(entidad) {
            switch (entidad) {
                case 1:
                    return 'info';
                case 2:
                    return 'success';
                case 3:
                    return 'cyan darken-4';
                case 4:
                    return 'light-green darken-4';
                case 5:
                    return 'blue-grey darken-1';
                case 6:
                    return 'light-blue darken-4';
                case 7:
                    return 'green darken-4';
                case 8:
                    return 'orange darken-3';
                case 9:
                    return 'deep-purple darken-3';
                default:
                    return 'blue-grey darken-4'
            }
        },

        cerrarModal() {
            this.limpiarFormulario();
            this.autorizarModal = false;
        }
    }
}
</script>
