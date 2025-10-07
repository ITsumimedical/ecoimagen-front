<template>
    <v-card flat :loading="loading" :disabled="loading">
        <v-alert text dense color="primary" icon="mdi-radioactive-circle-outline" class="text-center"><b>RECIBE
                QUIMIOTERAPIA</b></v-alert>
        <v-form ref="formRecibeQuimioterapia">
            <v-col cols="12" md="12" sm="12">
                <v-select label="¿Recibe Quimioterapia?" :items="opciones" dense outlined
                    v-model="recibeQuimioterapia.recibe_quimioterapia" :rules="CampoRequerido"></v-select>
            </v-col>
            <v-col>
                <v-textarea label="Descripción" :rules="CampoRequerido" dense outlined v-model="recibeQuimioterapia.descripcion_quimioterapia">
                </v-textarea>
            </v-col>
            <v-col class="d-flex justify-center" cols="12" sm="12" md="12">
                <v-btn color="success" small @click="AgregarTratamiento()" :loading="loading">
                    Agregar tratamiento
                </v-btn>
            </v-col>
        </v-form>

        <v-col>
            <v-data-table :items="quimioterapiasAfiliado" :headers="headers" :loading="loading">
                <template v-slot:[`item.recibe_quimioterapia`]="{ item }">
                    <v-chip :color="item.recibe_quimioterapia ? 'green' : 'primary'" dark label>
                        {{ item.recibe_quimioterapia ? 'Sí' : 'No' }}
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
                opciones: [{
                        text: 'Sí',
                        value: true
                    },
                    {
                        text: 'No',
                        value: false
                    }
                ],
                loading: false,
                quimioterapiasAfiliado: [],
                recibeQuimioterapia: {
                    recibe_quimioterapia: '',
                    descripcion_quimioterapia: ''
                },
                CampoRequerido: [
                    v => (v !== '' && v !== null && v !== undefined) || 'Este campo es requerido',
                ],
                headers: [{
                        text: '#',
                        value: 'id',
                        align: 'center'
                    },
                    {
                        text: 'Recibe Quimioterapia',
                        value: 'recibe_quimioterapia',
                        align: 'center'
                    },
                    {
                        text: 'Descripcion quimioterapia',
                        value: 'descripcion_quimioterapia',
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
                        align: 'center'
                    }
                ]
            }
        },

        mounted() {
            this.listarTratamientoPorAfiliado();
        },

        methods: {

            listarTratamientoPorAfiliado() {
                this.loading = true;
                this.$axios.get('recibe-quimioterapia/listar-quimioterapia-afiliado/' + this.datos.afiliado_id).then((
                    res) => {
                    this.quimioterapiasAfiliado = res.data
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false
                })
            },
            AgregarTratamiento() {
                if (!this.$refs.formRecibeQuimioterapia.validate()) {
                    return
                };
                this.loading = true;
                const data = {
                    ...this.recibeQuimioterapia,
                    consulta_id: this.datos?.id
                }
                this.$axios.post('recibe-quimioterapia/crear-quimioterapia', data).then(() => {
                    this.$toast.success('Agregado con éxito');
                    this.limpiarData();
                    this.listarTratamientoPorAfiliado();
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.loading = false
                })
            },

            limpiarData() {
                this.recibeQuimioterapia = {}
                this.$refs.formRecibeQuimioterapia.resetValidation();
            },

            eliminarTratamiento(id) {
                this.$swal({
                    title: "¿Está Seguro?",
                    text: "Eliminar esta quimioterapia",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                }).then((result) => {
                    if (result.value) {
                        this.loading = true;
                        this.$axios.delete('recibe-quimioterapia/eliminar-quimioterapia/' + id).then(
                            (res) => {
                                this.$toast.success('Tratamiento eliminado correctamente');
                                this.listarTratamientoPorAfiliado();
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
