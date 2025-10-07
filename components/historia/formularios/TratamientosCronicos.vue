<template>
    <div>
        <v-alert color="primary" text icon="mdi-pill" class="text-center" dense>
            <b>TRATAMIENTOS CRÓNICOS</b>
        </v-alert>
        <v-form ref="tratamientosForm">

            <v-col cols="12" md="12" sm="12">
                <v-select label="¿Recibe tratamientos crónicos?" :items="opciones" dense outlined
                    v-model="tratamientos.recibe_tratamiento" :rules="CampoRequerido"></v-select>
            </v-col>

            <v-col cols="12" sm="12" md="12">
                <v-textarea label="Descripción" dense outlined v-model="tratamientos.descripcion"
                    :rules="CampoRequerido">
                </v-textarea>
            </v-col>
        </v-form>

        <v-col class="d-flex justify-center" cols="12" sm="12" md="12">
            <v-btn color="success" small @click="AgregarTratamiento()">
                Agregar tratamiento
            </v-btn>
        </v-col>

        <v-data-table :headers="headers" :items="tratamientosCargados" :loading="loading"
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
                <span>{{ item.usuario_creacion?.operador?.nombre }} -
                    {{ item.usuario_creacion?.operador?.apellido }}</span>
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

    </div>
</template>

<script>
    export default {
        props: ['datos'],
        data() {
            return {
                tratamientos: {
                    recibe_tratamiento: null,
                    descripcion: '',
                    // consulta_id: this.datos.id || null,
                },
                tratamientosCargados: [],
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
                        text: 'Descripción',
                        value: 'descripcion',
                        align: 'center'
                    },
                    {
                        text: 'Registrado por',
                        value: 'usuario_registra',
                        align: 'center'
                    },
                    {
                        text: 'Fecha de creación',
                        value: 'fecha_creacion',
                        align: 'center'
                    },
                    {
                        text: 'Acciones',
                        value: 'acciones',
                        align: 'center',
                    }
                ],
                CampoRequerido: [
                    v => (v !== '' && v !== null && v !== undefined) || 'Este campo es requerido',
                ],

            }
        },
        mounted() {
            this.listarTratamientosAfiliado();
        },
        methods: {
            AgregarTratamiento() {
                if (!this.$refs.tratamientosForm.validate()) {
                    this.$toast.error('Por favor, complete los campos requeridos');
                    return;
                }
                const data = {
                    ...this.tratamientos,
                    consulta_id: this.datos.id
                }
                this.loading = true;
                this.$axios.post('tratamientos-cronicos/crear-tratamiento', data).then((res) => {
                    this.$toast.success('Tratamiento agregado correctamente');
                    this.limpiarInformacion();
                    this.listarTratamientosAfiliado();
                }).catch((error) => {
                    this.$toast.error('Error al agregar tratamiento');
                }).finally(() => {
                    this.loading = false;
                });
            },

            listarTratamientosAfiliado() {
                this.loading = true;
                this.$axios.get('tratamientos-cronicos/listar-tratamientos-afiliado/' + this.datos.afiliado_id).then((
                    res) => {
                    this.tratamientosCargados = res.data;
                }).catch((error) => {
                    this.$toast.error('Error al listar tratamientos');
                }).finally(() => {
                    this.loading = false;
                });
            },

            limpiarInformacion() {
                this.tratamientos = {};
                this.$refs.tratamientosForm.resetValidation();
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
                        this.$axios.delete('tratamientos-cronicos/eliminar-tratamiento/' + id).then((res) => {
                            this.$toast.success('Tratamiento eliminado correctamente');
                            this.listarTratamientosAfiliado();
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
