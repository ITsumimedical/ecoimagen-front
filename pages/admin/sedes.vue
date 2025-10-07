<template>

    <v-card>

        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Sedes</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn small color="boton" dark @click="dialog = true">
                    crear nueva sede 
                    <v-icon dark right>
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </v-toolbar>
        </v-card-title>

        <v-card-text>

            <v-data-table :headers="headers" dense :search="search" :items="sedes" sort-by="id" :loading="loading"
                loading-text="Cargando..." no-data-text="Sin datos para mostrar">

                <template v-slot:top>
                    <v-toolbar flat>
                        <v-row>
                            <v-col md="5" lg="5" xl="5" sm="6" cols>
                                <v-text-field dense v-model="search" label="Buscar ..." single-line>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </v-toolbar>
                </template>

                <template v-slot:[`item.activo`]="{ item }">
                    <v-chip small :color="chipEstado(item.activo)" dark>{{ item.activo == '1' ? 'Activo' : 'Inactivo'
                        }}</v-chip>
                </template>

                <template v-slot:[`item.propia`]="{ item }">
                    <v-chip small :color="chipPropia(item.propia)" dark>{{ item.propia == '1' ? 'Propia' : 'Externa'
                        }}</v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                    @click="editar(item)">
                                    mdi-pencil
                                </v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="info" class="mr-2" v-bind="attrs" v-on="on"
                                    @click="deleteItemConfirm(item)">
                                    mdi-list-status
                                </v-icon>
                            </template>
                            <span>{{ item.estado == true ? 'Inactivar' : 'Activar' }}</span>
                        </v-tooltip>
                    </div>
                </template>

            </v-data-table>

        </v-card-text>

        <v-dialog v-model="dialog" max-width="1000px" persistent>
            <v-card>
                <v-alert border="left" dense text type="info">{{ titulo }}</v-alert>
                <form @submit.prevent="guardarSede">
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field dense v-model="sede.nombre" label="Nombre"
                                    :error-messages="errors.nombre">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field dense v-model="sede.direccion" label="Dirección"
                                    :error-messages="errors.direccion">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field dense v-model="sede.telefono" label="Teléfono">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-menu ref="fechiaInicio" v-model="menu2" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="sede.hora_inicio"
                                    transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field dense v-model="sede.hora_inicio" label="Hora de apertura"
                                            :error-messages="errors.hora_inicio"
                                            prepend-icon="mdi-clock-time-four-outline" readonly v-bind="attrs"
                                            v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker v-if="menu2" v-model="sede.hora_inicio" full-width
                                        @click:minute="$refs.fechiaInicio.save(sede.hora_inicio)">
                                    </v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-menu ref="fechiaFin" v-model="menu1" :close-on-content-click="false"
                                    :nudge-right="40" :return-value.sync="sede.hora_fin" transition="scale-transition"
                                    offset-y max-width="290px" min-width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field dense v-model="sede.hora_fin" label="Hora de cierre"
                                            :error-messages="errors.hora_fin" prepend-icon="mdi-clock-time-four-outline"
                                            readonly v-bind="attrs" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker v-if="menu1" v-model="sede.hora_fin" full-width
                                        @click:minute="$refs.fechiaFin.save(sede.hora_fin)">
                                    </v-time-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-autocomplete dense item-text="nombre" :items="reps" v-model="sede.rep_id"
                                    item-value="id" label="Registro en el Reps" :error-messages="errors.rep_id"
                                    :search-input.sync="rep">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="4" sm="6" md="3">
                                <v-switch dense v-model="sede.propia" label="Sede propia">
                                </v-switch>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" @click="close()">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="guardarSede()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="550px">
            <v-card>
                <v-card-title class="text-h6">¿Deseas {{ editedItem.activo == true ? 'Inactivar' : 'Activar'
                    }}
                    este
                    tipo de
                    sede?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" dark @click="closeDelete">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small color="boton" dark @click="deleteItemConfirm(editedItem)">
                        {{ editedItem.activo == true ? 'Inactivar' : 'Activar' }}</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonSedes',

    data() {
        return {
            search: null,
            time: null,
            menu2: false,
            menu1: false,
            modal2: false,
            loading: false,
            dialog: false,
            dialogoEditar: false,
            dialogDelete: false,
            buscarSede: '',
            sedes: [],
            reps: [],
            rep: null,
            sede: {
                nombre: '',
                direccion: '',
                telefono: '',
                hora_inicio: '',
                hora_fin: '',
                propia: false,
                activo: true,
                rep_id: '',
            },
            editedIndex: -1,
            editedItem: {},
            defecto: {
                nombre: '',
                direccion: '',
                telefono: '',
                hora_inicio: '',
                hora_fin: '',
                propia: false,
                activo: false,
                rep_id: '',
            },
            errors: {
                nombre: '',
                direccion: '',
                telefono: '',
                hora_inicio: '',
                hora_fin: '',
                rep_id: '',
            },
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre',
                value: 'nombre'
            },
            {
                text: 'Dirección',
                value: 'direccion'
            },
            {
                text: 'Teléfono',
                value: 'telefono'
            },
            {
                text: 'Hora apertura',
                value: 'hora_inicio'
            },
            {
                text: 'Hora cierre',
                value: 'hora_fin'
            },
            {
                text: 'Sede propia',
                value: 'propia'
            },
            {
                text: 'Estado',
                value: 'activo'
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
            ],
        };
    },

    mounted() {
        this.listarSedes();
    },

    computed: {
        titulo() {
            return this.editedIndex === -1 ? 'Creación de sede' : 'Actualización de sede'
        },
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 5) {
                    this.listarReps();
                } else if (val.length < 5) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.sede = Object.assign({}, this.defecto)
                this.editedIndex = -1
            })
            this.limpiarError()
        },

        async listarSedes() {
            try {
                this.setPreload(true)
                const response = await this.$axios.get('/sede/listar')
                this.sedes = response.data.data
            } catch (error) {
                console.log(error)
            } finally {
                this.setPreload(false)
            }
        },

        chipEstado(activo) {
            if (activo == '1') return 'success'
            else if (activo == '0') return 'error'
            else return 'warning'
        },

        chipPropia(propia) {
            if (propia == '1') return 'info'
            else if (propia == '0') return 'warning'
            else return 'warning'
        },

        async guardarSede() {
            this.limpiarError()
            if (this.editedIndex > -1) {
                try {
                    const {
                        data
                    } = await this.$axios.put('/sede/' + this.sede.id, this.sede)
                    this.$toast.success(data.mensaje)
                    this.listarSedes()
                    this.close()
                } catch (error) {
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data)
                    }
                }
            } else {
                try {
                    this.sede.activo = 1
                    const {
                        data
                    } = await this.$axios.post('/sede/crear', this.sede)
                    this.$toast.success('Se ha creado la sede exitosamente!.')
                    this.listarSedes()
                    this.close()
                } catch (error) {
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data)
                    }
                }
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

        editar(item) {
            this.editedIndex = this.sedes.indexOf(item)
            this.sede = Object.assign({}, item)
            this.dialog = true

        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        deleteItemConfirm(item) {
            return this.$swal({
                title: "¿Está Seguro?",
                text: "Deseas cambiar el estado de esta sede",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    const request = {
                        'activo': item.activo == 1 ? 0 : 1,
                        'direccion': item.direccion,
                        'hora_fin': item.hora_fin,
                        'hora_inicio': item.hora_inicio,
                        'nombre': item.nombre,
                    };
                    this.$axios.put('/sede/' + item.id, request).then(res => {
                        this.$toast.success(res.data.mensaje)
                        this.listarSedes()
                        this.closeDelete()
                    }).catch(error => {
                        if (error.response.data.error) {
                            this.$toast.error(error.response.data.error)
                        } else if (error.response.data) {
                            this.ErrorEntrada(error.response.data)
                        }
                    });
                }
            });

        },

        /**
         * Obtiene los reps
         */
        async listarReps() {
            try {
                const response = await this.$axios.post('reps/listarConfiltro?page=0', { rep: this.rep })
                this.reps = response.data.map((rep) => {
                    return {
                        id: rep.id,
                        nombre: rep.nombre,
                    }
                })
            } catch (error) {
                console.log(error)
            }
        },
    },
};

</script>
