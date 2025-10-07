<template>
    <div>
        <!-- Preload -->
        <div class="text-center">
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Tranquilo procesamos tu solicitud !
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>

        <!-- Form -->
        <v-card elevation="0">
            <v-container fluid>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert dense text border="left" type="info" class="text-center" icon="mdi-needle">
                            <b>ANTECEDENTES VACUNALES</b>
                        </v-alert>
                    </v-col>
                    <template v-if="noTieneAntecedente != 'No posee antecedentes vacunales'">
                        <v-col cols="12" sm="6" md="3">
                            <v-autocomplete :items="vacuna" label="Vacuna" item-text="name"
                                v-model="esquemaVacunacion.vacuna" dense outlined>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="2" v-if="esquemaVacunacion.vacuna == 'Otro'">
                            <v-text-field v-model="esquemaVacunacion.otra" label="Nombre" dense outlined>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <v-autocomplete :items="dosis" label="Dosis" item-text="name"
                                v-model="esquemaVacunacion.dosis" dense outlined>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="4" v-if="esquemaVacunacion.vacuna == 'Covid'">
                            <v-text-field outlined dense v-model="esquemaVacunacion.laboratorio"
                                label="Laboratorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <v-text-field type="date" v-model="esquemaVacunacion.fecha_dosis" label="Fecha de Dosis"
                                dense outlined :max="hoy">
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="success" small outlined fab v-bind="attrs" v-on="on"
                                        @click="guardar()">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar antecedente vacunal</span>
                            </v-tooltip>
                        </v-col>
                    </template>

                    <v-col cols="12" md="12" sm="12" v-if="antecedentes.length === 0">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="blue-grey" class="text-center"
                                icon="mdi-checkbox-marked-circle-plus-outline" border="left">
                                <b>No posee antecedentes Vacunales</b>
                            </v-alert>
                        </v-col>
                        <v-row align="center">

                            <v-col cols="auto">
                                <v-checkbox v-model="noTieneAntecedente"
                                    label="Marcar en caso de que el afiliado no posea antecedentes vacunales"
                                    value="No posee antecedentes vacunales"></v-checkbox>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="success" small outlined fab v-bind="attrs" v-on="on"
                                            @click="guardarNotieneAntecedente()">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-col>


                    <v-col v-if="antecedentes.length > 0" cols="12" sm="12" md="12" class="mt-2">
                        <v-alert dense text border="left" type="info" color="blue-grey" class="text-center"
                            icon="mdi-history">
                            <b>Histórico de Vacunación</b>
                        </v-alert>
                        <v-data-table :headers="headerHistoricoEsquemaVacunacion" :loading="loading"
                            :items="antecedentes" dense class="elevation-1 mt-4" no-data-text="Sin datos para mostrar">
                            <template v-slot:[`item.user.operador`]="{ item }">
                                {{ `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim()
                                    || 'Sin nombre' }}
                            </template>
                            <template v-slot:[`item.vacuna`]="{ item }">
                                <span>
                                    {{ item.otra ? item.vacuna + ' - ' + item.otra : item.vacuna }}
                                    {{ item.laboratorio ? ' - ' + item.laboratorio : '' }}
                                </span>

                            </template>

                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }"
                                        v-if="item.medico_registra === $store.state.auth.usuario.id">
                                        <v-icon small color="warning" class="mr-2" @click="eliminarVacuna(item)"
                                            v-bind="attrs" v-on="on">
                                            mdi-delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>

                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "WorkspaceJsonAntecedentesVacunacionComponent",
    props: {
        datos: Object,
        ocupacional: Array,
        resumen: Object
    },
    created() {
        this.esquemaVacunacion.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
            this.esquemaVacunacion.consulta_id = this.ocupacional[0].id_CONSULTA
        }
    },
    data() {
        return {
            preload: false,
            loading: false,
            noTieneAntecedente: null,
            hoy: this.$moment().format("YYYY-MM-DD"),
            vacuna: [
                "Covid",
                "BCG",
                "HB",
                "Polio ",
                "Pentavalente",
                "Rotavirus",
                "VPH",
                "DPT",
                "Tetanos, Difteria Y Tos Ferina Acelular",
                "Neumococo",
                "Sarampion, Rubeola- Paperas (Srp)",
                "Fiebre Amarilla",
                "Hepatitis A",
                "Varicela",
                "Toxoide Tetanico Difterico Del Adulto",
                "Influenza",
                "Otro"
            ],
            dosis: [
                "1era Dosis",
                "2da Dosis",
                "3era Dosis",
                "4ta Dosis",
                "5ta Dosis",
                "6ta Dosis",
                "7ma Dosis",
            ],
            headerEsquemaVacunacion: [{
                text: "Vacunas",
                value: 'vacuna'
            },
            {
                text: "Dosis",
                value: 'dosis'
            },
            {
                text: "Laboratorio",
                value: 'laboratorio'
            },
            {
                text: "Fecha dosis",
                value: 'fecha_dosis'
            },
            {
                text: "Eliminar",
                value: 'eliminar'
            },
            ],
            headerHistoricoEsquemaVacunacion: [{
                text: "Vacunas",
                value: 'vacuna'
            },
            {
                text: "Dosis",
                value: 'dosis'
            },
            // {
            //   text: "Laboratorio",
            //   value: 'laboratorio'
            // },
            {
                text: "Fecha dosis",
                value: 'fecha_dosis'
            },
            {
                text: "Registrado por",
                value: 'user.operador'
            },
            // {
            //   text: "Fecha registro",
            //   value: 'created_at'
            // },
            {
                text: "Acciones",
                value: 'acciones',
                sortable: false,
                align: 'center'
            }
            ],
            antecedentesPreingresados: [],
            antecedentes: [],
            esquemaVacunacion: {
                vacuna: null,
                dosis: null,
                laboratorio: null,
                fecha_dosis: null,
            },
        };
    },

    mounted() {
        this.listar();
    },

    methods: {
        
        validarErrores() {
            return [];
        },

        guardar() {
            if (this.esquemaVacunacion.vacuna == null) {
                return this.$toast.error("Debe seleccionar la vacuna");
            }
            if(this.esquemaVacunacion.fecha_dosis > this.hoy){
                return this.$toast.error("La fecha debe ser menor a la de hoy")
            }
            this.esquemaVacunacion.consulta_id = this.datos.id;
            if (this.ocupacional !== undefined) {
                this.esquemaVacunacion.consulta_id = this.ocupacional[0].id_CONSULTA;
            }
            this.preload = true
            this.$axios.post("/antecedentes-vacunales/guardar", this.esquemaVacunacion)
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.limpiarFiltro();
                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {
                    this.preload = false
                })
        },


        guardarNotieneAntecedente() {
            const data = {
                no_tiene_antecedente: this.noTieneAntecedente,
                consulta_id: this.datos.id,
                medico_registra: this.$store.state.auth.usuario.id,
            };
            this.$axios.post('antecedentes-vacunales/guardarNotieneAntecedente', data).then(res => {
                this.$toast.success('Agregado con éxito');
            }).catch(error => {
                this.$toast.error(error)
            })
        },


        listar() {
            let data = {}
            data.afiliado = this.datos.afiliado_id;
            if (this.ocupacional !== undefined) {
                data.afiliado = this.ocupacional[0].afiliado_id
            }
            this.loading = true
            this.$axios
                .post("/antecedentes-vacunales/listar", {
                    afiliado: data.afiliado
                })
                .then((res) => {
                    this.antecedentes = res.data;
                })
                .catch((err) => {
                    return this.$toast.error("Error al listar antecedentes personales");
                }).finally(() => {
                    this.loading = false
                })
        },
        limpiarFiltro() {
            for (const prop of Object.getOwnPropertyNames(
                this.esquemaVacunacion
            )) {
                this.esquemaVacunacion[prop] = null;
            }
            this.listar();
        },

        eliminarVacuna(item) {
            this.$swal({
                title: "¿Desea eliminar esta vacuna?",
                text: `Está a punto de eliminar la vacuna ${item.vacuna}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar!",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios
                        .delete(`/antecedentes-vacunales/eliminar/${item.id}`)
                        .then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.listar();
                        })
                        .catch((err) => {
                            return this.$toast.error("Error al eliminar vacuna");
                        })
                        .finally(() => {
                            this.preload = false;
                        });
                }
            })
        }
    },
};

</script>

<style lang="scss" scoped></style>
