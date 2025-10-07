<template>
    <div>
        <!-- Ordenamiento concurrencia -->
        <v-row dense>
            <v-col cols="11" sm="11" md="11">
                <v-alert text dense border="left" color="blue-grey" icon="mdi-room-service">Ordenamiento</v-alert>
            </v-col>
            <v-col cols="1">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon @click="registrarOrdenamiento = true">
                            <v-icon>mdi-plus-circle-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Agregar ordenamiento</span>
                </v-tooltip>
            </v-col>
        </v-row>
        <v-form v-if="this.registrarOrdenamiento == true">
            <v-container fluid>
                <v-row dense>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete dense :items="todosCups" item-text="nombre" item-value="id" label="Cup"
                            :search-input.sync="cup" v-model="formOrdenamiento.cup_id">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field type="number" min="1" v-model="formOrdenamiento.cantidad" label="Cantidad" dense>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field type="number" min="1" v-model="formOrdenamiento.costo" label="Costo"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-btn small color="success" @click="guardarOrden()">Registrar<v-icon right>mdi-plus
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
        <div v-if="this.ordenamientos.length > 0">
            <v-row>
                <v-col cols="8" sm="8" md="8">
                    <v-alert icon="mdi-history" text dense border="left" color="info">Histórico registros de
                        ordenamientos
                    </v-alert>
                </v-col>
                <v-col cols="4" sm="4" md="4">
                    <v-alert icon="mdi-currency-usd" text dense border="left" type="info">Costo total:
                        <b>{{ this.totalOrden }}</b>
                    </v-alert>
                </v-col>
            </v-row>
            <v-data-table dense no-data-text="Aún no hay registros" :headers="headersOrdenamientos"
                :items="ordenamientos">
                <template v-slot:[`item.usuario_registra_personalizado`]="{ item }">
                    {{ item.user?.operador?.nombre || '' }} {{ item.user?.operador?.apellido || '' }}
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon small color="error" @click="eliminarOrdenamiento(item)">
                                    mdi-delete
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Eliminar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonOrdenamientoConcurrencia',

    data() {
        return {
            registrarOrdenamiento: false,
            formOrdenamiento: {
                cantidad: null,
                costo: null,
                cup_id: null,
                ingreso_concurrencia_id: null,
                user_id: null,
            },
            todosCups: [],
            cups: [],
            cup: null,
            ordenamientos: [],
            headersOrdenamientos: [{
                text: 'id',
                value: 'id',
            },
            {
                text: 'CUP',
                align: 'start',
                sortable: false,
                value: 'cup.CodigoNombre',
            },
            {
                text: 'Cantidad',
                value: 'cantidad',
                sortable: false,
            },
            {
                text: 'Costo',
                value: 'costo',
                sortable: false,
            },
            {
                text: 'Usuario registra',
                value: 'usuario_registra_personalizado',
                sortable: false,
            },
            {
                text: 'Acciones',
                value: 'acciones',
                sortable: false,
            },
            ],
        };
    },

    watch: {
        cup(val) {
            if (val) {
                if (val.length > 4) {
                    this.getCups();
                }
            }
        },

    },

    props: {
        IngresoConcurrencia: {
            type: Number,
            default: {},
        }
    },

    mounted() {
        this.listarOrden()
    },

    methods: {
        getCups() {
            this.$axios.post("/cup/listar?page=0", {
                cups: this.cup
            })
                .then((res) => {
                    if (res.data.data.length >= 2) {
                        this.todosCups = res.data.data.map((cup) => {
                            return {
                                id: cup.id,
                                nombre: cup.CodigoNombre,
                            }
                        })
                    } else if (res.data.data.length == 1) {
                        this.todosCups = res.data.data.map((cup) => {
                            return {
                                id: cup.id,
                                nombre: cup.CodigoNombre,
                            }
                        })
                    }
                }).catch(e => {
                    console.log(e);
                })
        },

        guardarOrden() {
            if (this.formOrdenamiento.costo == null || this.formOrdenamiento.cantidad == null || this
                .formOrdenamiento.cup_id == null) {
                return this.$toast.error('Debe llenar todos los campos')
            }
            this.formOrdenamiento.ingreso_concurrencia_id = this.IngresoConcurrencia
            this.formOrdenamiento.user_id = this.$store.state.auth.usuario.id
            this.$axios.post('/concurrencia/ordenamiento', this.formOrdenamiento)
                .then(res => {
                    this.$toast.success('Se ha registrado el complemento correctamente!.')
                    this.formOrdenamiento.costo = null
                    this.formOrdenamiento.cantidad = null
                    this.formOrdenamiento.cup_id = null
                    this.listarOrden()
                }).catch(e => {
                    console.log('error', e);
                })
        },

        listarOrden() {
            this.$axios.get('/concurrencia/ordenamiento/' + this.IngresoConcurrencia)
                .then(res => {
                    this.ordenamientos = res.data

                    let total = 0;
                    this.ordenamientos.forEach(item => {
                        total += item.costo * item.cantidad;
                    });

                    const formatter = new Intl.NumberFormat('es-ES', {
                        style: 'decimal',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    });

                    this.totalOrden = formatter.format(total);
                    console.log('Total:', this.totalOrden);
                }).catch(e => {
                    console.log(e.response.data);
                })
        },

        eliminarOrdenamiento(item) {
            this.$axios.post('/concurrencia/eliminarOrdenamientos/', {
                id: item.id
            })
                .then(res => {
                    this.listarOrden()
                    return this.$toast.error('Se ha eliminado la orden correctamente!.')
                }).catch(e => {
                    console.log(e);
                })
        },

    },
};

</script>
