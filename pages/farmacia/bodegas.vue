<template>
    <div>

        <!-- data table -->
        <v-data-table :headers="headers" :search="buscar" dense :items="bodegas" sort-by="id" class="elevation-1"
                      loading-text="Cargando..." no-data-text="Sin datos para mostrar">
            <template v-slot:top>
                <v-card-title>
                    <v-btn color="boton" class="mb-2 white--text" @click="dialog = true">
                        Nuevo
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
                    </v-text-field>
                </v-card-title>

                <!-- dialogo de crear bodegas -->
                <v-dialog v-model="dialog" max-width="900px">
                    <v-container fluid class="pa-0">
                        <v-card>
                            <v-alert dense text color="primary" icon="mdi-store-24-hour" class="text-center">
                                <b>{{ titulo }}</b>
                            </v-alert>
                            <form @submit.prevent="guardarBodegas">
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-autocomplete v-model="bodega.tipo_bodega_id" :items="tipoBodega"
                                                                item-text="nombre" dense label="Tipo bodega"
                                                                item-value="id">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-autocomplete v-model="bodega.municipio_id" :items="municipio"
                                                                item-text="nombre"
                                                                dense label="Municipio" item-value="id">
                                                </v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.nombre" dense label="Nombre">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.telefono" dense label="Telefono">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.direccion" dense label="Dirección">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.hora_inicio" dense label="Hora inicio"
                                                              type="time">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.hora_fin" dense label="Hora fin"
                                                              type="time">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.stock_seguridad" dense
                                                              label="Stok seguridad"
                                                              type="number">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.tiempo_reposicion" dense
                                                              label="Tiempo reposición"
                                                              type="number">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field v-model="bodega.cobertura" dense label="Cobertura"
                                                              type="number">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-autocomplete dense v-model="bodega.rep_id" label="Sede"
                                                                item-text="nombre" item-value="id"
                                                                :search-input.sync="campoBusquedaRep"
                                                                :loading="loadingReps" :items="opcionesReps"
                                                                no-data-text="Digite el nombre de la sede para buscar."></v-autocomplete>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-chip label >
                                                  Sede asociada: <strong> {{ bodega?.rep }}</strong>
                                                </v-chip>
                                            </v-col>
                                            <v-col>
                                                <v-checkbox
                                                    v-model="bodega.ferrocarriles"
                                                    label="Dispensación para ferrocarriles"
                                                    :value="true"
                                                ></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="error" small @click="close()">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="boton" dark small @click="guardarBodegas()">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </form>
                        </v-card>
                    </v-container>
                </v-dialog>
            </template>

            <!-- Acciones -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                @click="editarBodega(item.id,item)">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on" small @click="inactivar(item)">
                            mdi-sync-off
                        </v-icon>
                    </template>
                    <span>{{ item.estado_id == 1 ? 'Inactivar' : 'Activar' }}</span>
                </v-tooltip>

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on" @click="agregaRepBodega(item)">
                            mdi-store-marker
                        </v-icon>
                    </template>
                    <span>Agregar Direccionamiento a la bodega</span>
                </v-tooltip>

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" small
                                @click="getUsuariosBodegas(item.id)">
                            mdi-account
                        </v-icon>
                    </template>
                    <span>Agregar Usuarios</span>
                </v-tooltip>
            </template>

            <template v-slot:[`item.estadoNombre`]="{ item }">
                <v-chip small :color="getColor(item.estado_id)" dark>
                    {{ item.estadoNombre }}
                </v-chip>
            </template>
        </v-data-table>

        <!-- dialogo de direccionamiento -->
        <v-dialog v-model="repBodega" persistent max-width="800px">
            <v-card>
                <v-alert type="info" icon="mdi-store-marker" text prominent dense>
                    Agregar Direccionamiento a la bodega <b>{{ bodega_nombre }}</b>
                </v-alert>

                <v-container>
                    <v-row>
                        <v-col cols="12" md="10">
                            <v-autocomplete outlined dense label="Buscar Sedes" :items="reps" item-text="nombre"
                                            item-value="id"
                                            v-model="rep_id" deletable-chips multiple small-chips chips
                                            :search-input.sync="rep"
                                            no-data-text="Digite el nombre del la sede">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn class="mx-2" small fab dark color="info" v-bind="attrs" v-on="on"
                                           @click="crearBodegaRep()">
                                        <v-icon dark>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <span>Asignar bodegas al programa</span>
                            </v-tooltip>
                        </v-col>
                        <v-col md="12">
                            <v-alert type="info" icon="mdi-handshake" text dense>
                                Direccionamientos asignados a la bodega
                            </v-alert>

                            <v-data-table v-model="bodegaReps" :loading="loading" :items="bodegasReps"
                                          :headers="headersBodegaReps"
                                          show-select class="elevation-1 mt-4" no-data-text="Sin datos para mostrar"
                                          dense>
                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-container>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" small dark @click="cerrarRepBodega()">Cerrar</v-btn>
                    <v-btn color="warning" small dark @click="removerRep()">Remover Direccionamiento</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- dialogo de agregar usuarios a una bodega -->
        <v-dialog v-model="dialogoPersonas" persistent width="850">
            <v-card>
                <v-col cols="12" sm="12" md="12">
                    <v-alert dense text outlined color="info" class="text-center">Agregar Personal
                    </v-alert>
                </v-col>

                <v-card-text>
                    <v-col cols="12" sm="12" md="12">
                        <v-autocomplete outlined dense label="Buscar Usuario" :items="usuarios"
                                        item-text="nombre_completo" item-value="user_id"
                                        v-model="formulario.usuarios" deletable-chips multiple small-chips chips
                                        :search-input.sync="operador" :loading="loading"
                                        no-data-text="Digite el nombre del Usuario">
                        </v-autocomplete>
                    </v-col>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="dialogoPersonas=false">
                        Cerrar
                    </v-btn>
                    <v-btn color="success" small @click="agregarPersonal()">
                        Agregar
                    </v-btn>
                </v-card-actions>
                <v-data-table :loading="loading" :items="bodegaUsuarios" v-model="bodegaUsuario"
                              :headers="headersBodegaUsuarios" show-select class="elevation-1 mt-4"
                              no-data-text="Sin datos para mostrar"
                              dense>
                </v-data-table>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" small dark @click="removerUsuario()">Remover Usuario</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
