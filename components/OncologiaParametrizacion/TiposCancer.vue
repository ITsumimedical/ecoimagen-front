<template>
    <v-card flat>

        <v-data-table no-data-text="No hay tipos de cáncer registrados" :items="tiposCancer" :search="buscar"
            :loading="loading" :headers="headers">
            <template v-slot:top>
                <v-card-title>
                    <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCancer()">
                        Crear nuevo tipo de cáncer
                        <v-icon right>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                </v-card-title>
            </template>

            <template v-slot:[`item.fechaCreacion`]="{ item }">
                {{ item.created_at?.substring(0,10) }}
            </template>

            <template v-slot:[`item.acciones`]="{ item }">
                <v-icon color="warning" @click="abrirDialogEditar(item)">
                    mdi-pencil
                </v-icon>
            </template>
        </v-data-table>

        <v-dialog max-width="900px" v-model="dialogTipoCancer" persistent>
            <v-card flat>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span> {{ modoEdicion ? 'Editar tipo' : 'Crear nuevo tipo' }}</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>

                <v-form ref="formCancer">
                    <v-col>
                        <v-text-field label="Nombre del tipo de cáncer" outlined dense v-model="nombre"
                            :rules="[rules.required]"></v-text-field>
                    </v-col>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" @click="cerrarModal()" small>Cancelar</v-btn>
                        <v-btn color="success" @click="modoEdicion ? actualizarTipo() : guardarTipo()" small :loading="loading" :disabled="loading">
                            {{ modoEdicion ? 'Actualizar' : 'Crear' }}
                        </v-btn>
                    </v-card-actions>
                </v-form>

            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                buscar: '',
                dialogTipoCancer: false,
                modoEdicion: false,
                nombre: '',
                loading: false,
                tiposCancer: [],
                idTipoCancer: null,
                headers: [{
                        text: '#',
                        value: 'id',
                        align: 'center',
                    },
                    {
                        text: 'Nombre',
                        value: 'nombre',
                        align: 'center',
                    },
                    {
                        text: 'Fecha de creación',
                        value: 'fechaCreacion',
                        align: 'center',
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones',
                        align: 'center',
                    }
                ],
                rules: {
                    required: v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido',
                },
            }
        },

        mounted() {
            this.listarCancer();
        },

        methods: {
            abrirDialogoCancer() {
                this.modoEdicion = false;
                this.dialogTipoCancer = true;
            },

            cerrarModal() {
                this.nombre = '';
                this.dialogTipoCancer = false;
                this.modoEdicion = false;
                this.$refs.formCancer.resetValidation();
            },

            guardarTipo() {
                if (!this.$refs.formCancer.validate()) return;
                this.loading = true;
                this.$axios.post('tipo-cancer/crear-tipo-cancer', {
                    nombre: this.nombre
                }).then(() => {
                    this.$toast.success('Tipo de cáncer guardado correctamente');
                    this.cerrarModal();
                    this.listarCancer();
                }).catch(error => {
                    this.$toast.error('Error al guardar el tipo de cáncer');
                }).finally(() => {
                    this.loading = false;
                });
            },

            listarCancer() {
                this.loading = true;
                this.$axios.get('tipo-cancer/listar-tipo-cancer').then(response => {
                    this.tiposCancer = response.data;
                }).catch(error => {
                    this.$toast.error('Error al cargar los tipos de cáncer');
                }).finally(() => {
                    this.loading = false;
                });
            },

            abrirDialogEditar(item) {
                this.modoEdicion = true;
                this.dialogTipoCancer = true;
                this.nombre = item.nombre;
                this.idTipoCancer = item.id;
            },

            actualizarTipo() {
                if(!this.$refs.formCancer.validate()) return;
                this.loading = true;
                this.$axios.put('tipo-cancer/actualizar-tipo-cancer/' + this.idTipoCancer, {
                    nombre: this.nombre
                }).then(() => {
                    this.$toast.success('Tipo de cáncer actualizado correctamente');
                    this.cerrarModal();
                    this.listarCancer();
                }).catch(error => {
                    this.$toast.error('Error al actualizar el tipo de cáncer');
                }).finally(() => {
                    this.loading = false;
                })
            }
        }
    }

</script>
