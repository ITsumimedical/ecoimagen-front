<template>
    <div>
        <!-- Componente de costo evitado para ingreso concurrencia -->
        <v-row dense>
            <v-col cols="6">
                <v-alert icon="mdi-cash-register" text color="blue-grey" dense border="left">Costo evitado</v-alert>
                <v-row dense>
                    <v-col cols="6" sm="6" md="6">
                        <v-autocomplete v-model="form.costo" label="Costo evitado" dense
                            :items="['Alta temprana', 'Tecnología no realizada', 'Traslado a IPS con menor  tarifa o nivel', 'Estancia evitada por servicios y/o procedimientos diferidos (ambulatorios', 'Traslados en ambulancia']">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                        <v-text-field type="number" v-model="form.valor" label="Valor costo evitado" dense>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-col cols="12" sm="12" md="12" v-if="form.costo == 'Alta temprana'">
                    <v-autocomplete v-model="form.tipo_alta" label="Tipo de alta temprana" dense
                        :items="['Cambio de tratamiento a oral', 'Domiciliaria agudos', 'Oxigeno domiciliario', 'Terapias domiciliarias', 'Gestión entrega insumos/medicamentos por alta condicionada', 'Renegociación de tarifa']">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea auto-grow v-model="form.descripcion" label="Observaciones"></v-textarea>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="agregar()" small color="success">Agregar</v-btn>
                </v-card-actions>
            </v-col>
            <v-col cols="6">
                <v-alert icon="mdi-history" text color="blue-grey" dense border="left">Registro de costo
                    evitado</v-alert>
                <v-data-table dense :headers="headers" :items="costos" :items-per-page="5"
                    no-data-text="Aún no hay registros">
                    <template v-slot:[`item.usuario_registra`]="{ item }">
                        {{ item.user?.operador?.nombre || '' }} {{ item.user?.operador?.apellido || '' }}
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on">
                                    <v-icon small color="error" @click="eliminarRegistro(item)">
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogMotivo" max-width="600px" persistent>
            <v-card>
                <v-alert text dense border="left" color="error" icon="mdi-trash-can">Proceso de eliminación de
                    costo</v-alert>
                <v-card-text>
                    <v-textarea auto-grow v-model="form.motivo_eliminacion"
                        label="Por favor ingrese el motivo de la eliminación" required outlined></v-textarea>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" small @click="dialogMotivo = false">Cancelar</v-btn>
                    <v-btn color="success" small @click="confirmarEliminar">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'WorkspaceJsonCostoEvitado',

    data() {
        return {
            headers: [{
                text: 'Id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Costo',
                align: 'start',
                sortable: false,
                value: 'costo',
            },
            {
                text: 'Observaciones',
                align: 'start',
                sortable: false,
                value: 'descripcion',
            },
            {
                text: 'Tipo de alta temprana',
                align: 'start',
                sortable: false,
                value: 'tipo_alta',
            },
            {
                text: 'Valor evitado',
                align: 'start',
                sortable: false,
                value: 'valor',
            },
            {
                text: 'Usuario registra',
                align: 'start',
                sortable: false,
                value: 'usuario_registra',
            },
            {
                text: 'Acciones',
                value: 'acciones',
                sortable: false,
            },
            ],
            form: {
                costo: null,
                tipo_alta: null,
                descripcion: null,
                ingreso_concurrencia_id: null,
                valor: null,
                user_id: '',
            },
            costos: [],
            dialogMotivo: false,
        };
    },

    props: {
        IngresoConcurrencia: {
            type: Number,
            default: {},
        }
    },

    mounted() {
        this.listarCostos()
    },

    methods: {

        agregar() {
            this.form.ingreso_concurrencia_id = this.IngresoConcurrencia
            this.form.user_id = this.$store.state.auth.usuario.id
            this.$axios.post("costo-evitado/guardarCosto", this.form).then((res) => {
                this.listarCostos()
                this.form.costo = null
                this.form.descripcion = null
                this.form.tipo_alta = null
                this.form.valor = null
                return this.$toast.success('se ha aregistrado el costo evitado correctamente!.')
            })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al registrar el costo");
                    console.log(err);
                })
        },

        listarCostos() {
            this.form.ingreso_concurrencia_id = this.IngresoConcurrencia
            this.$axios.post("costo-evitado/listarCosto", {
                id: this.form.ingreso_concurrencia_id
            }).then((res) => {
                this.costos = res.data;
            })
                .catch((e) => {
                    console.log(e);

                });
        },

        eliminarRegistro(item) {
            if (!this.form.motivo_eliminacion) {
                this.dialogMotivo = true;
                this.itemParaEliminar = item;
            } else {
                this.$axios.post('/costo-evitado/eliminarCosto/', {
                    id: item.id,
                    motivo_eliminacion: this.form.motivo_eliminacion,
                })
                    .then(res => {
                        this.listarCostos();
                        this.$toast.success('Se ha eliminado el registro correctamente!.');
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },

        confirmarEliminar() {
            if (!this.form.motivo_eliminacion) {
                this.$toast.error('Debe ingresar un motivo para continuar.');
                return;
            }

            this.$axios.post('/costo-evitado/eliminarCosto/', {
                id: this.itemParaEliminar.id,
                motivo_eliminacion: this.form.motivo_eliminacion,
            })
                .then(res => {
                    this.listarCostos();
                    this.$toast.success('Se ha eliminado el registro correctamente!.');
                })
                .catch(e => {
                    console.log(e);
                });

            this.dialogMotivo = false;
            this.form.motivo_eliminacion = '';
        }

    },
};

</script>
