<template>
    <div>
        <v-card flat>
            <v-card-title class="justify-center align-center" color="blue lighten-5">
                <v-icon left color="indigo" class="mr-2">mdi-calculator-variant</v-icon>
                <span class="font-weight-bold">Cálculo COP - CEO</span>
            </v-card-title>


            <v-row justify="center" align="center" v-if="cargando" style="min-height: 200px;">
                <v-progress-circular indeterminate color="primary" size="64" width="5" />
            </v-row>

            <v-row dense v-else>
                <v-col cols="12" md="6">
                    <v-card outlined color="green lighten-5" class="pa-4 text-center">
                        <h3 class="mb-4">COP</h3>
                        <v-row justify="center">
                            <v-col cols="4" class="text-center">
                                <v-icon color="green" size="40">mdi-alpha-c-circle</v-icon>
                                <div class="display-1 font-weight-bold green--text">{{ calculosCopCeo?.COP?.C ?? 0 }}
                                </div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <v-icon color="green" size="40">mdi-alpha-o-circle</v-icon>
                                <div class="display-1 font-weight-bold green--text">{{ calculosCopCeo?.COP?.O ?? 0 }}
                                </div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <v-icon color="green" size="40">mdi-alpha-p-circle</v-icon>
                                <div class="display-1 font-weight-bold green--text">{{ calculosCopCeo?.COP?.P ?? 0 }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card outlined color="blue lighten-5" class="pa-4 text-center">
                        <h3 class="mb-4">CEO</h3>
                        <v-row justify="center">
                            <v-col cols="4" class="text-center">
                                <v-icon color="indigo" size="40">mdi-alpha-c-circle</v-icon>
                                <div class="display-1 font-weight-bold indigo--text">{{ calculosCopCeo?.CEO?.C ?? 0 }}
                                </div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <v-icon color="indigo" size="40">mdi-alpha-e-circle</v-icon>
                                <div class="display-1 font-weight-bold indigo--text">{{ calculosCopCeo?.CEO?.E ?? 0 }}
                                </div>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <v-icon color="indigo" size="40">mdi-alpha-o-circle</v-icon>
                                <div class="display-1 font-weight-bold indigo--text">{{ calculosCopCeo?.CEO?.O ?? 0 }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <v-col cols="12" sm="12" md="12">
                    <v-card-title class="justify-center align-center" color="blue lighten-5">
                        <v-icon left color="indigo">mdi-calculator-variant</v-icon>
                        <span class="font-weight-bold">INFORME - 202</span>
                    </v-card-title>
                </v-col>

                <v-col cols="12">
                    <v-card outlined color="blue lighten-5" class="pa-4 text-center">
                        <h3 class="mb-4">Estado de Dientes</h3>
                        <v-row>

                            <v-col cols="12" sm="6" md="2">
                                <v-icon color="primary" size="36">mdi-emoticon-happy-outline</v-icon>
                                <div class="mt-1 font-weight-medium">Sano</div>
                                <div class="display-1 font-weight-bold primary--text">{{ informe202?.['SANO'] ?? 0 }}
                                </div>
                            </v-col>

                            <v-col cols="12" sm="6" md="2">
                                <v-icon color="primary" size="36">mdi-tooth-outline</v-icon>
                                <div class="mt-1 font-weight-medium">No Cavitacional</div>
                                <div class="display-1 font-weight-bold primary--text">
                                    {{ informe202?.['CARIES NO CAVITACIONAL'] ?? 0 }}</div>
                            </v-col>

                            <v-col cols="12" sm="6" md="2">
                                <v-icon color="primary" size="36">mdi-tooth</v-icon>
                                <div class="mt-1 font-weight-medium">Cavitacional</div>
                                <div class="display-1 font-weight-bold primary--text">
                                    {{ informe202?.['CARIES CAVITACIONAL'] ?? 0 }}</div>
                            </v-col>
                            <v-col cols="12" sm="6" md="2">
                                <v-icon color="primary" size="36">mdi-toothbrush</v-icon>
                                <div class="mt-1 font-weight-medium">Obturado</div>
                                <div class="display-1 font-weight-bold primary--text">
                                    {{ informe202?.['OBTURADO POR CARIES'] ?? 0 }}
                                </div>
                            </v-col>
                            <v-col >
                                <v-icon color="primary" size="36">mdi-tooth-outline</v-icon>
                                <div class="mt-1 font-weight-medium">Perdido</div>
                                <div class="display-1 font-weight-bold primary--text">
                                    {{ informe202?.['PERDIDO POR CARIES'] ?? 0 }}
                                </div>
                            </v-col>

                                <v-col cols="12" sm="6" md="2">
                                    <v-icon color="primary" size="28">mdi-counter</v-icon>
                                    <div class="subtitle-1 font-weight-medium">Total de dientes presentes</div>
                                    <div class="display-1 font-weight-bold primary--text"> {{ informe202?.['total_dientes_presentes'] ?? 0 }}
                                    </div>
                                </v-col>

                            <v-row justify="center">
                                <v-col cols="12" class="text-center">
                                    <v-icon color="primary" size="28">mdi-numeric</v-icon>
                                    <div class="display-1 font-weight-bold primary--text">{{ informe202?.['resultado_informe'] ?? 0 }}</div>
                                </v-col>
                            </v-row>

                        </v-row>
                    </v-card>
                </v-col>

            </v-row>
        </v-card>
    </div>
</template>

<script>
    export default {
        props: ['datos'],
        data() {
            return {
                calculosCopCeo: {},
                informe202: {},
                cargando: true
            };
        },
        // computed: {
        //     totalDientesPresentes() {
        //         const i = this.informe202 || {};
        //         return (
        //             (i['CARIES CAVITACIONAL'] ?? 0) +
        //             (i['CARIES NO CAVITACIONAL'] ?? 0) +
        //             (i['OBTURADO POR CARIES'] ?? 0) +
        //             (i['PERDIDO POR CARIES'] ?? 0) +
        //             (i['SANO'] ?? 0)
        //         );
        //     },
        //     resultadoInforme() {
        //         const i = this.informe202 || {};
        //         const format = (n) => String(n).padStart(2, '0');
        //         return [
        //             format(i['SANO'] ?? 0),
        //             format(i['CARIES NO CAVITACIONAL'] ?? 0),
        //             format(i['CARIES CAVITACIONAL'] ?? 0),
        //             format(i['OBTURADO POR CARIES'] ?? 0),
        //             format(i['PERDIDO POR CARIES'] ?? 0),
        //             format(this.totalDientesPresentes)
        //         ].join(' ');
        //     }
        // },
        mounted() {
            this.calcularCopCeo();
            this.calcularInforme202();
        },
        methods: {
            calcularCopCeo() {
                this.cargando = true;
                this.$axios
                    .get('odontograma/calculo-cop-ceo/' + this.datos.afiliado_id)
                    .then((res) => {
                        this.calculosCopCeo = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error('Error al generar el cálculo del COP y del CEO');
                        console.log(error.response.data.error);
                    }).finally(() => {
                        this.cargando = false;
                    });
            },

            calcularInforme202() {
                this.cargando = true;
                this.$axios
                    .get('odontograma/calculo-informe-202/' + this.datos.afiliado_id)
                    .then((res) => {
                        this.informe202 = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error('Error al generar el cálculo del informe 202');
                        console.log(error.response.data.error);
                    }).finally(() => {
                        this.cargando = false;
                    });
            }
        }
    };

</script>
