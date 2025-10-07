<template>
    <v-card flat>
        <v-alert text dense color="primary" icon="mdi-flask-plus" class="text-center">
            <b>TRATAMIENTOS BIOLOGICOS</b>
        </v-alert>
        <v-form ref="formCronicos">
            <v-col cols="12" md="12" sm="12">
                <v-select label="¿Recibe tratamientos biologicos?" :items="opciones" dense outlined
                    v-model="tratamientosBiologicos.recibe_tratamiento" :rules="CampoRequerido"></v-select>
            </v-col>

            <v-col>
                <v-textarea v-model="tratamientosBiologicos.descripcion_tratamiento" label="Descripción del tratamiento"
                    dense outlined :rules="CampoRequerido"></v-textarea>
            </v-col>

            <v-col class="d-flex justify-center" cols="12" sm="12" md="12">
                <v-btn color="success" small @click="AgregarTratamiento()" :loading="loading">
                    Agregar tratamiento
                </v-btn>
            </v-col>
        </v-form>
        <v-col v-if="tratamientosAfiliado.length > 0">
            <v-data-table :items="tratamientosAfiliado" :headers="headers" :loading="loading"
                no-data-text="Sin datos registrados" loading-text="Cargando información...">
                <template v-slot:[`item.recibe_tratamiento`]="{ item }">
                    <v-chip :color="item.recibe_tratamiento ? 'green' : 'primary'" dark label>
                   {{ item.recibe_tratamiento ? 'Sí' : 'No' }}
                </v-chip>
                </template>
                <template v-slot:[`item.fecha_creacion`]="{ item }">
                    <span>{{ item.created_at?.substring(0,10) }}</span>
                </template>
                <template v-slot:[`item.usuario_registra`]="{ item }">
                    <span>{{ item.usuario_registra?.operador?.nombre }} -
                        {{ item.usuario_registra?.operador?.apellido }}</span>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom v-if="item.created_by === $store.state.auth.usuario.id">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="red" v-bind="attrs" v-on="on" small @click="eliminarTratamiento(item.id)">
                                mdi-delete
                            </v-icon>
                        </template>
                        Eliminar tratamiento
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-col>
    </v-card>
</template>

<script>
    export default {
        props: ['datos'],
        data() {
            return {
                tratamientosBiologicos: {
                    recibe_tratamiento: '',
                    descripcion_tratamiento: ''
                },
                tratamientosAfiliado: [],
                loading: false,
                opciones: [{
                        text: 'Sí',
                        value: true
                    },
                    {
                        text: 'No',
                        value: false
                    }
                ],
                CampoRequerido: [
                    v => (v !== '' && v !== null && v !== undefined) || 'Este campo es requerido',
                ],
                headers: [{
                        text: '#',
                        value: 'id',
                        align: 'center'
                    },
                    {
                        text: 'Recibe tratamiento',
                        value: 'recibe_tratamiento',
                        align: 'center'
                    },
                    {
                        text: 'Descripción del tratamiento',
                        value: 'descripcion_tratamiento',
                        align: 'center'
                    },
                    {
                        text: 'Registrado por',
                        value: 'usuario_registra',
                        align: 'center'
                    },
                    {
                        text: 'fecha de registro',
                        value: 'fecha_creacion',
                        align: 'center'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones',
                        align: 'center'
                    }
                ]

            }
        },

        mounted() {
            this.listarTratamientoAfiliado()
        },

        methods: {
            AgregarTratamiento() {
                if (!this.$refs.formCronicos.validate()) {
                    return
                }
                this.loading = true;
                const data = {
                    ...this.tratamientosBiologicos,
                    consulta_id: this.datos.id
                }
                this.$axios.post('tratamientos-biologicos/crear-tratamiento-biologicos', data).then(() => {
                    this.$toast.success('Se ha agregado con éxito');
                    this.listarTratamientoAfiliado();
                    this.limpiarDatos();
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false
                })
            },

            listarTratamientoAfiliado() {
                this.loading = true
                this.$axios.get('tratamientos-biologicos/listar-tratamiento-afiliado/' + this.datos.afiliado_id).then((
                    res) => {
                    this.tratamientosAfiliado = res.data
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false
                })
            },

            limpiarDatos() {
                this.tratamientosBiologicos = {};
                this.$refs.formCronicos.resetValidation();
            },

            eliminarTratamiento(id) {
                this.$swal({
                    title: "¿Está Seguro?",
                    text: "Eliminar este tratamiento crónico",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.value) {
                        this.loading = true;
                        this.$axios.delete('tratamientos-biologicos/eliminar-tratamiento-biologico/' + id).then((res) => {
                            this.$toast.success('Tratamiento eliminado correctamente');
                            this.listarTratamientoAfiliado();
                        }).catch((error) => {
                            this.$toast.error('Error al eliminar tratamiento');
                        }).finally(() => {
                            this.loading = false;
                        });
                    }
                })
            },
        }
    }

</script>
