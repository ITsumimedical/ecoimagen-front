<template>
    <div>
        <!-- Preload -->
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

        <!-- Formulario -->
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
            <b>ADHERENCIA FARMACOTERAPEUTICA</b>
        </v-alert>

        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.hora_indicada" :items="siNo"
                label="1. ¿Toma siempre la medicación a la hora indicada?" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.dejado_medicamento" :items="siNo"
                label="2. En caso de sentirse mal, ¿ha dejado de tomar la medicación alguna vez?" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.olvido_medicamento" :items="siNo"
                label="3. En alguna ocasión, ¿Se ha olvidado de tomar la medicación?" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.finsemana_olvidomedicamento" :items="siNo"
                label="4. Durante el fin de semana, ¿Se ha olvidado de alguna toma de medicación?" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.finsemana_notomomedicamento" :items="dosis"
                label="5. En la última semana, ¿Cúantas veces no tomó alguna dosis?" />
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-text-field v-model="adherenciaFarmaco.dias_notomomedicamento" type="number" min="0"
                label="6. Desde la última visita, ¿Cuantos días completos no tomo la medicación?"
                @change="calcularPorcentaje"></v-text-field>
        </v-col>
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
            <b>PORCENTAJE DE ADHERENCIA</b>
        </v-alert>
        <v-col cols="12" sm="12" md="12">
            <v-text-field v-model="adherenciaFarmaco.porcentaje" readonly></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12">
            <v-autocomplete v-model="adherenciaFarmaco.criterio_quimico" :items="siNo"
                label="Adherencia criterio del químico" />
        </v-col>
    </div>
</template>
<script>
export default {
    props: {
        datos: Object
    },
    data() {
        return {
            preload: false,
            adherenciaFarmaco: {
                criterio_quimico: '',
                dejado_medicamento: '',
                dias_notomomedicamento: '',
                finsemana_notomomedicamento: '',
                finsemana_olvidomedicamento: '',
                hora_indicada: '',
                olvido_medicamento: '',
                porcentaje: '',
            },
            siNo: ['SI', 'NO'],
            dosis: ['Ninguna', '1 a 2 veces', '3 a 5 veces', '6 a 10 veces', 'Mas de 10 veces'],
            historicoOrdenes: [],
            historicoMedicamentos: [],
            headersHistoricoMedicamentos: [
                { text: '# Orden', align: 'center' },
                { text: 'Estado', align: "center", },
                { text: 'Mes', align: "center", },
                { text: 'Dosis', align: "center", },
                { text: 'Via', align: "center", },
                { text: 'Unidad Medida', align: "center", },
                { text: 'Frecuencia', align: "center", },
                { text: 'Cantidad Ordenada', align: "center", },
                { text: 'Duracion', align: "center", },
                { text: 'Observacion', align: "center", },
                { text: 'Imprimir Historia', align: "center", },
                { text: 'Adherente', align: "center", },
                { text: 'Seguro', align: "center", },
                { text: 'Efectivo', align: "center", },
                { text: 'Necesario', align: "center", },
                { text: 'Otro Problemas', align: "center", }
            ],
        }
    },
    watch: {
        "adherenciaFarmaco.dias_notomomedicamento": function () {
            this.calcularPorcentaje();
        }
    },
    methods: {
      validarErrores() {
              return [];
            },
        obtenerDatos() {
                return {
                    datos: this.adherenciaFarmaco
                };
            },
        calcularPorcentaje() {
            const dias = this.adherenciaFarmaco.dias_notomomedicamento;
            let resultado;

            if (dias === 0) {
                resultado = '95%-100%. NO OLVIDA DOSIS';
            } else if (dias >= 1 && dias <= 2) {
                resultado = '85%-94%. OLVIDA 1 A 2 DOSIS';
            } else if (dias >= 3 && dias <= 5) {
                resultado = '65%-84%. OLVIDA 3 A 5 DOSIS';
            } else if (dias >= 6 && dias <= 10) {
                resultado = '64%-30%. OLVIDA 6 A 10 DOSIS';
            } else if (dias > 10) {
                resultado = '< 30% OLVIDA MAS DE 10 DOSIS';
            }

            return this.adherenciaFarmaco.porcentaje = resultado;
        },
        saveAdherenciaFarmacologica() {
            this.preload = true
            this.adherenciaFarmaco.consulta_id = this.datos.id
            this.$axios.post('historia/saveAdherenciaFarmacologica',this.adherenciaFarmaco).then(res => {
                this.toast.success(res.data.menssage);
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.preload = false
            })
        },
        historicoOrdenes(items) {
            this.preload = true;
            this.$axios.post('/historia/historicoOrdenes', items).then(res => {
                this.historicoOrdenes = res.data
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.preload = false
            })
        }
    }
}
</script>
