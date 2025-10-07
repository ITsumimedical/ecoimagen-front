<template>
    <v-card elevation="0">
        <v-card-text>
            <v-icon class="mr-2" color="primary">mdi-package-variant</v-icon>
            <span class="subtitle-2 font-weight-bold">Seleccionar paquete</span>
            <v-select v-model="paqueteSeleccionado" :items="paquetes" item-text="nombre" item-value="id"
                label="Paquete de ordenamiento" dense outlined class="mt-2" @change="cargarContenidoPaquete" />
        </v-card-text>

        <v-card-text v-if="paqueteSeleccionado">
            <v-row>
                <v-col cols="12">
                    <v-card outlined class="mb-4">
                        <v-alert dense outlined border="left" text color="info" class="mb-3">
                            <v-icon left class="mr-2">mdi-stethoscope</v-icon>
                            <strong>Servicios CUPs del paquete</strong>
                        </v-alert>
                        <v-card-text>
                            <v-btn small color="success" class="mb-2" @click="ordenarTodosCups">
                                <v-icon left>mdi-select-all</v-icon>Agregar todos ({{ cupsDelPaquete.length }})
                            </v-btn>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small color="primary" class="mb-2 ml-2" v-bind="attrs" v-on="on"
                                        :disabled="!cupsSeleccionados.length" @click="ordenarSeleccionadosCups">
                                        <v-icon left>mdi-send</v-icon>Agregar seleccionados ({{ cupsSeleccionados.length
                                        }})
                                    </v-btn>
                                </template>
                                <span>Agrega solo los CUPs seleccionados</span>
                            </v-tooltip>

                            <div style="max-height: 300px; overflow-y: auto;">
                                <v-list dense>
                                    <template v-if="cupsDelPaquete.length">
                                        <v-list-item v-for="cup in cupsDelPaquete" :key="cup.id">
                                            <v-list-item-action>
                                                <v-checkbox v-model="cupsSeleccionados" :value="cup" />
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ cup.codigo }} - {{ cup.nombre
                                                }}</v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn icon small @click="ordenarCup(cup)">
                                                    <v-icon color="primary">mdi-plus</v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </template>
                                    <template v-else>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title class="text--disabled">
                                                    Este paquete no contiene CUPs
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12">
                    <v-card outlined>
                        <v-alert dense outlined border="left" text color="blue" class="mb-3">
                            <v-icon left class="mr-2">mdi-stethoscope</v-icon>
                            <strong>Ordenamiento de Servicios</strong>
                        </v-alert>
                        <v-card-text>
                            <Procedimientos ref="procedimientos" :consulta="consulta" :afiliado="afiliado" />
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12">
                    <v-card outlined class="mb-4">
                        <v-alert dense outlined border="left" text color="success" class="mb-3">
                            <v-icon left class="mr-2">mdi-pill</v-icon>
                            <strong>Medicamentos del paquete</strong>
                        </v-alert>
                        <v-card-text>
                            <v-btn small color="success" class="mb-2" @click="ordenarTodosMedicamentos">
                                <v-icon left>mdi-select-all</v-icon>Agregar todos ({{ codesumisDelPaquete.length }})
                            </v-btn>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn small color="primary" class="mb-2 ml-2" v-bind="attrs" v-on="on"
                                        :disabled="!codesumisSeleccionados.length"
                                        @click="ordenarSeleccionadosMedicamentos">
                                        <v-icon left>mdi-send</v-icon>Agregar seleccionados ({{
                                            codesumisSeleccionados.length }})
                                    </v-btn>
                                </template>
                                <span>Agrega solo los medicamentos seleccionados</span>
                            </v-tooltip>

                            <div style="max-height: 300px; overflow-y: auto;">
                                <v-list dense>
                                    <template v-if="codesumisDelPaquete.length">
                                        <v-list-item v-for="med in codesumisDelPaquete" :key="med.id">
                                            <v-list-item-action>
                                                <v-checkbox v-model="codesumisSeleccionados" :value="med" />
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title>{{ med.codigo }} - {{ med.nombre
                                                }}</v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                                <v-btn icon small @click="ordenarMedicamento(med)">
                                                    <v-icon color="primary">mdi-plus</v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </template>
                                    <template v-else>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-list-item-title class="text--disabled">
                                                    Este paquete no contiene medicamentos
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12">
                    <v-card outlined>
                        <v-alert dense outlined border="left" text color="success" class="mb-3">
                            <v-icon left class="mr-2">mdi-pill</v-icon>
                            <strong>Ordenamiento de Medicamentos</strong>
                        </v-alert>
                        <v-card-text>
                            <Medicamentos ref="medicamentos" :consulta="consulta" :afiliado="afiliado" />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions class="justify-end">
            <v-btn small color="success" @click="ordenarTodoDesdePaquete" :disabled="!paqueteSeleccionado">
                <v-icon left>mdi-send</v-icon>
                Ordenar todo (Medicamentos y Servicios)
            </v-btn>
        </v-card-actions>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
            {{ snackbar.text }}
            <v-btn icon text @click="snackbar.show = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-card>

