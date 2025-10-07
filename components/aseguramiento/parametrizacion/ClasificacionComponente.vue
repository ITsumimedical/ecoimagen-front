<template>
    <div>
        <v-card>
            <v-data-table dense :headers="headersClasificacion" :items="clasifiacion" :search="buscar"
                class="elevation-1" :loading="loading" loading-text="Cargando..." no-data-text="Sin datos para mostrar"
                :server-items-length="paginacion.total" :items-per-page="paginacion.itemsPerPage"
                :page.sync="paginacion.page" @update:options="options = $event">
                <template v-slot:top>
                    <v-card-title>
                        <v-toolbar flat>
                            <v-btn small color="boton" dark class="ma-2" @click="dialogclasifiacion = true">
                                Crear Clasificación
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar..." single-line
                                hide-details @input="listarClasificacion"></v-text-field>
                        </v-toolbar>
                    </v-card-title>
                </template>

                <!-- Estado -->
                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip label small :color="getColor(item.estado)" dark>
                        {{ item.estado ? 'Activo' : 'Inactivo' }}
                    </v-chip>
                </template>

                <!-- Color -->
                <template v-slot:[`item.color`]="{ item }">
                    <v-chip small label
                        :style="{ backgroundColor: item.color || 'white', width: '24px', height: '24px' }">
                    </v-chip>
                </template>

                <!-- Acciones -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-row>
                        <v-col cols="3" class="mr-3">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on" @click="editItemClasificacion(item)">
                                        <v-icon color="warning">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="3">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on" @click="deleteItemAfiliado(item)">
                                        <v-icon color="error">mdi-eye-off</v-icon>
                                    </v-btn>
                                </template>
                                <span>Activar/inactivar</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </template>
            </v-data-table>

            <v-dialog v-model="dialogclasifiacion" max-width="500px">
                <v-card :loading="loading" :disabled="loading">
                    <v-alert text outlined dense type="info">
                        {{ formTitle }}
                    </v-alert>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="editedItem.nombre" label="Nombre"
                                    :error-messages="errors.nombre">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow v-model="editedItem.descripcion" label="Descripción"
                                    :error-messages="errors.descripcion">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-select v-model="editedItem.color" :items="colors" item-text="name" item-value="code"
                                    label="Elige un color" return-object dense>
                                    <template v-slot:item="slotProps">
                                        <v-list-item-content>
                                            <v-list-item-title
                                                :style="{ color: getContrastingTextColor(slotProps.item.code), backgroundColor: slotProps.item.code }">
                                                {{ slotProps.item.name }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" dark @click="closeClasificacion()">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="guardarClasificacion()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- dialogo de crear o editar -->
            <v-dialog v-model="dialogclasifiacion" max-width="500px">
                <v-card :loading="loading" :disabled="loading">
                    <v-alert text outlined dense type="info">
                        {{ formTitle }}
                    </v-alert>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="editedItem.nombre" label="Nombre"
                                    :error-messages="errors.nombre">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow v-model="editedItem.descripcion" label="Descripción"
                                    :error-messages="errors.descripcion">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-select v-model="editedItem.color" :items="colors" item-text="name" item-value="code"
                                    label="Elige un color" return-object dense>
                                    <template v-slot:item="slotProps">
                                        <v-list-item-content>
                                            <v-list-item-title
                                                :style="{ color: getContrastingTextColor(slotProps.item.code), backgroundColor: slotProps.item.code }">
                                                {{ slotProps.item.name }}
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" dark @click="closeClasificacion()">
                            Cancelar
                        </v-btn>
                        <v-btn small color="boton" dark @click="guardarClasificacion()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                    <v-alert class="text-center" type="info" dense text outlined>¿Deseas
                        {{ editedItem.estado == true ? 'Inactivar' : 'Activar' }} esta
                        clasificación?
                    </v-alert>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small color="error" dark @click="closeDelete()">Cancelar</v-btn>
                        <v-btn small color="boton" dark @click="deleteItemConfirm(editedItem)">
                            {{ editedItem.estado == true ? 'Inactivar' : 'Activar' }}</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card>
    </div>
</template>

<script>
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    name: 'WorkspaceJsonParametrizacion',

    data() {
        return {
            show: '',
            dialogDelete: false,
            dialogclasifiacion: false,
            loading: false,
            clasifiacion: [],
            buscar: null,
            colors: [{
                name: 'Rojo',
                code: '#FF0000'
            },
            {
                name: 'Verde',
                code: '#00FF00'
            },
            {
                name: 'Azul',
                code: '#0000FF'
            },
            {
                name: 'Amarillo',
                code: '#FFFF00'
            },
            {
                name: 'Naranja',
                code: '#FFA500'
            },
            {
                name: 'Violeta',
                code: '#8A2BE2'
            },
            {
                name: 'Negro',
                code: '#000000'
            },
            {
                name: 'Blanco',
                code: '#FFFFFF'
            },
            {
                name: 'Gris',
                code: '#808080'
            }
            ],
            headersClasificacion: [{
                text: 'Id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Nombre',
                align: 'start',
                sortable: false,
                value: 'nombre',
            },
            {
                text: 'Descripción',
                align: 'start',
                sortable: false,
                value: 'descripcion',
            },
            {
                text: 'Color',
                sortable: false,
                value: 'color',
                align: 'center'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado',
                align: 'center'
            },
            {
                text: 'Acciones',
                value: 'actions',
                align: 'center',
                sortable: false
            }
            ],
            paginacion: {
                page: 1,
                itemsPerPage: 10,
                sortBy: [],
                sortDesc: [],
                total: 0,
            },
            options: {},
            errors: {
                nombre: null,
                descripcion: null,
                color: null
            },
            desserts: [],
            editedIndex: -1,
            editedItem: {
                nombre: '',
                descripcion: '',
                color: '',
            },
            defaultItem: {
                nombre: '',
                descripcion: '',
                color: ''
            },
            getContrastingTextColor(hexColor) {
                const rgb = this.hexToRgb(hexColor);
                const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
                return luminance > 128 ? 'black' : 'white';
            },


            // Función para convertir un color hexadecimal a RGB
            hexToRgb(hex) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return {
                    r,
                    g,
                    b
                };
            },
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Crear Clasificacion' : 'Editar Clasificacion'
        },
    },

    created() {
        this.listarClasificacion()
    },

    watch: {
        options: {
            handler(val) {
                if (val.page !== this.paginacion.page || val.itemsPerPage !== this.paginacion.itemsPerPage) {
                    this.paginacion.page = val.page
                    this.paginacion.itemsPerPage = val.itemsPerPage
                    this.listarClasificacion()
                }
            },
            deep: true
        }
    },

    methods: {

        /**
         * Funcion listar clasificacion
         * @return objetc clasifiacion
         * @author kobatime
         */
        listarClasificacion() {
            this.loading = true
            this.$axios.get('/clasificacion', {
                params: {
                    page: this.paginacion.page,
                    filas: this.paginacion.itemsPerPage
                }
            }).then(res => {
                this.clasifiacion = res.data.data
                this.paginacion.total = res.data.total
            }).catch(error => {
                this.$toast.error(error.response?.data?.mensaje || 'Error')
            }).finally(() => {
                this.loading = false
            })
        },

        async guardarClasificacion() {
            this.editedItem.color = this.editedItem.color.code
            this.loading = true
            if (this.editedIndex > -1) {
                await this.$axios.put('/clasificacion/' + this.editedItem.id, this.editedItem).then(res => {
                    this.loading = false
                    this.closeClasificacion()
                    this.listarClasificacion()
                }).catch(error => {
                    this.loading = false
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.Error(error.response.data)
                    }
                })
            } else {
                await this.$axios.post('/clasificacion/crear', this.editedItem).then(res => {
                    this.closeClasificacion()
                    this.listarClasificacion()
                    this.editedItem.color = ''
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.Error(error.response.data)
                    }
                })
            }
        },

        deleteItemAfiliado(item) {
            this.editedIndex = this.clasifiacion.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        /**
         * Funcion para abrir modal de editar
         * @param item object
         * @return object
         * @author kobatime
         */
        editItemClasificacion(item) {
            this.editedIndex = this.clasifiacion.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogclasifiacion = true
        },

        /**
         * Cerrar dialogo
         * @return string
         * @author kobatime
         */
        closeClasificacion() {
            this.dialogclasifiacion = false
            this.editedItem.color = ''
            this.limpiarError()
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },


        // funciones globales

        /**
         * Cerrar dialogo de inactivar
         * @return string
         * @author kobatime
         */
        closeDelete() {
            this.dialogDelete = false
            this.limpiarError()
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        /**
         * Funcion para el color de los chips
         * @param estado int
         * @return string
         * @author kobatime
         */
        getColor(estado) {
            if (estado === true) return 'success'
            if (estado === false) return 'error'
            return 'warning'
        },


        /**
         * for de errores para los campos
         * @param error array
         * @return errors
         * @author kobatime
         */
        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        /**
         * for de limpiar errores
         * @param errors array
         * @return errors objetos
         * @author kobatime
         */
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        /**
         * Funcion para inactivar o activar
         * @param item object
         * @return boolean
         * @author kobatime
         */
        deleteItemConfirm(item) {
            if (item.estado == false) {
                item['estado'] = true
            } else {
                item['estado'] = false
            }
            this.$axios.put('/clasificacion/estado/' + item.id, item).then(res => {
                this.closeClasificacion()
                this.listarClasificacion()
                this.closeDelete()
            }).catch(error => {
                this.$toast.error(error.response.data.mensaje)
            })
        },

    },
};

</script>
<style scoped>
.v-select .v-list-item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
