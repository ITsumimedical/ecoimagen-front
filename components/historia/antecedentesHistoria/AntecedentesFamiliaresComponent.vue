<template>
    <v-card elevation="0">
        <template>
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
        </template>

        <v-container fluid>
            <v-row dense>

                <v-col cols="12" sm="12" md="12">
                    <v-alert class="text-center" dense text type="info" border="left" icon="mdi-family-tree">
                        <b>ANTECEDENTES FAMILIARES</b></v-alert>
                </v-col>

                <template v-if="antecedentesFamiliares.no_tiene_antecedentes != true">
                    <v-col cols="12" sm="12" md="6">
                        <v-autocomplete dense outlined v-model="antecedentesFamiliares.cie10_id" :loading="loading"
                            :items="cie10" item-text="Codigo_Nombre" item-value="id" label="Diagnóstico"
                            :search-input.sync="buscarCie10"
                            no-data-text="Por favor escriba el nombre del diagnóstico" />
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                        <v-autocomplete :items="parentescos" label="Parentescos" outlined
                            v-model="antecedentesFamiliares.parentesco" dense style="font-size: 13px">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="1">
                        <v-text-field label="Edad" v-model="antecedentesFamiliares.edad" dense outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                        <v-select label="Fallecido" :items="Sino" item-text="nombre" item-value="valor"
                            v-model="antecedentesFamiliares.fallecido" dense outlined></v-select>
                    </v-col>

                    <v-col>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="success" small outlined fab v-bind="attrs" v-on="on" @click="guardar()">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <span>Agregar antecedente familiar</span>
                        </v-tooltip>
                    </v-col>
                </template>

                <v-col cols="12" md="12" sm="12" v-if="!listarAntecedentes.length">
                    <v-col cols="12" md="12" sm="12">
                        <v-alert text dense color="blue-grey" class="text-center"
                            icon="mdi-checkbox-marked-circle-plus-outline" border="left">
                            <b>No posee antecedentes Familiares</b>
                        </v-alert>
                    </v-col>
                    <v-row align="center">
                        <v-col cols="auto">
                            <v-checkbox label="Marcar en caso de que el afiliado no posea antecedentes familiares"
                                v-model="antecedentesFamiliares.no_tiene_antecedentes" :value="true"></v-checkbox>
                        </v-col>

                        <v-col cols="auto">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn color="success" small outlined fab v-bind="attrs" v-on="on"
                                        @click="guardarNotieneAntecedentes()">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>Guardar</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="12" sm="12" md="12" class="mt-2" v-if="listarAntecedentes.length > 0">
                    <v-alert dense text border="left" type="info" color="blue-grey" class="text-center"
                        icon="mdi-history">
                        <b>Histórico Antecedentes Familiares</b>
                    </v-alert>
                    <v-data-table :headers="headersHistorico" :items="listarAntecedentes" :loading="loading" dense
                        no-data-text="Sin datos para mostrar">
                        <template v-slot:[`item.user.operador`]="{ item }">
                            {{
                                `${item.user?.operador?.nombre || ''} ${item.user?.operador?.apellido || ''}`.trim() || 'Sin nombre' }}</template>
                        <template v-slot:[`item.fallecido`]="{ item }">
                            {{ item.fallecido ? 'Si' : 'No' }}
                        </template>
                        <template v-slot:[`item.acciones`]="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }"
                                    v-if="item.medico_registra === $store.state.auth.usuario.id">
                                    <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on"
                                        @click="eliminarAntecedenteFamiliar(item)">
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
</template>

