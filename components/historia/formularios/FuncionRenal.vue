<template>
    <div>
        <v-form>
            <v-col cols="12" sm="12" md="12">
                <v-alert class="text-center" dense text type="info" icon="mdi-stethoscope" border="left">
                    <b>FUNCIÓN RENAL</b></v-alert>
            </v-col>
            <v-col cols="12" md="12" sm="12">
                <v-alert text dense color="blue-grey" class="text-center" icon="mdi-result" border="left">
                    <b>Cockcroft-Gault</b>
                </v-alert>
            </v-col>
            <v-row>
                <v-col cols="12" md="6" sm="6">
                    <v-text-field readonly outlined dense label="Creatinina" v-model="valorCreatinina.resultado_lab">
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                    <v-text-field readonly outlined dense label="Resultado calculo" v-model="resultadoCg">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-col cols="12" sm="12" md="12">
                <v-alert text dense color="blue-grey" class="text-center" icon="mdi-result" border="left">
                    <b>CKD-EPI</b></v-alert>
            </v-col>
            <v-row>
                <v-col cols="12" md="6" sm="6">
                    <v-text-field readonly outlined dense label="Creatinina" v-model="valorCreatinina.resultado_lab">
                    </v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="6">
                    <v-text-field readonly outlined dense label="Resultado calculo" v-model="resultadoCkd">
                    </v-text-field>
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';

export default {
    name: "RiesgoCardiovascular",
    props: ['datos', 'resumen'],
    data() {
        return {
            edad: this.datos.afiliado.edad_cumplida,
            sexo: this.datos.afiliado.sexo,
            valorCreatinina: { resultado_lab: '' },
            afiliadoId: this.datos.afiliado_id,
            listarCg: true,
            resultadoCg: 0,
            resultadoCkd: 0,
            consultaId: this.datos.id,
            emitFuncion: false,
        }
    },
    computed: {
        ...mapGetters('medidas', ['medidasAntropometricas', 'creatinina']),

    },
    watch: {
        edad: 'verificarYCalcularCg',
        sexo: 'verificarYCalcularCg',
        valorCreatinina: {
            handler: 'verificarYCalcularCg',
            deep: true
        },
        medidasAntropometricas: {
            handler: 'verificarYCalcularCg',
            deep: true,
            immediate: true
        },
        creatinina(newVal) {
            if (newVal) {
                this.valorCreatinina.resultado_lab = newVal.resultado_lab;
                this.emitFuncion = newVal.emitGuardarFr;

                if (this.emitFuncion === true) {
                    this.guardarResultados();
                    this.setCreatinina({
                        ...newVal,
                        emitGuardarFr: false
                    });
                }
            }
        }
    },
    methods: {
        ...mapActions('medidas', ['updateExamenF', 'setCreatinina']),

        verificarYCalcularCg() {
            if (
                this.edad != null &&
                this.sexo &&
                this.valorCreatinina?.resultado_lab != null &&
                this.medidasAntropometricas?.peso != null
            ) {
                this.calcularCg();
                this.calcularCkd();
            }
        },

        calcularCg() {
            if (this.sexo == 'M' && this.valorCreatinina.resultado_lab != null) {
                this.resultadoCg = (((140 - this.edad) * this.medidasAntropometricas.peso) / (72 * parseFloat(this.valorCreatinina.resultado_lab)))
            } else if (this.sexo == 'F' && this.valorCreatinina.resultado_lab != null) {
                this.resultadoCg = (((140 - this.edad) * this.medidasAntropometricas.peso) / (72 * parseFloat(this.valorCreatinina.resultado_lab))) * 0.85
            } else {
                return this.$toast.success("Faltan datos para calcular");
            }
            this.resultadoCg = parseFloat(this.resultadoCg.toFixed(2));
        },
        calcularCkd() {
            let k = this.sexo === 'F' ? 0.7 : 0.9;
            let alpha = this.sexo === 'F' ? -0.329 : -0.411;
            let sexoFactor = this.sexo === 'F' ? 1.018 : 1;

            let scr = parseFloat(this.valorCreatinina.resultado_lab)
            let scr_k = scr / k;

            const minScr = Math.min(scr_k, 1);
            const maxScr = Math.max(scr_k, 1);

            const resultadoCkd = 141 *
                Math.pow(minScr, alpha) *
                Math.pow(maxScr, -1.209) *
                Math.pow(0.993, this.edad) *
                sexoFactor;
            this.resultadoCkd = parseFloat(resultadoCkd.toFixed(2));
        },
        guardarResultados() {
            const data = {
                resultado_cockcroft_gault: this.resultadoCg,
                resultado_ckd_epi: this.resultadoCkd,
                consulta_id: this.datos.id,
                valor_creatinina: this.valorCreatinina.resultado_lab
            }
            this.$axios.post("/funcion-renal/guardarResultados", {
                ...data
            })
                .then((res) => {
                    this.$toast.success('CKD-EPI Y Cockcroft gaulf guardado correctamente');
                    this.emitFuncion = false;
                })
                .catch((err) => {
                    return this.$toast.error("Faltan datos para guardar");
                }).finally(() => {
                    this.loading = false
                })
        },
        // obtenerCreatinina() {
        //     this.$axios.post("/resultado-laboratorio/listarResultado", {
        //         afiliado: this.afiliadoId,
        //         listarCg: true
        //     })
        //         .then((res) => {
        //             this.valorCreatinina = res.data;
        //             console.log(this.valorCrea);
        //         })
        //         .catch((err) => {
        //             return this.$toast.error("Error al consultar la creatinina");
        //         }).finally(() => {
        //             this.loading = false
        //         })
        // },
        // obtenerDatos() {
        //     const data = {
        //         resultado_cockcroft_gault: this.resultadoCg,
        //         resultado_ckd_epi: this.resultadoCkd,
        //         valor_creatinina: this.valorCreatinina.resultado_lab,
        //         consulta_id: this.consultaId
        //     }
        //         return { datos: data };
        // },
    },
}
</script>
