<template>
    <v-card flat>
        <v-col></v-col>
        <v-row justify="center">

            <v-col cols="12" sm="12">
                <v-alert text dense color="primary" border="left" icon="mdi-atom"><b>RELACIONAR DIAGNÓSTICOS</b>
                </v-alert>
            </v-col>

            <v-col cols="12" v-if="tiposCancer.length === 0">
                <v-alert type="info" dense text border="left" color="blue">
                    No hay tipos de cáncer creados.
                </v-alert>
            </v-col>
            <v-expansion-panels v-else>
                <v-expansion-panel v-for="(tipo, index) in tiposCancer" :key="tipo.id">
                    <v-expansion-panel-header @click="listarCie10Asociados(tipo.id)">
                        <b><i>{{ index + 1 }}. {{ tipo.nombre }}</i></b>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-row dense>
                            <template v-if="cie10Asociados.length === 0">
                                <v-col cols="12">
                                    <span class="text-subtitle-2 grey--text">Sin diagnósticos asociados</span>
                                </v-col>
                            </template>
                            <template v-else>
                                <v-col cols="auto" v-for="cie in cie10Asociados" :key="cie.id">
                                    <v-chip label color="primary" small>{{ cie.Codigo_Nombre }}</v-chip>
                                </v-col>
                            </template>
                        </v-row>

                        <v-row justify="end" class="mt-4">
                            <v-col cols="auto">
                                <v-btn color="success" small @click="abrirDialogo(tipo.id)">
                                    Asociar diagnósticos
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>

                </v-expansion-panel>
            </v-expansion-panels>

        </v-row>

        <v-dialog max-width="900px" v-model="dialogTipoCancer" persistent>
            <v-card flat :loading="loading" :disabled="loading">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Agregar diagnósticos</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                    <span class="text-subtitle-2 grey--text">Puedes añadir o eliminar los diagnosticos que desees
                        asociados a este tipo de cancer</span>
                </v-card-title>
                <v-card-text>
                    <v-col>
                        <v-autocomplete :items="cie10" label="Diagnósticos" dense outlined v-model="cie10Seleccionado"
                            no-data-text="Escribe 4 dígitos para realizar la búsqueda" item-text="Codigo_Nombre"
                            item-value="id" :search-input.sync="buscarCie10" :loading="loading"
                            @change="agregarCie10Seleccionado" />

                    </v-col>
                    <v-row class="mt-4" dense>
                        <v-col cols="auto" v-for="(cie, index) in cie10Seleccionados" :key="index">
                            <v-chip small color="primary" label close @click:close="eliminarCie10(index)">
                                {{ cie.Codigo_Nombre }}
                            </v-chip>
                        </v-col>
                    </v-row>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="limpiarDialogo()" small>Cancelar</v-btn>
                    <v-btn color="success" @click="asociarDiagnosticos()" small :loading="loading" :disabled="loading">
                        Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                tiposCancer: [],
                cie10Asociados: [],
                cie10Seleccionados: [],
                cie10: [],
                cie10Seleccionado: null,
                tipoCancerSeleccionado: null,
                dialogTipoCancer: false,
                loading: false,
                buscarCie10: "",
            };
        },
        watch: {
            buscarCie10(val) {
                if (!val || val.length < 4) {
                    this.cie10 = [];
                    return;
                }

                if (val.length === 4) {
                    this.listarCie10();
                }
            }

        },
        mounted() {
            this.listarCancer();
        },
        methods: {
            listarCancer() {
                this.loading = true;
                this.$axios
                    .get("tipo-cancer/listar-tipo-cancer")
                    .then((response) => {
                        this.tiposCancer = response.data;
                    })
                    .catch(() => {
                        this.$toast.error("Error al cargar los tipos de cáncer");
                    })
                    .finally(() => {
                        this.loading = false;
                    });
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
            abrirDialogo(id) {
                this.tipoCancerSeleccionado = id;
                this.dialogTipoCancer = true;
            },
            asociarDiagnosticos() {
                const data = {
                    cie_10_id: this.cie10Seleccionados.map(cie => cie.id),
                    tipo_cancer_id: this.tipoCancerSeleccionado
                };

                this.loading = true;
                this.$axios.post('tipo-cancer/agregar-cie10-tipo-cancer', data).then(() => {
                    this.$toast.success('Diagnóstico asociado correctamente');
                    this.listarCie10Asociados(this.tipoCancerSeleccionado);
                    this.limpiarDialogo();
                }).catch((error) => {
                    console.log(error);
                    this.$toast.error("Error al asociar diagnóstico");
                }).finally(() => {
                    this.loading = false;
                });
            },

            listarCie10Asociados(id) {
                this.loading = true;
                this.$axios.get(`tipo-cancer/listar-cie10-tipo-cancer/${id}`).then(response => {
                    this.cie10Asociados = response.data;
                    this.cie10Seleccionados = [...response.data];
                }).catch(error => {
                    console.log(error);
                    this.$toast.error("Error al cargar diagnósticos asociados");
                }).finally(() => {
                    this.loading = false;
                });
            },


            limpiarDialogo() {
                this.cie10Seleccionado = [];
                this.tipoCancerSeleccionado = null;
                this.buscarCie10 = null;
                this.cie10 = [];
                this.dialogTipoCancer = false;
            },

            agregarCie10Seleccionado(idSeleccionado) {
                const encontrado = this.cie10.find(cie => cie.id === idSeleccionado);
                if (encontrado && !this.cie10Seleccionados.some(cie => cie.id === idSeleccionado)) {
                    this.cie10Seleccionados.push(encontrado);
                }
                this.$toast.info('Diagnóstico agregado correctamente');
                this.cie10Seleccionado = null;
                this.cie10 = [];
            },

            eliminarCie10(index) {
                this.cie10Seleccionados.splice(index, 1);
            }


        },
    };

</script>
