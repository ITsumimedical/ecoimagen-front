<template>
    <v-dialog v-model="mostrarModalAgregar" scrollable fullscreen persistent max-width="1200px"
        transition="dialog-transition">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Registrar Evolución</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <ordenamiento :consulta="this.datosAdmision?.consulta?.id" :habilitarBoton="true" :dialog="false" />
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formCrearEvolucion" :disabled="loading.signosVitales">
                    <v-row dense class="mt-4">
                        <v-col cols="12" sm="12" md="12" class="mb-2">
                            <v-divider />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Subjetivos" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.subjetivo" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined auto-grow label="Descripción Física" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.descripcion_fisica" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Paraclíncios" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.paraclinicos" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Procedimientos" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.procedimiento" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea dense outlined auto-grow label="Análisis" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.analisis" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field dense outlined label="Tratamiento" :rules="[rules.obligatorio]"
                                v-model="formEvolucion.tratamiento" />
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field dense outlined label="Presión Sistólica" type="number"
                                v-model="formEvolucion.presion_sistolica" />
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field dense outlined label="Presión Diastólica" type="number"
                                v-model="formEvolucion.presion_diastolica" />
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                            <v-text-field dense outlined label="Tensión Arterial (PAM)" type="number"
                                v-model="formEvolucion.tension_arterial" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Peso" type="number" v-model="formEvolucion.peso" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Frecuencia Respiratoria" type="number"
                                v-model="formEvolucion.frecuencia_respiratoria" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Frecuencia Cardíaca" type="number"
                                v-model="formEvolucion.frecuencia_cardiaca" />
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-text-field dense outlined label="Temperatura" type="number"
                                v-model="formEvolucion.temperatura" />
                        </v-col>
                    </v-row>
                </v-form>
                <v-form ref="formAgregarDiagnostico">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="my-2">
                            <v-divider />
                        </v-col>
                        <v-col cols="12" sm="5" md="5">
                            <v-autocomplete dense outlined label="Diagnóstico" :items="opciones.diagnosticos"
                                item-text="Codigo_Nombre" item-value="id" :loading="loading.opcionesDiagnosticos"
                                :search-input.sync="campoBusqueda.diagnostico" v-model="formDiagnostico.cie10_id"
                                no-data-text="Escriba el Código o Nombre del Diagnóstico para iniciar la búsqueda." />
                        </v-col>
                        <v-col cols="12" sm="5" md="5">
                            <v-select dense outlined label="Tipo de Diagnóstico"
                                v-model="formDiagnostico.tipo_diagnostico" :items="opciones.tiposDiagnostico" />
                        </v-col>
                        <v-col cols="12" sm="2" md="2">
                            <v-btn dark block color="primary" @click="guardarDiagnostico"
                                :loading="loading.historicoDiagnosticos">Agregar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table dense :loading="loading.historicoDiagnosticos" :items="historicoDiagnosticos"
                            :headers="headersHistoricoDiagnosticos">
                            <template v-slot:[`item.primario`]="{ item }">
                                <v-chip small dark label :color="item.esprimario ? 'success' : 'error'">
                                    <b>{{ item.esprimario ? 'SI' : 'NO' }}</b>
                                </v-chip>
                            </template>
                            <template v-slot:[`item.acciones`]="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon color="error" v-bind="attrs" v-on="on"
                                            @click="eliminarDiagnostico(item)">
                                            mdi-close-circle-outline
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
                <v-btn small dark color="success" @click="enviarFormulario">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
import Ordenamiento from "~/components/ordenamiento/ordenamiento.vue";

