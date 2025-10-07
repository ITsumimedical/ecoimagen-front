<template>
    <div>
        <v-alert text dense color="success" border="bottom" class="text-center" icon="mdi-needle"><b>Formas
                farmaceuticas-FFM</b></v-alert>
        <v-data-table :items="formasFarmaceuticas" :headers="headers" :loading="loading" :search="buscar">
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
                    <span>Editar forma farmaceutica</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon :color="item.habilitado == true ? 'success' : 'error'" dark v-bind="attrs" v-on="on"
                            @click="cambiarEstado(item.id)">
                            {{
                                item.habilitado == true
                                    ? "mdi-toggle-switch-off"
                                    : "mdi-toggle-switch"
                            }}
                        </v-icon>
                    </template>
                    <span>Cambiar estado</span>
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

            <template v-slot:[`item.habilitado`]="{ item }">
                <v-chip dark small label :color="item.habilitado ? 'green' : 'red'">
                    {{ item.habilitado ? 'Si' : 'No' }}
                </v-chip>
            </template>
        </v-data-table>

        <v-dialog v-model="formaFarmaceuticaDialog" max-width="1000px" persistent>
            <v-card>
                <v-alert text dense :color="modoEdicion ? 'warning' : 'success'" border="bottom" class="text-center">
                    <b>{{ modoEdicion ? "EDITAR" : "CREAR" }} FORMA FARMACÉUTICA</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="formFormaFarmaceutica">
                        <v-row>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field label="Código" dense outlined
                                    v-model="formaFarmaceutica.codigo" :rules="campoRequerido"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field label="Nombre" dense outlined
                                    v-model="formaFarmaceutica.nombre" :rules="campoRequerido"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <v-text-field label="Nombre abreviado" dense outlined
                                    v-model="formaFarmaceutica.nombre_abreviado" :rules="campoRequerido"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="cerrarDialog()">Cerrar <v-icon right>mdi-close</v-icon></v-btn>
                    <v-btn color="success" small :loading="loadingCrear"
                        @click="modoEdicion ? actualizarFormaFarmaceutica(formaFarmaceutica) : crearFormaFarmaceutica()">
                        {{ modoEdicion ? "Actualizar" : "Guardar" }} <v-icon right>mdi-check-all</v-icon>
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
            formaFarmaceuticaDialog: false,
            formasFarmaceuticas: [],
            loading: false,
            modoEdicion: false,
            buscar: '',
            loadingCrear: false,
            campoRequerido: [
                v => !!v || 'Este campo es requerido',

            ],
            formaFarmaceutica: {
                codigo: '',
                nombre: '',
                nombre_abreviado: ''
            },
            headers: [
                {
                    text: 'Código',
                    value: 'codigo'
                },
                {
                    text: 'Nombre',
                    value: 'nombre'
                },
                {
                    text: 'Nombre abreviado',
                    value: 'nombre_abreviado'
                },
                {
                    text: 'Habilitado',
                    value: 'habilitado'
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
        this.listarFormas()
    },

    methods: {
        abrirDialogoCrear() {
            this.modoEdicion = false;
            this.formaFarmaceuticaDialog = true;
        },

        crearFormaFarmaceutica() {
            if(!this.$refs.formFormaFarmaceutica.validate()){
                return this.$toast.error('Campo obligatorios sin diligenciar')
            }
            this.loadingCrear = true;
            this.$axios.post('forma-farmaceutica-ffm/crear', this.formaFarmaceutica).then(() => {
                this.$toast.success('Creado con éxito'),
                    this.cerrarDialog();
                this.listarFormas()
            }).catch((error) => {
                this.$toast.error('Error al guardar')
                console.log(error.response.data.error)
            }).finally(() => {
                this.loadingCrear = false
            })
        },

        listarFormas() {
            this.loading = true;
            this.$axios.get('forma-farmaceutica-ffm/listar').then((res) => {
                this.formasFarmaceuticas = res.data
            }).catch((error) => {
                console.log(error.response.data.error)
            }).finally(() => {
                this.loading = false;
            })
        },

        abrirDialogoEditar(item) {
            this.modoEdicion = true;
            this.formaFarmaceutica = { ...item };
            this.formaFarmaceuticaDialog = true;
        },

        cerrarDialog() {
            this.formaFarmaceuticaDialog = false;
            this.formaFarmaceutica = {};
            this.$refs.formFormaFarmaceutica.resetValidation();
        },

        actualizarFormaFarmaceutica(item) {
            if(!this.$refs.formFormaFarmaceutica.validate()){
                return this.$toast.error('Campo obligatorios sin diligenciar')
            }
            this.loadingCrear = true;
            this.$axios.put(`forma-farmaceutica-ffm/actualizar/${item.id}`, item).then((res) => {
                this.$toast.success('Actualizado con éxito');
                this.cerrarDialog();
                this.listarFormas()
            }).catch((error) => {
                console.log(error.response.data.error)
            }).finally(() => {
                this.loadingCrear = false;
            })
        },

        cambiarEstado(item) {
            this.$axios.put(`forma-farmaceutica-ffm/cambiar-estado/${item}`).then(() => {
                this.$toast.success('Estado cambiado con éxito');
                this.listarFormas();
            }).catch((error) => {
                console.log(error.response.data.error)
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
                    this.$axios.delete(`forma-farmaceutica-ffm/eliminar/${item}`).then(() => {
                        this.$toast.success('Forma Farmaceutica eliminada correctamente');
                        this.listarFormas();
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
