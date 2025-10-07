<template>
    <div>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Parametrizacíon tipo historia clinica</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>

            <v-data-table :items="tiposHistoria" :loading="loading.loadingTipoHistoria" :headers="headers" :search="buscar">
                <template v-slot:top>
                    <v-card-title>
                        <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogTipoHistoria()">
                            Crear nuevo tipo de historia
                            <v-icon right>
                                mdi-plus-circle-outline
                            </v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details
                            single-line>
                        </v-text-field>
                    </v-card-title>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on" color="warning" @click="abrirDialogoEditar(item)">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    {{item.created_at?.substring(0,10)}}
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogTipoHistoria" max-width="900px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>{{ modoEdicion ? 'Editar tipo de historia clinica' : 'Crear tipo de historia clinica'}}</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form ref="formTipoHistoria">
                        <v-col cols="12">
                            <v-text-field v-model="tipoHistoria.nombre" label="Nombre" :rules="campoRequerido" dense outlined></v-text-field>
                        </v-col>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarDialogo()">Cerrar<v-icon right>mdi-close</v-icon>
                    </v-btn>
                    <v-btn color="success" small
                        @click="modoEdicion ? actualizarTipoHistoria(tipoHistoria) : crearTipoHistoria()"
                        :loading="loading.crear">Guardar<v-icon right>mdi-check-bold</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogTipoHistoria: false,
                buscar: '',
                tiposHistoria: [],
                modoEdicion: false,
                campoRequerido: [
                    v => !!v || 'Este campo es requerido',
                ],
                loading: {
                    loadingTipoHistoria: false,
                    crear: false
                },
                headers: [{
                        text: '#',
                        value: 'id'
                    },
                    {
                        text: 'Nombre',
                        value: 'nombre'
                    },
                    {
                        text: 'Fecha de creación',
                        value: 'created_at'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones'
                    }
                ],
                tipoHistoria: {
                    nombre: ''
                }
            }
        },

        mounted() {
            this.listarTiposHistoria()
        },

        methods: {
            abrirDialogTipoHistoria() {
                this.modoEdicion = false;
                this.dialogTipoHistoria = true;
            },

            listarTiposHistoria() {
                this.loading.loadingTipoHistoria = true
                this.$axios.get('tipo-historia/').then((res) => {
                    this.tiposHistoria = res.data;
                }).catch(() => {
                    this.$toast.error('Error al cargar tipos de historia')
                }).finally(() => {
                    this.loading.loadingTipoHistoria = false
                })
            },

            crearTipoHistoria() {
                if(!this.$refs.formTipoHistoria.validate()) return;
                this.loading.crear = true
                this.$axios.post('tipo-historia/crear-tipo-historia', this.tipoHistoria).then(() => {
                    this.$toast.success('Tipo de historia creado con éxito');
                    this.cerrarDialogo();
                    this.listarTiposHistoria();
                }).catch(() => {
                    this.$toast.error('Error al crear tipo de historia')
                }).finally(() => {
                    this.loading.crear = false
                })
            },

            abrirDialogoEditar(item) {
                this.modoEdicion = true;
                this.tipoHistoria = {
                    ...item
                }
                this.dialogTipoHistoria = true;
            },

            cerrarDialogo() {
                this.dialogTipoHistoria = false;
                this.tipoHistoria = {};
                this.$refs.formTipoHistoria.resetValidation();
            },

            actualizarTipoHistoria(item) {
                if(!this.$refs.formTipoHistoria.validate()) return;
                this.loading.crear = true
                this.$axios.put('tipo-historia/actualizar-tipo-historia/' + item.id, item).then(() => {
                    this.$toast.success('Actualizado con éxito');
                    this.cerrarDialogo();
                    this.listarTiposHistoria();
                }).catch(() => {
                    this.$toast.error('Error al actualizar tipo de historia')
                }).finally(() => {
                    this.loading.crear = false
                })
            }
        }
    }

</script>