export default {
    components: {
        Ordenamiento
    },
    props: {
        mostrarModalAgregar: {
            type: Boolean,
            default: false
        },
        datosAdmision: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            loading: {
                opcionesDiagnosticos: false,
                historicoDiagnosticos: false,
                signosVitales: false
            },
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.'
            },
            campoBusqueda: {
                diagnostico: null
            },
            opciones: {
                diagnosticos: [],
                tiposDiagnostico: ['Impresión diagnóstica', 'Confirmado nuevo', 'Confirmado repetido'],
            },
            formEvolucion: {
                subjetivo: null,
                descripcion_fisica: null,
                paraclinicos: null,
                procedimiento: null,
                analisis: null,
                tratamiento: null,
                peso: null,
                presion_sistolica: null,
                presion_diastolica: null,
                tension_arterial: null,
                frecuencia_respiratoria: null,
                frecuencia_cardiaca: null,
                temperatura: null,
            },
            formDiagnostico: {
                cie10_id: null,
                tipo_diagnostico: null
            },
            headersHistoricoDiagnosticos: [
                { text: "Diagnóstico", value: 'cie10.Codigo_Nombre', align: 'center' },
                { text: "Tipo de Diagnóstico", value: 'tipo_diagnostico', align: 'center' },
                { text: "Primario", value: 'primario', align: 'center' },
                { text: "Acciones", value: 'acciones', align: 'center', sortable: false },
            ],
            historicoDiagnosticos: []
        }
    },
    watch: {
        'formEvolucion.presion_sistolica': 'calcularTensionArterial',
        'formEvolucion.presion_diastolica': 'calcularTensionArterial',
        'campoBusqueda.diagnostico'(nuevoValor) {
            if (nuevoValor && nuevoValor.length === 3) {
                this.buscarOpcionesDiagnosticos()
            }
        },
        'mostrarModalAgregar'(nuevoValor) {
            if (nuevoValor) {
                this.obtenerSignosVitalesIniciales()
                this.listarHistoricoDiagnosticos()
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.$refs.formCrearEvolucion.reset();
            this.$refs.formAgregarDiagnostico.reset();
            this.historicoDiagnosticos = [];
            this.$emit('update:mostrarModalAgregar', false);
        },

        async obtenerSignosVitalesIniciales() {
            this.loading.signosVitales = true;
            try {
                const consultaId = this.datosAdmision?.consulta?.id ?? null;

                if (!consultaId) return;

                const { data } = await this.$axios.get(`/historia/consultar-signos-vitales-consulta/${consultaId}`);

                this.formEvolucion.peso = data.peso ?? null;
                this.formEvolucion.frecuencia_respiratoria = data.frecuencia_respiratoria ?? null;
                this.formEvolucion.frecuencia_cardiaca = data.frecuencia_cardiaca ?? null;
                this.formEvolucion.temperatura = data.temperatura ?? null;
                this.formEvolucion.presion_sistolica = data.presion_sistolica ?? null;
                this.formEvolucion.presion_diastolica = data.presion_diastolica ?? null;
                this.formEvolucion.tension_arterial = data.presion_arterial_media ?? null;

                this.calcularTensionArterial(); // Calcula PAM si hay PS y PD
            } catch (error) {
                this.$toast.error('Error al obtener los signos vitales iniciales');
            } finally {
                this.loading.signosVitales = false;
            }
        },

        calcularTensionArterial() {
            const ps = parseFloat(this.formEvolucion.presion_sistolica);
            const pd = parseFloat(this.formEvolucion.presion_diastolica);

            if (!isNaN(ps) && !isNaN(pd)) {
                const pam = ((ps + (2 * pd)) / 3).toFixed(1);
                this.formEvolucion.tension_arterial = parseFloat(pam);
            }
        },

        async enviarFormulario() {

            if (!this.$refs.formCrearEvolucion.validate()) return;
            try {
                const payload = {
                    ...this.formEvolucion,
                    consulta_id: this.datosAdmision?.consulta?.id ?? null,
                    admision_urgencia_id: this.datosAdmision?.id ?? null,
                }

                this.setPreload(true);

                await this.$axios.post('/evoluciones/crear', payload);

                this.$toast.success('Evolución registrada correctamente.')

                this.cerrarModal()

                this.$emit('recargarDatos')

            } catch (error) {
                this.$toast.error('Ocurrió un error al registrar la evolución.')
            } finally {
                this.setPreload(false)
            }
        },

        async buscarOpcionesDiagnosticos() {
            try {
                const payload = {
                    valor: this.campoBusqueda.diagnostico
                };

                this.loading.opcionesDiagnosticos = true;

                const { data } = await this.$axios.post('/cie10/listarFiltro', payload);

                this.opciones.diagnosticos = data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los diagnósticos');
            } finally {
                this.loading.opcionesDiagnosticos = false;
            }
        },

        async guardarDiagnostico() {
            if (!this.$refs.formAgregarDiagnostico.validate()) return;

            const payload = {
                consulta_id: this.datosAdmision?.consulta?.id ?? null,
                tipo: this.formDiagnostico.tipo_diagnostico,
                cie10_id: this.formDiagnostico.cie10_id
            }
            try {
                this.setPreload(true);

                await this.$axios.post('/historia/guardarCie10', payload);

                this.$toast.info('Diagnóstico agregado correctamente.');

                this.$refs.formAgregarDiagnostico.reset();

                await this.listarHistoricoDiagnosticos();

            } catch (error) {
                this.$toast.error('Ocurrió un error al registrar el diagnóstico');
            } finally {
                this.setPreload(false);
            }
        },

        async listarHistoricoDiagnosticos() {
            try {
                this.loading.historicoDiagnosticos = true;

                const { data } = await this.$axios.post('/historia/listarCie10Historico', {
                    consulta: this.datosAdmision?.consulta?.id ?? null,
                })

                this.historicoDiagnosticos = data;
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar el histórico de diagnósticos.')
            } finally {
                this.loading.historicoDiagnosticos = false;
            }
        },

        async eliminarDiagnostico(item) {
            try {
                const { value } = await this.$swal({
                    title: '¿Está Seguro?',
                    text: `Está a punto de eliminar el diagnóstico ${item.cie10.Codigo_Nombre}`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'Cancelar',
                });

                if (value) {

                    this.loading.historicoDiagnosticos = true;

                    const { data } = await this.$axios.delete(`/historia/eliminarCie10/${item.id}`, {
                        data: {
                            consulta_id: item.consulta_id
                        }
                    });

                    const mensaje = data.mensaje ?? 'Diagnóstico eliminado correctamente.';

                    this.$toast.success(mensaje)

                    await this.listarHistoricoDiagnosticos()
                }


            } catch (error) {
                this.$toast.error('Ocurrió un error al eliminar el diagnóstico')
            } finally {
                this.loading.historicoDiagnosticos = false;
            }
        }

    }
}
</script>