<script>
export default {
    name: "WorkspaceJsonAntecedentesComponent",
    props: {
        datos: Object,
        ocupacional: Array,
        resumen: Object
    },
    created() {

    },
    data() {
        return {
            loading: false,
            cie10: [],
            antecedentesPreingresados: [],
            Sino: [{
                nombre: "Si",
                valor: 1
            },
            {
                nombre: "No",
                valor: 0
            },
            ],
            listarAntecedentes: [],
            buscarCie10: null,
            antecedentesFamiliares: {
                cie10_id: null,
                parentesco: "",
                edad: "",
                fallecido: "",
                consulta_id: null,
                no_tiene_antecedentes: false
            },
            parentescos: [
                "Padre",
                "Madre",
                'Hermano',
                'Hermana',
                "Abuelo",
                "Abuela",
                "Tío",
                "Tía",
                "Hijo",
                "Hija",
                'Otros ...',
            ],
            headers: [{
                text: "Diagnóstico",
                value: "cie10_id",
            },
            {
                text: "Parentesco",
                value: "parentesco",
            },
            {
                text: "Edad",
                value: "edad",
            },
            {
                text: "Fallecido",
                value: "fallecido",
            },
            {
                text: "Eliminar",
                value: "eliminar",
            },
            ],
            headersHistorico: [{
                text: "Diagnóstico",
                value: "cie10.Codigo_Nombre",
            },
            {
                text: "Parentesco",
                value: "parentesco",
            },
            {
                text: "Edad",
                value: "edad",
            },
            {
                text: "Fallecido",
                value: "fallecido",
            },
            {
                text: "Registrado por",
                value: "user.operador",
            },
            {
                text: "Acciones",
                value: "acciones",
                sortable: false,
                align: "center",
            }
            ],
            preload: false,
        };
    },

    watch: {
        buscarCie10(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarCie10();
                } else if (val.length < 4) {
                    this.cie10 = [];
                }
            } else {
                this.cie10 = [];

            }
        }
    },
    mounted() {
        this.listarAntecedentesFamiliares();
    },

    methods: {

        guardar() {
            if (this.antecedentesFamiliares.cie10_id == null) {
                return this.$toast.error("Debe seleccionar un diagnostico");
            }
            if (this.antecedentesFamiliares.parentesco == "") {
                return this.$toast.error("Debe seleccionar un parentesco!");
            }
            this.antecedentesFamiliares.consulta_id = this.datos.id;
            if (this.ocupacional !== undefined) {
                this.antecedentesFamiliares.consulta_id = this.ocupacional[0].id_CONSULTA;
            }
            this.preload = true
            this.$axios.post("/antecedentes-familiares/guardar", this.antecedentesFamiliares).then((res) => {
                this.$toast.success(res.data.mensaje);
                this.limpiarFiltro();
            }).catch((err) => {
                this.$toast.error("Error al guardar antecedentes familiares");
            }).finally(() => {
                this.preload = false
            })
        },

        guardarNotieneAntecedentes() {
            const data = {
                consulta_id: this.datos.id,
                medico_registra: this.$store.state.auth.usuario.id,
                no_tiene_antecedentes: this.antecedentesFamiliares.no_tiene_antecedentes
            };
            this.$axios.post('antecedentes-familiares/guardarNotieneAntecedente', data).then(res => {
                this.$toast.success('Gurdado con éxito');
            }).catch(error => {
                console.log(error)
            })
        },

        listarCie10() {
            const data = {
                valor: this.buscarCie10
            }
            this.loading = true
            this.$axios.post('cie10/listarFiltro', data).then(res => {
                this.cie10 = res.data
            }).catch(err => {
                console.log(err)
                this.$toast.error(err.response.data.mensaje)
            }).finally(() => {
                this.loading = false
            })
        },
        listarAntecedentesFamiliares() {
            let data = {}
            data.afiliado = this.datos.afiliado_id;
            if (this.ocupacional !== undefined) {
                data.afiliado = this.ocupacional[0].afiliado_id
            }
            this.loading = true
            this.$axios.post("/antecedentes-familiares/listar", {
                afiliado: data.afiliado
            }).then((res) => {
                this.listarAntecedentes = res.data;
                console.log(res.data)
            }).catch((err) => {
                return this.$toast.error(
                    "Error al listar los antecedentes familiares"
                );
            }).finally(() => {
                this.loading = false
            })
        },
        limpiarFiltro() {
            for (const prop of Object.getOwnPropertyNames(
                this.antecedentesFamiliares
            )) {
                this.antecedentesFamiliares[prop] = "";
            }
            this.listarAntecedentesFamiliares();
        },
        validarErrores() {
            return [];
        },

        eliminarAntecedenteFamiliar(item) {
            this.$swal({
                title: "¿Está Segur@?",
                text: `Está a punto de eliminar el antecedente familiar ${item.cie10.Codigo_Nombre}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, eliminar!",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.preload = true;
                    this.$axios
                        .delete(`/antecedentes-familiares/eliminar/${item.id}`)
                        .then((res) => {
                            this.$toast.success(res.data.mensaje);
                            this.listarAntecedentesFamiliares();
                        })
                        .catch((err) => {
                            return this.$toast.error(
                                "Error al eliminar antecedente familiar"
                            );
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
