<template>

    <v-card class="rounded-xxl">
        <v-card-title>

            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                        <span>Entidades</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="success" small class="mb-2 white--text" @click="dialog = true">
                    Crear Entidad
                    <v-icon dark right>
                        mdi-plus-circle-outline
                    </v-icon>
                </v-btn>
            </v-toolbar>

        </v-card-title>
        <v-card-text>
            <!-- tabla -->
            <v-data-table dense :headers="headers" :items="entidades" loading-text="Cargando..."
                no-data-text="Sin datos para mostrar" :search="search" item-key="id">

                <template v-slot:top>
                    <v-row class="mx-2">
                        <v-col md="5" lg="5" xl="5" sm="6" cols>
                            <v-text-field dense v-model="search" label="Buscar ..." single-line>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </template>

                <!-- Opciones de editar y cambiar estado -->
                <template v-slot:[`item.estado`]="{ item }">
                    <v-chip small :color="chipsEstado(item.estado)" dark>{{ item.estado == true ? 'Activa' : 'Inactiva'
                        }}
                    </v-chip>
                </template>

                <!-- Chips checkbox configuracion -->
                <template v-slot:[`item.agendar_pacientes`]="{ item }">
                    <v-chip small :color="chipsControl(item.agendar_pacientes)" dark>
                        {{ item.agendar_pacientes == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.atender_pacientes`]="{ item }">
                    <v-chip small :color="chipsControl(item.atender_pacientes)" dark>
                        {{ item.atender_pacientes == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.autorizar_ordenes`]="{ item }">
                    <v-chip small :color="chipsControl(item.autorizar_ordenes)" dark>
                        {{ item.autorizar_ordenes == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.consultar_historicos`]="{ item }">
                    <v-chip small :color="chipsControl(item.consultar_historicos)" dark>
                        {{ item.consultar_historicos == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.entregar_medicamentos`]="{ item }">
                    <v-chip small :color="chipsControl(item.entregar_medicamentos)" dark>
                        {{ item.entregar_medicamentos == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.generar_ordenes`]="{ item }">
                    <v-chip small :color="chipsControl(item.generar_ordenes)" dark>
                        {{ item.generar_ordenes == true ? 'Habilitado' : 'inhabilitado' }}</v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex">

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                    @click="editItem(item)">
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

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="success" small class="mr-2" v-bind="attrs" v-on="on"
                                    @click="agregarImagen(item.id)">
                                    mdi-camera
                                </v-icon>
                            </template>
                            <span>Agregar imagen</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                    @click="editarImagen(item.imagenes)">
                                    mdi-camera-party-mode
                                </v-icon>
                            </template>
                            <span>Editar imagen</span>
                        </v-tooltip>
                    </div>
                </template>

            </v-data-table>

        </v-card-text>

        <!-- form editar y crear -->
        <v-dialog v-model="dialog" max-width="800px" persistent>
            <v-card :loading="loading.form" :disabled="loading.form">
                <v-card-title class="titulo black--text">
                    {{ formTitle }}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="editedItem.nombre" label="Nombre" :error-messages="errors.nombre">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-alert border="left" dense text type="info">Determine los permisos en aplicativo
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.agendar_pacientes" label="Agendar pacientes">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.entregar_medicamentos" label="Entregar medicamentos">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.atender_pacientes" label="Atender pacientes">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.autorizar_ordenes" label="Autorizar ordenes">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.consultar_historicos" label="Consultar historia">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-switch dense v-model="editedItem.generar_ordenes" label="Generar ordenamiento">
                            </v-switch>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" dark @click="close()">
                        Cancelar
                    </v-btn>
                    <v-btn small color="boton" dark @click="saveEntidad()">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="800px">
            <v-card>
                <!-- activar o inactivar -->
                <v-card-title class="titulo black--text">¿Está seguro de {{ editedItem.estado == true ?
                    'inactivar' : 'activar' }}
                    la
                    entidad {{ editedItem.nombre }}?
                </v-card-title>
                <v-alert outlined dense text type="info">El proceso de activación o inactivación se podrá realizar
                    nuevamente
                </v-alert>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small color="error" dark @click="closeDelete()">Cancelar</v-btn>
                    <v-btn small color="boton" dark @click="deleteItemConfirm(editedItem)">
                        {{ editedItem.estado == true ? 'Inactivar' : 'Activar' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalImagen" v-if="modalImagen" persistent max-width="600px">
            <v-card>
                <v-col>
                    <v-alert type="info" dense text outlined icon="mdi-chart-line"><b>Guardar imagen </b></v-alert>
                </v-col>
                <v-card-text>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Titulo*" v-model="imagen.nombre" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <input type="file" ref="fileInput" accept="image/*" multiple />
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="modalImagen = false" small>Cerrar</v-btn>
                    <v-btn color="success" @click="guardarImagen()" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalEditarImagenEspe" v-if="modalEditarImagenEspe" persistent max-width="600px">
            <v-card>
                <v-col>
                    <v-alert type="info" dense text outlined icon="mdi-chart-line"><b>Editar imagen </b></v-alert>
                </v-col>
                <v-card-text>

                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Titulo*" v-model="dataImagen.nombre" required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field label="Imagen" v-model="dataImagen.ruta" @click="cargaImagen"
                                prepend-icon="mdi-attachment"></v-text-field>
                            <input type="file" style="display: none" ref="fileInputImagen" accept="image/*"
                                @change="onFileChange" />
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="modalEditarImagenEspe = false" small>Cerrar</v-btn>
                    <v-btn color="success" @click="editarImagenEntidad()" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="modalEditarImagen" v-if="modalEditarImagen" persistent max-width="600px">
            <v-card>
                <v-col>
                    <v-alert type="info" dense text outlined icon="mdi-chart-line"><b>Editar imagen </b></v-alert>
                </v-col>
                <v-card-text>

                    <v-row>
                        <v-data-table dense :headers="headersImagenes" :items="listaImagenes" :loading="loading"
                            loading-text="Cargando..." no-data-text="Sin datos para mostrar" item-key="id">
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="infoImagen(item)">
                                            mdi-camera
                                        </v-icon>
                                    </template>
                                    <span>Editar imagen</span>
                                </v-tooltip>

                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="red" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="eliminar(item.id)">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar imagen</span>
                                </v-tooltip>

                            </template>
                        </v-data-table>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" dark @click="modalEditarImagen = false" small>Cerrar</v-btn>
                    <v-btn color="success" @click="guardarImagen()" small>Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>

</template>

<script>
import { mapActions } from "vuex";
export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can('blog.vista')) {
            return redirect('/');
        }
    },
    data: () => ({
        search: null,
        imagen: {
        },
        modalEditarImagen: false,
        preload: false,
        loading: {
            form: false
        },
        dialog: false,
        dialogDelete: false,
        headers: [{
            text: 'ID',
            value: 'id',
        },
        {
            text: 'Nombre entidad',
            value: 'nombre'
        },
        {
            text: 'Agendar pacientes',
            value: 'agendar_pacientes',
            align: 'center'
        },
        {
            text: 'Atender pacientes',
            value: 'atender_pacientes',
            align: 'center'
        },
        {
            text: 'Autorizar ordenes',
            value: 'autorizar_ordenes',
            align: 'center'
        },
        {
            text: 'Consultar historicos',
            value: 'consultar_historicos',
            align: 'center'
        },
        {
            text: 'Entregar medicamentos',
            value: 'entregar_medicamentos',
            align: 'center'
        },
        {
            text: 'Generar ordenes',
            value: 'generar_ordenes',
            align: 'center'
        },
        {
            text: 'Estado',
            value: 'estado',
            align: 'center'
        },
        {
            text: 'Acciones',
            value: 'actions',
            sortable: false
        },
        ],
        headersImagenes: [{
            text: 'ID',
            value: 'id',
        },
        {
            text: 'Titulo',
            value: 'nombre'
        },
        {
            text: 'Ruta',
            value: 'ruta',

        },
        {
            text: 'Acciones',
            value: 'actions',
            sortable: false
        },
        ],
        entidades: [],
        editedIndex: -1,
        editedItem: {
            nombre: '',
            agendar_pacientes: false,
            entregar_medicamentos: false,
            atender_pacientes: false,
            autorizar_ordenes: false,
            consultar_historicos: false,
            generar_ordenes: false,
        },
        defaultItem: {
            nombre: '',
        },
        errors: {
            nombre: '',
        },
        buscar: '',
        modalImagen: false,
        entidadImagen: '',
        imagenes: [],
        listaImagenes: [],
        dataImagen: {},
        modalEditarImagenEspe: false
    }),
    mounted() {
        this.listarEntidades();
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Crear entidad' : 'Editar entidad';
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.listarEntidades()
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        /**
         * listar entidades
         * @return objeto entidades
         * @author kobatime
         * @remake David Pelaez
         */
        async listarEntidades() {
            try {
                this.setPreload(true);
                const response = await this.$axios.post('/entidad/listar')
                this.entidades = response.data;
            } catch (error) {
                console.error(error)
            } finally {
                this.setPreload(false)
            }
        },

        editItem(item) {
            this.editedIndex = this.entidades.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItemConfirm(item) {
            return this.$swal({
                title: "¿Está Seguro?",
                text: "Deseas cambiar el estado de esta entidad",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(async (result) => {
                if (result.value) {
                    const request = {
                        'estado': item.estado == 1 ? 0 : 1,
                        'nombre': item.nombre,
                    };
                    this.$axios.put('/entidad/' + item.id, request).then(res => {
                        this.$toast.success(res.data.mensaje)
                        this.listarEntidades()
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

        close() {
            this.dialog = false
            this.limpiarError()
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        async saveEntidad() {
            this.limpiarError()
            try {
                this.loading.form = true
                if (this.editedIndex > -1) {
                    const response = await this.$axios.put('/entidad/' + this.editedItem.id, this.editedItem)
                    this.$toast.success('Se ha actualizado la entidad exitosamente!.')
                } else {
                    const response = await this.$axios.post('/entidad/', this.editedItem)
                    this.$toast.success('Se ha creado la entidad exitosamente!.')
                }
                this.listarEntidades()
                this.close()
            } catch (error) {
                if (error.response.data.error) {
                    this.$toast.error(error.response.data.error)
                } else if (error.response.data) {
                    this.ErrorEntrada(error.response.data)
                }
            } finally {
                this.loading.form = false
            }
        },

        /**
         * listado de errores
         * @param object errors,
         * @return object errors
         * @author kobatime
         */
        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        /**
         * limpiar errores
         * @return object juzgados
         * @author kobatime
         */
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },

        /**
         * Color de estado
         * @return color
         * @author kobatime
         */
        chipsControl(item) {
            if (item == true) return 'info'
            else if (item == false) return 'blue-grey'
            else return 'warning'
        },

        chipsEstado(estado) {
            if (estado == true) return 'success'
            else if (estado == false) return 'error'
            else return 'warning'
        },

        agregarImagen(entidad) {
            this.modalImagen = true
            this.entidadImagen = entidad
        },

        guardarImagen() {
            this.preload = true;
            this.imagenes = this.$refs.fileInput.files
            const formData = new FormData();
            formData.append("nombre", this.imagen.nombre);
            formData.append("entidad_id", this.entidadImagen);
            for (let i = 0; i < this.imagenes.length; i++) {
                formData.append(`imagenes[]`, this.imagenes[i]);
            }

            this.$axios
                .post("/imagenes/crear", formData)
                .then((res) => {
                    this.preload = false;
                    this.listarEntidades();
                    // this.estadistica.imagen = res.data.file_path;
                    // this.$toast.success("Estadística guardada exitosamente.");
                    this.modalImagen = false;
                    // this.estadistica = {
                    //   titulo: "",
                    //   imagen: "",
                    //   inframe: "",
                    //   permission_id: "",
                    // };
                })
                .catch((err) => {
                    this.preload = false;
                    this.$toast.error(
                        "Error al guardar la estadística. Por favor, inténtalo de nuevo."
                    );
                });
        },

        editarImagen(imagenes) {
            this.listaImagenes = imagenes
            this.modalEditarImagen = true
        },

        editarImagenEntidad(data) {

            const formData = new FormData();
            formData.append("nombre", this.dataImagen.nombre);
            formData.append("nombre_imagen", this.dataImagen.nombre_imagen);
            formData.append("id", this.dataImagen.id);
            formData.append("imagen", this.$refs.fileInputImagen.files[0]);


            this.$axios
                .post("/imagenes/actualizar", formData)
                .then((res) => {
                    this.preload = false;
                    this.listarEntidades();
                    this.modalEditarImagen = false
                    this.modalEditarImagenEspe = false
                })
                .catch((err) => {
                    this.preload = false;
                    this.$toast.error(
                        "Error. Por favor, inténtalo de nuevo."
                    );
                });
        },

        infoImagen(data) {
            this.dataImagen = data
            this.modalEditarImagenEspe = true
        },

        cargaImagen() {
            this.$refs.fileInputImagen.click();
        },

        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                // this.estadistica.imagen_nombre = file.name;
                this.dataImagen.ruta = URL.createObjectURL(file);
            }
        },

        eliminar(imagen) {
            this.$axios
                .post("/imagenes/eliminar", { id: imagen })
                .then((res) => {
                    this.preload = false;
                    this.listarEntidades();
                    this.modalEditarImagen = false
                    this.modalEditarImagenEspe = false
                })
                .catch((err) => {
                    this.preload = false;
                    this.$toast.error(
                        "Error. Por favor, inténtalo de nuevo."
                    );
                });
        }



    }
}

</script>