</template>

<script>
import Procedimientos from "~/components/ordenamiento/procedimientos.vue";
import Medicamentos from "~/components/ordenamiento/articulos.vue";

export default {
    name: "PaqueteOrdenamiento",
    components: {
        Procedimientos,
        Medicamentos,
    },
    props: {
        consulta: {
            type: Number,
            required: true,
        },
        afiliado: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            paqueteSeleccionado: null,
            paquetes: [],
            cupsDelPaquete: [],
            codesumisDelPaquete: [],
            cupsSeleccionados: [],
            codesumisSeleccionados: [],
            snackbar: {
                show: false,
                text: '',
                color: 'success'
            }
        };
    },
    mounted() {
        this.listarPaquetes();
    },
    methods: {
        async listarPaquetes() {
            try {
                const res = await this.$axios.post("/paquetes-ordenamientos/listar-paquetes");
                this.paquetes = res.data || [];
            } catch (e) {
                console.error("Error al listar paquetes:", e);
            }
        },

        async cargarContenidoPaquete(id) {
            this.cupsDelPaquete = [];
            this.codesumisDelPaquete = [];
            try {
                const [resCups, resCodesumis] = await Promise.all([
                    this.$axios.get(`/paquetes-ordenamientos/${id}/cups`),
                    this.$axios.get(`/paquetes-ordenamientos/${id}/codesumis`)
                ]);

                if (resCups.data[0] === true) {
                    this.cupsDelPaquete = resCups.data[1];
                }

                if (resCodesumis.data[0] === true) {
                    this.codesumisDelPaquete = resCodesumis.data[1];
                }
            } catch (e) {
                console.error("Error al cargar datos del paquete:", e);
            }
        },

        ordenarCup(cup) {
            this.$refs.procedimientos?.ordenarCupDesdePaquete?.(cup);
        },

        ordenarMedicamento(med) {
            this.$refs.medicamentos.buscarMedicamento(med.nombre || med.codigo);
        },

        ordenarSeleccionadosCups() {
            this.cupsSeleccionados.forEach(cup => this.ordenarCup(cup));
            this.snackbar = {
                show: true,
                text: 'CUPs seleccionados agregados correctamente',
                color: 'success'
            };
            this.cupsSeleccionados = [];
        },

        ordenarTodosCups() {
            this.cupsDelPaquete.forEach(cup => this.ordenarCup(cup));
            this.snackbar = {
                show: true,
                text: 'Todos los CUPs del paquete agregados',
                color: 'success'
            };
        },

        ordenarSeleccionadosMedicamentos() {
            this.codesumisSeleccionados.forEach(med => this.ordenarMedicamento(med));
            this.snackbar = {
                show: true,
                text: 'Medicamentos seleccionados agregados correctamente',
                color: 'success'
            };
            this.codesumisSeleccionados = [];
        },

        ordenarTodosMedicamentos() {
            this.codesumisDelPaquete.forEach(med => this.ordenarMedicamento(med));
            this.snackbar = {
                show: true,
                text: 'Todos los medicamentos del paquete agregados',
                color: 'success'
            };
        },

        async ordenarTodoDesdePaquete() {
            try {
                const errores = [];

                const hayCups = this.$refs.procedimientos?.procedimientosSeleccionados?.length > 0;

                if (hayCups && this.$refs.procedimientos?.generarOrdenamiento) {
                    const resultadoCups = await this.$refs.procedimientos.generarOrdenamiento();
                    if (!resultadoCups?.res) errores.push('ordenar procedimientos');
                }

                const hayMeds = this.$refs.medicamentos?.medicamentosSeleccionados?.length > 0;

                if (hayMeds && this.$refs.medicamentos?.ordenarMedicamentos) {
                    const resultadoMeds = await this.$refs.medicamentos.ordenarMedicamentos();
                    if (!resultadoMeds?.res) errores.push('ordenar medicamentos');
                }

                if (!hayCups && !hayMeds) {
                    this.snackbar = {
                        show: true,
                        text: 'No hay medicamentos ni procedimientos para ordenar',
                        color: 'warning'
                    };
                    return;
                }

                if (errores.length) {
                    console.log(errores);
                } else {
                    this.snackbar = {
                        show: true,
                        text: 'Ordenamiento realizado exitosamente',
                        color: 'success'
                    };
                }
            } catch (e) {
                console.error(e);
            }
        }

    }
};
</script>