import {
    mapActions
} from "vuex";

export default {
    middleware({
                   $can,
                   redirect
               }) {
        if (!$can('farmacia.bodegas')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonBodegas',

    data() {
        return {
            loading: false,
            dialog: false,
            dialogoEditar: false,
            buscar: '',
            bodegasReps: [],
            bodegaUsuario: [],
            bodegas: [],
            bodegaEditarCrear: [],
            municipio: [],
            tipoBodega: [],
            repBodega: false,
            rep_id: '',
            reps: [],
            bodega_id: '',
            bodegaReps: [],
            bodegaUsuarios: [],
            bodega_nombre: '',
            bodega: {
                nombre: '',
                tipo_bodega_id: '',
                municipio_id: '',
                telefono: '',
                direccion: '',
                hora_inicio: '',
                hora_fin: '',
                stock_seguridad: '',
                tiempo_reposicion: '',
                cobertura: '',
                rep_id: '',
                ferrocarriles: false
            },
            editedIndex: -1,
            defecto: {
                nombre: '',
                tipo_bodega_id: '',
                municipio_id: '',
                telefono: '',
                direccion: '',
                hora_inicio: '',
                hora_fin: '',
                stock_seguridad: '',
                tiempo_reposicion: '',
                cobertura: '',
            },
            headersBodegaReps: [{
                text: "ID",
                value: "id"
            },
                {
                    text: "Nombre",
                    value: "nombre"
                },
            ],
            headersBodegaUsuarios: [{
                text: "ID",
                value: "id"
            },
                {
                    text: "Nombre",
                    value: "operador.nombre"
                },
                {
                    text: "Apellio",
                    value: "operador.apellido"
                },
                {
                    text: "Cedula",
                    value: "operador.documento"
                },
                {
                    text: "Cargo",
                    value: "operador.cargo.nombre"
                },
            ],
            errors: {
                nombre: '',
                descripcion: ''
            },
            paginate: {
                total: 0,
                page: 1
            },
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
                {
                    text: 'Tipo',
                    value: 'tipo_bodega.nombre'
                },
                {
                    text: 'Nombre',
                    value: 'nombre'
                },
                {
                    text: 'Telefono',
                    value: 'telefono'
                },
                {
                    text: 'Municipio',
                    value: 'nombreMUnicipio'
                },
                {
                    text: 'Dirección',
                    value: 'direccion'
                },
                {
                    text: 'Estado',
                    value: 'estadoNombre'
                },
                {
                    text: 'Acciones',
                    value: 'actions',
                    sortable: false
                },
            ],
            preload: false,
            usuarios: [],
            dialogoPersonas: false,
            rep: null,
            operador: null,
            formulario: {
                usuarios: [],
            },
            loadingReps: false,
            campoBusquedaRep: null,
            opcionesReps: [],
        };
    },

    mounted() {
        this.listarBodegas();
        this.listarTipoBodegas();
        this.listarMunicipio();
    },

    computed: {
        titulo() {
            return this.editedIndex === -1 ? 'Crear bodega' : 'Editar bodega'
        },
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },

        operador(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarOperador();
                } else if (val.length < 6) {
                    this.usuarios = null;
                }
            } else {
                this.usuarios = null;
            }
        },
        campoBusquedaRep(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarOpcionesReps();
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.bodega = Object.assign({}, this.defecto)
                this.editedIndex = -1
            })
            this.limpiarError()
        },

        listarBodegas() {
            // Activar el indicador de carga (preload)
            this.setPreload(true);
            // Realizar una solicitud GET a la ruta '/bodegas/listarTodasBodegas'
            this.$axios.get('/bodegas/listarTodasBodegas')
                .then(res => {
                    // Asignar los datos de las bodegas obtenidos a la propiedad 'bodegas'
                    this.bodegas = res.data;
                })
                .catch(e => {
                    // Mostrar un mensaje de error utilizando toast si ocurre un error
                    this.$toast.error(e.response.data.mensaje);
                })
                .finally(() => {
                    // Desactivar el indicador de carga (preload)
                    this.setPreload(false);
                });
        },

        listarTipoBodegas() {
            this.$axios.get('/bodegas/listarTipoBodega').then(res => {
                this.tipoBodega = res.data
            }).catch(e => {
                console.log(e.response)
            })
        },

        async guardarBodegas() {
            // this.limpiarError()
            if (this.editedIndex > -1) {
                this.preload = true
                this.$axios.put('/bodegas/actualizar/' + this.bodega.id, this.bodega).then(res => {
                    this.$toast.success('Se actualizo con exito')
                    this.dialog = false
                    this.preload = false
                    this.listarBodegas()

                }).catch(error => {
                    this.preload = false
                    if (error.response.data.mensaje) {
                        // this.$toast.error('Se ha actualizado el periodo de inducción específica correctamente!.')
                    } else if (error.response.data) {
                        // this.ErrorEntrada(error.response.data)
                    }
                })
            } else {
                this.bodega.estado_id = 1
                this.preload = true
                this.$axios.post('/bodegas/crear', this.bodega).then(res => {
                    this.$toast.success('Se ha creado la bodega correctamente!.')
                    this.dialog = false
                    this.listarBodegas()
                    this.preload = true
                    this.close()
                }).catch(error => {
                    this.preload = false
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data)
                    }
                })

            }

        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        editarBodega($boedega_id, item) {
            this.editedIndex = this.bodegas.indexOf(item)
            // Activar el indicador de carga (preload)
            this.setPreload(true);
            // Realizar una solicitud GET a la ruta '/bodegas/listarTodasBodegas'
            this.$axios.get('/bodegas/buscarBodega/' + $boedega_id)
                .then(res => {
                    // Asignar los datos de las bodegas obtenidos a la propiedad 'bodegas'
                    this.bodega = res.data;
                    this.dialog = true
                })
                .catch(e => {
                    // Mostrar un mensaje de error utilizando toast si ocurre un error
                    this.$toast.error(e.response.data.mensaje);
                })
                .finally(() => {
                    // Desactivar el indicador de carga (preload)
                    this.setPreload(false);
                });
        },

        listarMunicipio() {
            this.$axios.get('municipios/listar').then(res => {
                this.municipio = res.data
            }).catch(e => {
            })
        },

        inactivar(item) {
            return this.$swal({
                title: "¿Está Seguro?",
                text: "Deseas cambiar el estado de esta bodefa",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    const request = {
                        'estado_id': item.estado_id == 1 ? 2 : 1,
                    };
                    this.$axios.put('/bodegas/actualizarEstado/' + item.id, request).then(res => {
                        this.$toast.success('Inoformación actualiza')
                        this.listarBodegas()
                        // this.closeDelete()
                    }).catch(error => {

                    });
                }
            });
        },

        getColor(estado) {
            if (estado == 1) return 'success'
            else return 'error'
        },

        getUsuariosBodegas($bodega_id) {
            this.setPreload(true);
            this.dialogoPersonas = true
            this.$axios.get('/bodegas/getUsuariosBodega/' + $bodega_id).then(res => {
                this.bodegaUsuarios = res.data[0].user
                this.bodega_id = res.data[0].id
            }).catch(e => {
                // Mostrar un mensaje de error utilizando toast si ocurre un error
                this.$toast.error(e.response.data.mensaje);
            }).finally(() => {
                // Desactivar el indicador de carga (preload)
                this.setPreload(false);
            });
        },

        agregarPersonal() {
            this.setPreload(true);
            this.formulario.bodega_id = this.bodega_id
            this.$axios.post('/bodegas/agregarPersonal', this.formulario).then(res => {
                this.getUsuariosBodegas(this.bodega_id);
                this.formulario.usuarios = []
            }).catch(e => {
                // Mostrar un mensaje de error utilizando toast si ocurre un error
                this.$toast.error(e.response.data.mensaje);
            }).finally(() => {
                // Desactivar el indicador de carga (preload)
                this.setPreload(false);
            });
        },

        listarReps() {
            this.preload = true;
            this.$axios.post('reps/listarConfiltro?page=0', {
                rep: this.rep
            }).then(res => {
                if (res.data.length >= 2) {
                    this.preload = false;
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
                        }
                    })
                } else if (res.data.length == 1) {
                    this.preload = false;
                    this.filtro.prestador_id = res.data[0].prestador_id
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}` - `${rep.codigo_habilitacion_completo}`,
                        }
                    })
                }
            }).catch(e => {
                this.preload = false;
                console.log(e);
            })
        },

        cerrarRepBodega() {
            this.repBodega = false;
            this.rep_id = '',
                this.reps = []
        },
        agregaRepBodega(item) {
            this.repBodega = true;
            this.bodega_nombre = item.nombre;
            this.bodega_id = item.id;
            this.ListarBodegasReps(item)
        },

        async crearBodegaRep() {
            this.preload = true;
            try {
                const response = await this.$axios.post('/bodegas-reps/crear', {
                    bodega_id: this.bodega_id,
                    idsReps: this.rep_id
                });
                this.$toast.success('Agregado con éxito');
                this.cerrarRepBodega();
            } catch (error) {
                this.$toast.error(error.response.data.error ?? 'Ocurrió un error al agregar la sede a la bodega');
            } finally {
                this.preload = false;
            }
        },

        ListarBodegasReps(item) {
            this.loading = true;
            this.$axios.get(`/bodegas-reps/listar/${item.id}`)
                .then(res => {
                    this.bodegasReps = res.data;
                    this.loading = false;
                    this.repBodega = true;
                })
                .catch(error => {
                    console.log(error);
                    this.loading = false;
                });
        },

        removerRep() {
            this.preload = true;
            const rep_id = this.bodegaReps.map(item => item.id);
            this.$axios.post('bodegas-reps/eliminar', {
                bodega_id: this.bodega_id,
                rep_id: rep_id
            })
                .then(response => {
                    this.preload = false;
                    this.$toast.success('Bodega eliminida del programa con éxito');
                    this.ListarBodegasReps({
                        id: this.bodega_id
                    });
                })
                .catch(error => {
                    this.preload = false;
                    this.$toast.error('Error al eliminar la bodega del programa')
                });
        },

        removerUsuario() {
            this.setPreload(true);
            const user_id = this.bodegaUsuario.map(item => item.id);
            this.$axios.post('bodegas/eliminarUsuarioBodega', {
                bodega_id: this.bodega_id,
                user_id: user_id
            })
                .then(response => {
                    this.getUsuariosBodegas(this.bodega_id);
                    this.$toast.success('Usuario eliminado del la bodega con éxito');
                })
                .catch(error => {
                    // Mostrar un mensaje de error utilizando toast si ocurre un error
                    this.$toast.error(error.response.data.mensaje);
                }).finally(() => {
                // Desactivar el indicador de carga (preload)
                this.setPreload(false);
            });
        },

        listarOperador() {
            this.loading = true;
            this.$axios.post('operador/listarFiltro', {
                nombre: this.operador
            }).then(res => {
                this.usuarios = res.data
            }).catch(e => {
                // Mostrar un mensaje de error utilizando toast si ocurre un error
                this.$toast.error(e.response.data.mensaje);
            }).finally(() => {
                // Desactivar el indicador de carga (preload)
                this.loading = false;
            });
        },

        buscarOpcionesReps() {
            this.loadingReps = true;
            this.$axios
                .get(`/reps/buscarRep/${this.campoBusquedaRep}`)
                .then((res) => {
                    this.opcionesReps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
                        };
                    });
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar los reps");
                    console.log(error);
                })
                .finally(() => {
                    this.loadingReps = false;
                });
        },



    },
};

</script>
