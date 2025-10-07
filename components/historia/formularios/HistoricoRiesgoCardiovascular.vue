<template>
    <div>
        <template>
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Procesando Información
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </template>
        <v-form ref="historicoRcvForm" lazy-validation v-model="valid">
            <v-card elevation="0">
                <v-container fluid>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert class="text-center" dense text type="info" icon="mdi-heart-pulse" border="left">
                            <b>HISTÓRICO RIESGO CARDIOVASCULAR</b></v-alert>
                    </v-col>
                    <v-row dense>
                        <v-col cols="12" sm="3" md="3">
                            <v-autocomplete :loading="loading" label="Cup/Servicio"
                                v-model="resultadosLaboratorio.laboratorio" :items="cups" item-text="nombre" dense
                                outlined :rules="campoRequerido">
                            </v-autocomplete>
                        </v-col>

                        <v-col cols="12" sm="3" md="3">
                            <v-text-field label="Resultado" v-model="resultadosLaboratorio.resultado_lab" dense outlined
                                :rules="campoRequerido"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3" md="3">
                            <v-text-field type="date" v-model="resultadosLaboratorio.fecha_laboratorio"
                                label="Fecha de Laboratorio" :max="hoy" dense outlined :rules="campoRequerido">
                            </v-text-field>
                        </v-col>

                        <v-col cols="1" sm="1" md="1">
                            <v-btn color="boton" class="mt-2" block small dark @click="guardarLaboratorio()">Agregar
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table :loading="loading" :items="listaLaboratorio"
                                :headers="headerresultadosLaboratorio" dense>
                                <template v-slot:[`item.user.operador`]="{ item }">
                                    {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido ||
                                        ''}`.trim() || 'Sin nombre' }}
                                </template>
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }"
                                            v-if="item.medico_registra === $store.state.auth.usuario.id">
                                            <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on"
                                                @click="eliminarLaboratorio(item.id)">
                                                mdi-delete-circle-outline
                                            </v-icon>
                                        </template>
                                        <span>Eliminar resultados de laboratorio</span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:[`item.meta_individual`]="{ item }">
                                    <v-select v-if="item.laboratorio.includes('LDL')" v-model="item.meta"
                                        :items="opcionesLDL" label="META LDL" outlined dense
                                        @change="guardarMejora(item)"></v-select>

                                    <v-select v-else-if="item.laboratorio.includes('HEMOGLOBINA GLICOSILADA')"
                                        v-model="item.meta" :items="opcionesHemo" label="META HEMOGLOBINA" outlined
                                        dense @change="guardarMejora(item)"></v-select>

                                    <span v-else>-</span>
                                </template>

                            </v-data-table>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-form>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: "HistoricoRiesgoCardiovascular",
    props: ['datos', 'resumen'],
    data() {
        return {
            emitGuardarFr: false,
            resultadosLaboratorio: {},
            preload: false,
            listaLaboratorio: [],
            loading: false,
            valid: true,
            campoRequerido: [
                v => v !== null && v !== undefined || 'Este campo es requerido',
            ],
            opcionesLDL: [
                '< 55',
                '< 70',
                '< 100',
                '< 130'
            ],
            opcionesHemo: [
                '< 6.5',
                '< 7',
                '< 7.5',
                '< 8',
                '< NA'
            ],
            cups: [
                { nombre: '903895 - CREATININA EN SUERO U OTROS FLUIDOS' },
                { nombre: '903028 - MICROALBUMINURIA SEMIAUTOMATIZADA' },
                { nombre: '903818 - COLESTEROL TOTAL' },
                { nombre: '903868 - TRIGLICERIDOS' },
                { nombre: '903815 - COLESTEROL DE ALTA DENSIDAD' },
                { nombre: '903817 - COLESTEROL DE BAJA DENSIDAD [LDL] AUTOMATIZADO' },
                { nombre: '903841 - GLUCOSA EN SUERO U OTRO FLUIDO DIFERENTE A ORINA' },
                { nombre: '903427 - HEMOGLOBINA GLICOSILADA MANUAL O SEMIAUTOMATIZADA' },
                { nombre: '903426 - HEMOGLOBINA GLICOSILADA AUTOMATIZADA' }
            ],
            FiltroCups: '',
            hoy: this.$moment().format("YYYY-MM-DD"),
            headerresultadosLaboratorio: [{
                text: 'Laboratorio',
                value: 'laboratorio'
            },
            {
                text: 'Resultado 1',
                value: 'resultado1'
            },
            {
                text: 'Fecha 1',
                value: 'fecha1'
            },
            {
                text: 'Resultado 2',
                value: 'resultado2'
            },
            {
                text: 'Fecha 2',
                value: 'fecha2'
            },
            {
                text: 'Resultado 3',
                value: 'resultado3'
            },
            {
                text: 'Fecha 3',
                value: 'fecha3'
            },
            {
                text: 'Meta Individual',
                value: 'meta_individual'
            },
            ]
        }
    },
    mounted() {
        this.listarLaboratorio()
    },

    watch: {
        'resultadosLaboratorio.resultado_lab': {
            deep: true,
            handler(newVal) {
                if (this.resultadosLaboratorio.laboratorio === '903895 - CREATININA EN SUERO U OTROS FLUIDOS') {
                    this.setCreatinina({
                        resultado_lab: newVal,
                        emitGuardarFr: false
                    });
                }
            }
        }
    },

    created() {
        this.impresion = this.resumen;
    },
    methods: {
        ...mapActions('medidas', ['setCreatinina']),

        async listarLaboratorio() {
            let data = {};
            data.afiliado = this.datos.afiliado_id;
            if (this.ocupacional !== undefined) {
                data.afiliado = this.ocupacional[0].afiliado_id;
            }
            this.loading = true;

            try {
                const [resLaboratorio, resFuncionRenal] = await Promise.all([
                    this.$axios.post("/resultado-laboratorio/listarResultadoRc", {
                        afiliado: data.afiliado
                    }),
                    this.$axios.post("/funcion-renal/listarFuncionRenal", {
                        afiliado: data.afiliado
                    })
                ]);

                let consulta2 = resLaboratorio.data;

                let consulta1Array = Object.values(resFuncionRenal.data).map(item => ({
                    laboratorio: item.laboratorio,
                    resultado1: item.resultado1,
                    resultado2: item.resultado2,
                    resultado3: item.resultado3,
                    fecha1: "",
                    fecha2: "",
                    fecha3: ""
                }));

                this.listaLaboratorio = [...consulta2, ...consulta1Array];

            } catch (err) {
                this.$toast.error("Error al listar resultados de laboratorio o función renal");
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        guardarLaboratorio() {
            if (!this.$refs.historicoRcvForm.validate()) {
                return this.$toast.error('Por favor complete todos los campos requeridos');
            }
            const data = {
                ...this.resultadosLaboratorio,
                consulta_id: this.datos.id,
                medico_registra: this.$store.state.auth.usuario.id,
            }
            this.$axios.post("/resultado-laboratorio/guardar", data)
                .then((res) => {
                    if(this.resultadosLaboratorio.laboratorio === '903895 - CREATININA EN SUERO U OTROS FLUIDOS'){
                        this.setCreatinina({
                            resultado_lab: this.resultadosLaboratorio.resultado_lab,
                            emitGuardarFr: true
                        });
                    }
                    this.$toast.success(res.data.mensaje);
                    this.limpiarFiltro();
                    this.preload = false
                    this.$refs.historicoRcvForm.resetValidation();

                })
                .catch((err) => {
                    console.log(err);
                    return this.$toast.error('No hay antecedentes pre-guardados para almacenar');
                });
        },
        limpiarFiltro() {
            for (const prop of Object.getOwnPropertyNames(
                this.resultadosLaboratorio
            )) {
                this.resultadosLaboratorio[prop] = null;
            }
            this.listarLaboratorio();

        },
        guardarMejora(item) {
            const data = {
                id: item.id1,
                meta: item.meta,
            };

            this.$axios.post("/resultado-laboratorio/guardarMejora", data)
                .then((res) => {
                    this.$toast.success(res.data.message);
                    this.preload = false;
                })
                .catch((err) => {
                    console.error(err);
                    this.$toast.error("No se guardó la meta individual");
                });
        },
    }
}
</script>
