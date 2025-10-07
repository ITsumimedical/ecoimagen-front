<template>
    <div>
        <v-alert text dense color="success" border="bottom" icon="mdi-ruler">
            <b>UNIDADES DE MEDIDAS DE MEDICAMENTOS</b>
        </v-alert>

        <v-data-table :loading="loading" :items="unidadesMedidasMedicamentos" :headers="headers" :search="buscar">
            <template v-slot:top>
                <v-card-title>
                    <v-btn small color="boton" class="mb-2 white--text" @click="abrirDialogoCrear">
                        Nuevo
                        <v-icon>
                            mdi-plus-circle-outline
                        </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="buscar" label="Buscar" append-icon="mdi-magnify" hide-details
                        single-line></v-text-field>
                </v-card-title>
            </template>

            <template v-slot:[`item.codigo`]="{ item }">
                <v-chip small label :color="item.codigo ? 'warning' : ''">
                    {{ item.codigo || 'Codigo no registrado' }}
                </v-chip>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
                {{ item.created_at?.substring(0, 10) }}
            </template>

            <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="warning" dark v-bind="attrs" v-on="on" @click="abrirDialogoEditar(item)">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar unidad de medicamento</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="error" dark v-bind="attrs" v-on="on" @click="eliminar(item.id)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <span>Eliminar</span>
                </v-tooltip>
            </template>

        </v-data-table>

        <v-dialog v-model="dialogUnidadesMedidas" max-width="1000px" persistent>
            <v-card>
                <v-alert text dense :color="modoEdicion ? 'warning' : 'success'" border="bottom" class="text-center">
                    <b>{{ modoEdicion ? "EDITAR" : "CREAR" }} UNIDADES DE MEDIDAS</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formUnidadesMedidas">
                        <v-row dense>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Código" dense outlined v-model="unidadesMedidas.codigo"
                                    :rules="campoRequerido"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombre" dense outlined v-model="unidadesMedidas.nombre"
                                    :rules="campoRequerido"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarDialog()">Cerrar<v-icon right>mdi-close</v-icon></v-btn>
                    <v-btn color="success" small :loading="loadingCrear"
                        @click="modoEdicion ? actualizarUnidadesMedicamentos(unidadesMedidas) : crearUnidadMedida()">{{
                            modoEdicion ? "Actualizar" : "Guardar" }} <v-icon right>mdi-check-all</v-icon></v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>

export default {
    data() {
        return {
            dialogUnidadesMedidas: false,
            unidadesMedidasMedicamentos: [],
            modoEdicion: false,
            buscar: '',
            unidadesMedidas: {
                nombre: '',
                codigo: ''
            },
            loading: false,
            loadingCrear: false,
            campoRequerido: [
                v => !!v || 'Este campo es requerido',
            ],
            headers: [
                {
                    text: 'Nombre',
                    value: 'nombre'
                },
                {
                    text: 'Código',
                    value: 'codigo'
                },
                {
                    text: 'Fecha de creación',
                    value: 'created_at'
                },
                {
                    text: 'Acciones',
                    value: 'acciones'
                }
            ]
        }
    },

    mounted() {
        this.listarUnidadesMedida()
    },

    methods: {

        abrirDialogoCrear() {
            this.modoEdicion = false
            this.dialogUnidadesMedidas = true
        },

        cerrarDialog() {
            this.dialogUnidadesMedidas = false,
                this.unidadesMedidas = {};
            this.$refs.formUnidadesMedidas.resetValidation();
        },

        crearUnidadMedida() {
            if (!this.$refs.formUnidadesMedidas.validate()) {
                return
            }
            this.loadingCrear = true;
            this.$axios.post('unidades-medidas-medicamentos/crear', this.unidadesMedidas).then(() => {
                this.$toast.success('Unidad de medida agregada con éxito');
                this.listarUnidadesMedida()
                this.cerrarDialog();
            }).catch((error) => {
                this.$toast.error('Error al agregar unidad de medida');
                console.log(error.response.data.error)
            }).finally(() => {
                this.loadingCrear = false;
            })
        },

        listarUnidadesMedida() {
            this.loading = true
            this.$axios.get('unidades-medidas-medicamentos/listar').then((res) => {
                this.unidadesMedidasMedicamentos = res.data
            }).catch((error) => {
                console.error(error.response.data.error)
            }).finally(() => {
                this.loading = false
            })
        },

        abrirDialogoEditar(item) {
            this.modoEdicion = true;
            this.unidadesMedidas = { ...item };
            this.dialogUnidadesMedidas = true;
        },

        actualizarUnidadesMedicamentos(item) {
            if (!this.$refs.formUnidadesMedidas.validate()) {
                return
            }
            this.loadingCrear = true;
            this.$axios.put(`unidades-medidas-medicamentos/actualizar/${item.id}`, item).then((res) => {
                this.$toast.success('Actualizado con éxito');
                this.cerrarDialog();
                this.listarUnidadesMedida()
            }).catch((error) => {
                console.log(error.response.data.error)
            }).finally(() => {
                this.loadingCrear = false;
            })
        },

        eliminar(item) {
            return this.$swal({
                title: "Atención!",
                text: "¿Está seguro de eliminar esta forma farmacéutica?",
                type: "warning",
                confirmButtonText: "Sí",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
            }).then((res) => {
                if (res.value) {
                    this.$axios.delete(`unidades-medidas-medicamentos/eliminar/${item}`).then(() => {
                        this.$toast.success('Forma Farmaceutica eliminada correctamente');
                        this.listarUnidadesMedida();
                    })
                }
            }).catch((error) => {
                this.$toast.error('Error al eliminar la forma farmaceutica');
                console.log(error.response.data.error)
            })
        }
    }
}
</script>
