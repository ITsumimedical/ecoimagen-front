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
                        <v-alert dense text type="info" class="text-center" icon="mdi-box-cutter">
                            <b>ANTECEDENTES QUIRÚRGICOS</b>
                        </v-alert>
                    </v-col>
                    <template v-if="noTieneAntecedente != 'No posee antecedentes quirurgicos'">
                        <v-col cols="12" sm="6" md="9">
                            <v-autocomplete dense outlined v-model="quirurgicos.cirugia" :search-input.sync="FiltroCups"
                                :items="cups" item-text="cups" no-data-text="Debe ingresar el nombre del procedimiento"
                                item-value="cups" label="Digita el nombre de procedimiento">
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field v-model="quirurgicos.a_que_edad" type="number" min="0"
                                oninput="validity.valid||(value='');" label="Edad" dense outlined></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea label="Observaciones" v-model="quirurgicos.observaciones" dense outlined
                                auto-grow></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="d-flex justify-center">
                            <v-btn dense color="success" @click="guardar()">Agregar
                                antecedentes<v-icon>mdi-plus-circle-outline</v-icon></v-btn>
                        </v-col>
                    </template>


                    <v-col cols="12" md="12" sm="12" v-if="antecedentes.length === 0">
                        <v-col cols="12" md="12" sm="12">
                            <v-alert text dense color="blue-grey" class="text-center"
                                icon="mdi-checkbox-marked-circle-plus-outline" border="left">
                                <b>No posee antecedentes quirúrgicos</b>
                            </v-alert>
                        </v-col>
                        <v-row align="center">

                            <v-col cols="auto">
                                <v-checkbox label="Marcar en caso de que el afiliado no posea antecedentes quirúrgicos"
                                    value="No posee antecedentes quirurgicos" v-model="noTieneAntecedente"></v-checkbox>
                            </v-col>

                            <v-col cols="auto">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="success" small outlined fab v-bind="attrs" v-on="on"
                                            @click="guardarNotiene()">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Guardar</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-col>


                    <v-col v-if="antecedentes.length > 0" cols="12" sm="12" md="12" class="mt-2">
                        <v-alert icon="mdi-history" dense text border="left" type="info" color="blue-grey"
                            class="text-center">
                            <b>Histórico de Antecedentes Quirúrgicos</b>
                        </v-alert>
                        <v-data-table :headers="headerHistoricoQuirurgicos" :loading="loading" :items="antecedentes"
                            dense class="elevation-1 mt-4" no-data-text="Sin datos para mostrar">
                            <template v-slot:[`item.user.operador`]="{ item }">
                                {{ `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim()
                                || 'Sin nombre' }}
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }"
                                        v-if="item.medico_registra === $store.state.auth.usuario.id">
                                        <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                            @click="eliminar(item)">
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
        this.quirurgicos.consulta_id = this.datos.id;
        if (this.ocupacional !== undefined) {
            this.quirurgicos.consulta_id = this.ocupacional[0].id_CONSULTA
        }
    },
    data() {
        return {
            loading: false,
            preload: false,
            cups: [],
            noTieneAntecedente: null,
            FiltroCups: null,
            quirurgicos: {
                cirugia: null,
                a_que_edad: null,
                observaciones: null
            },
            headerHistoricoQuirurgicos: [
                {
                    text: "Cirugia",
                    value: 'cirugia'
                },
                {
                    text: "Edad",
                    value: 'a_que_edad'
                },
                {
                    text: "Registrado por",
                    value: 'user.operador'
                },
                {
                    text: "Fecha registro",
                    value: 'created_at'
                },
                {
                    text: 'Observaciones',
                    value: 'observaciones'
                },
                {
                    text: "Acciones",
                    value: 'acciones',
                    sortable: false,
                    align: 'center'
                }
            ],
            antecedentesPreingresados: [],
            antecedentes: [],
        };
    },

    watch: {
        FiltroCups(val) {
            if (val) {
                if (val.length === 4) {
                    this.listaCups();
                } else if (val.length < 4) {
                    this.cups = null;
                }
            } else {
                this.cups = null;
            }
        },
    },

    mounted() {
        this.listar();
    },

    methods: {

        validarErrores() {
            return [];
        },

        listaCups() {
            this.preload = true;
            this.$axios.post('/cup/buscarCupsNombre', {
                nombre: this.FiltroCups,
                idAfiliado: this.datos.afiliado.id
            }).then(res => {
                this.cups = res.data
                this.preload = false;
            }).catch(e => {
                e.response
                this.preload = false;
            })
        },

        guardar() {
            if (this.quirurgicos.cirugia == null) {
                return this.$toast.error("Debe seleccionar el procedimiento");
            }
            this.quirurgicos.consulta_id = this.datos.id;
            if (this.ocupacional !== undefined) {
                this.quirurgicos.consulta_id = this.ocupacional[0].id_CONSULTA;
            }

            this.preload = true;
            this.$axios
                .post(
                    "/antecedentes-quirurgicos/guardar",
                    this.quirurgicos
                )
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.limpiarFiltro();
                })
                .catch((err) => {
                    console.log(err);
                    return this.$toast.error('No hay antecedentes pre-guardados para almacenar');
                }).finally(() => {
                    this.preload = false
                })
        },

        guardarNotiene() {
            const data = {
                consulta_id: this.datos.id,
                medico_registra: this.$store.state.auth.usuario.id,
                no_tiene_antecedente: this.noTieneAntecedente
            };
            this.$axios.post('antecedentes-quirurgicos/guardarNotieneAntecedente', data).then(res => {
                this.$toast.success('Guardado con éxito');
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
            this.$axios.post("/antecedentes-quirurgicos/listar", {
                afiliado: data.afiliado
            })
                .then((res) => {
                    this.loading = false
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
                this.quirurgicos
            )) {
                this.quirurgicos[prop] = null;
            }
            this.listar();
        },
        eliminar(item) {
            this.$swal({
                title: "¿Está Segur@ ?",
                text: `Está a punto de eliminar el Antecedente Quirúrgico ${item.cirugia}`,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, Eliminar!",
                cancelButtonText: "Cancelar",
            }).then(res => {
                if (res.value) {
                    this.preload = true
                    this.$axios
                        .delete(`/antecedentes-quirurgicos/eliminar/${item.id}`)
                        .then(res => {
                            this.$toast.success(res.data.mensaje);
                            this.listar();
                        })
                        .catch(err => {
                            return this.$toast.error("Error al eliminar Antecedente Quirúrgico");
                        }).finally(() => {
                            this.preload = false
                        })
                }
            })
        }
    },
};

</script>

<style lang="scss" scoped></style>
