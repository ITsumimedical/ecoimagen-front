<template>
    <form>
        <v-card elevation="0">
            <v-card-text>

                <!-- Afiliado -->
                <v-row dense>
                    <v-col cols="12" md="12" sm="12">
                        <AfiliadoComponente :afiliado="afiliado" :modoDetalle="true" :modoEdicion="true"
                            :mostrarClasificaciones="true" />
                    </v-col>
                </v-row>

                <!-- Ingreso concurrencia -->
                <v-col cols="12"></v-col>
                <v-alert dense text border="left" color="blue-grey" type="warning" icon="mdi-open-in-app">
                    Ingreso concurrencia</v-alert>
                <v-row dense>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingresoConcurrencia.fecha_ingreso_formateada"
                            :error-messages="errors.fecha_ingreso" label="Fecha de Ingreso*" type="date">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-autocomplete dense v-model="ingresoConcurrencia.cie10_id" :error-messages="errors.cie10_id"
                            :items="diagnosticos" item-text="Codigo_Nombre" item-value="id"
                            label="Diagnóstico de Ingreso*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense v-model="ingresoConcurrencia.tipo_hospitalizacion"
                            :error-messages="errors.tipo_hospitalizacion" :items="tipoHospitalizacion"
                            label="Tipo Hospitalizacion*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense v-model="ingresoConcurrencia.especialidad_id"
                            :error-messages="errors.especialidad_id" :items="especialidades" item-value="id"
                            item-text="nombre" label="Especialidad Tratante*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense v-model="ingresoConcurrencia.unidad_funcional"
                            :error-messages="errors.unidad_funcional" :items="unidadFuncional"
                            label="Unidad Funcional*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="3" md="3">
                        <v-autocomplete dense v-model="ingresoConcurrencia.via_ingreso"
                            :error-messages="errors.via_ingreso" :items="viaIngreso" label="Via Ingreso*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete dense v-model="ingresoConcurrencia.reingreso_15_dias"
                            :error-messages="errors.reingreso_15_dias" :items="reingresoItems"
                            label="Reingreso Hospitalizacion 15 Dias*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete dense v-model="ingresoConcurrencia.reingreso_30_dias"
                            :error-messages="errors.reingreso_30_dias" :items="reingresoItems"
                            label="Reingreso Hospitalizacion 30 Dias*">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-autocomplete v-model="ingresoConcurrencia.rep_id"
                            label="Nit o Nombre del Prestador (Institucion de Atención)" :items="reps" item-value="id"
                            item-text="nombre" :search-input.sync="rep" dense :error-messages="errors.rep_id">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingresoConcurrencia.estancia_total" type="number"
                            :error-messages="errors.estancia_total" label="Estancia Total en Dias*">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingresoConcurrencia.cama_piso" :error-messages="errors.cama_piso"
                            label="Cama o habitación*">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingresoConcurrencia.codigo_hospitalizacion"
                            :error-messages="errors.codigo_hospitalizacion" label="Código hospitalización*">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-textarea auto-grow dense v-model="ingresoConcurrencia.nota_seguimiento"
                            :error-messages="errors.nota_seguimiento" label="Nota de ingreso*">
                        </v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small color="warning" @click="actualizarIngreso(ingresoConcurrencia)">
                                Actualizar ingreso <v-icon right>mdi-update</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-col>
                    <v-col cols="12">
                        <v-row dense>
                            <!-- Complemento ingreso componente -->
                            <v-col cols="6" v-if="this.ingresoConcurrencia != null">
                                <ComplementoIngresoConcurrencia :IngresoConcurrencia="this.ingresoConcurrencia.id" />
                            </v-col>
                            <!-- Ordenamiento concurrencia componente -->
                            <v-col cols="6" v-if="this.ingresoConcurrencia != null">
                                <OrdenamientoConcurrencia :IngresoConcurrencia="this.ingresoConcurrencia.id" />
                            </v-col>
                        </v-row>
                    </v-col>

                    <!-- dialogo fecha de aplicación actualización -->
                    <v-dialog v-model="mostrarModal" persistent max-width="500">
                        <v-card>
                            <v-alert icon="mdi-update" text dense border="left" color="blue-grey">Proceso de
                                actualización de ingreso
                                concurrencia</v-alert>
                            <v-card-text>
                                <v-text-field label="Fecha de aplicación actualización"
                                    v-model="ingresoConcurrencia.fecha_aplicacion" type="date"
                                    :rules="[v => !!v || 'La fecha de aplicación es obligatoria']" />
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" small @click="cancelarModal">Cancelar</v-btn>
                                <v-btn color="success" small @click="confirmarFechaAplicacion">Confirmar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- dialogo fecha aplicación concurrencia -->
                    <v-dialog v-model="dialogoConcurrencia" max-width="600px" persistent>
                        <v-card>
                            <v-alert text dense border="left" color="blue-grey" icon="mdi-calendar">Ingrese la Fecha de
                                Aplicación
                            </v-alert>
                            <v-card-text>
                                <v-text-field v-model="ingreso.fecha_aplicacion" label="Fecha de aplicación" type="date"
                                    required>
                                </v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" small @click="dialogoConcurrencia = false">Cancelar</v-btn>
                                <v-btn color="success" small @click="validarYActualizarConcurrencia">Confirmar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Concurrencia -->
                    <v-col cols="12">
                        <v-alert dense text color="blue-grey" border="left"
                            icon="mdi-transfer-right">Concurrencia</v-alert>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-autocomplete dense v-model="ingreso.alto_costo" :items="alto_costos" label="Alto Costo"
                            :error-messages="errors.alto_costo">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingreso.costo_atencion" type="number"
                            :error-messages="errors.costo_atencion" label="Costo Total Atención">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                        <v-autocomplete dense v-model="ingreso.reporte_patologia_diagnostica" :items="reporte_patologia"
                            label="Reporte Patologia Diagnostica"
                            :error-messages="errors.reporte_patologia_diagnostica">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                        <v-autocomplete dense v-model="ingreso.hospitalizacion_evitable" :items="hospitalizacion_evita"
                            label="Hospitalizacion Evitable" :error-messages="errors.hospitalizacion_evitable">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="2" md="2">
                        <v-text-field dense v-model="ingreso.fecha_egreso" type="date"
                            :error-messages="errors.fecha_egreso" label="Fecha Egreso">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-autocomplete dense label="Diagnóstico de concurrencia *" v-model="ingreso.dx_concurrencia"
                            :error-messages="errors.dx_concurrencia" :search-input.sync="filtroDiagnosticoConcurrencia"
                            :items="diagnosticosConcurrencias" item-text="Codigo_Nombre" item-value="id"
                            no-data-text="Por favor escriba el nombre del diagnóstico para iniciar la búsqueda">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4" sm="4">
                        <v-autocomplete dense label="Diagnóstico de Egreso *" v-model="ingreso.dx_egreso"
                            :error-messages="errors.dx_egreso" :search-input.sync="filtroDiagnosticoEgreso"
                            :items="diagnosticosEgreso" item-text="Codigo_Nombre" item-value="id"
                            no-data-text="Por favor escriba el nombre del diagnóstico para iniciar la búsqueda">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-autocomplete dense v-model="ingreso.destino_egreso" :error-messages="errors.destino_egreso"
                            :items="d_egreso" label="Destino de Egreso">
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!ingreso.ingreso_concurrencia_id" small color="success" dark
                    @click="guardarConcurrencia()">
                    Guardar
                </v-btn>
                <v-btn v-if="ingreso.ingreso_concurrencia_id" small color="warning" dark @click="abrirDialogo()">
                    Actualizar concurrencia
                </v-btn>
                <v-btn v-if="ingreso.destino_egreso && ingreso.fecha_egreso && ingreso.created_at" small color="success"
                    @click="DarAlta()">
                    dar alta <v-icon right>mdi-sticker-check-outline</v-icon>
                </v-btn>
            </v-card-actions>
            <!-- Eventos ingreso -->
            <v-col cols="12"></v-col>
            <v-container fluid>
                <template>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                EVENTOS
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" v-if="this.ingresoConcurrencia != null">
                                    <EventosIngresoConcurrencia :IngresoConcurrencia="this.ingresoConcurrencia.id" />
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                COSTO EVITADO
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" v-if="this.ingresoConcurrencia != null">
                                    <CostoEvitado :IngresoConcurrencia="this.ingresoConcurrencia.id" />
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                COSTO EVITABLE
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-col cols="12" v-if="this.ingresoConcurrencia != null">
                                    <CostoEvitable :IngresoConcurrencia="this.ingresoConcurrencia.id" />
                                </v-col>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>
            </v-container>
            <v-col cols="12"></v-col>
            <!-- Seguimiento componente -->
            <v-col cols="12" v-if="this.ingreso.id">
                <SeguimientoConcurrencia :IngresoConcurrencia="this.ingreso.id" />
            </v-col>
        </v-card>
    </form>
</template>

<script>
import AfiliadoComponente from '../afiliado/FormularioAfiliadoComponente.vue';
import ComplementoIngresoConcurrencia from './ComplementoIngresoConcurrencia.vue';
import CostoEvitable from './CostoEvitable.vue';
import CostoEvitado from './CostoEvitado.vue';
import OrdenamientoConcurrencia from './OrdenamientoConcurrencia.vue';
import SeguimientoConcurrencia from './SeguimientoConcurrencia.vue';
import {
    mapActions
} from "vuex"
import EventosIngresoConcurrencia from './EventosIngresoConcurrencia.vue';
export default {
    components: {
        AfiliadoComponente,
        ComplementoIngresoConcurrencia,
        OrdenamientoConcurrencia,
        SeguimientoConcurrencia,
        CostoEvitado,
        CostoEvitable,
        EventosIngresoConcurrencia
    },
    middleware({
        $can,
        redirect
    }) {
        if (!$can("transcripcion.crear")) {
            return redirect("/");
        }
    },

    name: 'formConcurrencia',

    props: {
        ingresoConcurrencia: {
            type: Object,
            default: false
        },
        afiliado_id: Number,
        datos: Object
    },

    data: () => ({
        dialogoConcurrencia: false,
        afiliado: {},
        prestadores: [],
        adjuntos: [],
        sedesAll: [],
        especialidades: [],
        sedes: '',
        reps: null,
        rep: null,
        diagnosticos: [],
        diagnosticosEgreso: [],
        diagnosticosConcurrencias: [],
        filtroDiagnostico: "",
        filtroDiagnosticoEgreso: '',
        filtroDiagnosticoConcurrencia: '',
        tipoHospitalizacion: [
            "MÉDICA", "QUIRÚRGICA"
        ],
        unidadFuncional: [
            "HOSPITALIZACIÓN OBSTÉTRICA", "HOSPITALIZACIÓN", "INTERMEDIO ADULTO", "INTERMEDIO NEONATAL",
            "INTERMEDIO PEDRIATRÍA", "UCI ADULTO", "UCI NEONATAL", "UCI PEDRIATRÍA",
        ],
        viaIngreso: [
            "CONSULTA EXTERNA", "MEDICINA DOMICILIARIA", "PRIORITARIA", "PROGRAMADO", "REFERENCIA", "URGENCIAS",
            "TRASLADO NO REGULADO",
        ],
        reingresoItems: [
            "NO ES UN REINGRESO A HOSPITALIZACIÓN POR LA MISMA CAUSA ANTES DE 15 DÍAS",
            "ALTAS TEMPRANAS NO PERTINENTES", "ALTAS VOLUNTARIAS",
            "COMPLICACIÓN POSTERIOR A LA REALIZACIÓN DEL PROCEDIMIENTO", "DETERIORO DEL ESTADO CLÍNICO",
            "DISFUNCIONALIDAD DE CATÉTERES O SONDAS (PATOLOGÍAS CRÓNICAS)",
            "EVENTOS RELACIONADOS CON USO DE MEDICAMENTOS PRESCRITOS",
            "FALTA OPORTUNIDAD EN PROCEDIMIENTOS AMBULATORIOS POSTERIOR AL ALTA (DIFERIDAS)",
            "INFECCIÓN DE SITIO OPERATORIO - ISO", "NO ADHERENCIA AL TRATAMIENTO POR PARTE DEL PACIENTE",
            "NO DISPENSACIÓN DEL MEDICAMENTO POSTERIOR AL ALTA",
            "NO INGRESO A PROGRAMAS NI CAPTACIÓN DE GESTIÓN RIESGO POSTERIOR AL ALTA",
        ],
        alto_costos: [
            "Cáncer",
            "Cirugía cardiovascular",
            "Cirugía enfermedades congénitas",
            "Diálisis (CAPD/hemo)",
            "Terapia Ecmo",
            "Electrofisiología",
            "Gran quemado",
            "Hemodinamia",
            "Neurocirugía",
            "Neurointervencionismo",
            "Quimioterapia / radioterapia",
            "Reemplazos articulares",
            "Terapia biológica",
            "Trasplante",
            "Trauma mayor",
            "UCI",
            "VIH",
        ],
        reporte_patologia: [
            "Anticoagulados - Z921",
            "Anticoagulados (Novo)",
            "Consumo de sustancias Psicoactivas",
            "Diabetes Mellitus - E109",
            "DM (Novo)",
            "Diabetes Mellitus- HTA",
            "Dislipidemia",
            "Enfermedad renal crónica - N189",
            "EPOC - J449",
            "EPOC (Novo)",
            "Hipertensión Arterial - I10x",
            "HTA (Novo)",
            "Oncológico",
            "Paciente Polimedicado",
            "Tuberculosis",
            "Victima de violencia sexual",
            "VIH ",
            "VIH / Novo",
        ],
        hospitalizacion_evita: [
            "AIT",
            "Amenaza de parto pretérmino",
            "Angina inestable",
            "Angina no especificada",
            "Anticoagulados",
            "Asma",
            "Bloqueo A-V",
            "Cáncer de cérvix",
            "Cáncer de próstata",
            "Cáncer de seno",
            "Cáncer de colón",
            "Celulitis",
            "Cetoacidosis diabética",
            "Coma hiperosmolar",
            "Diabetes gestacional descompensada",
            "DM descompensada",
            "Eclampsia",
            "ECV Hemorrágico",
            "ECV Isquémico",
            "Emergencia HTA",
            "Enfermedad Coronaria Severa",
            "Enfermedad renal Crónica",
            "Enfermedad renal crónica agudizada",
            "EPOC descompensado",
            "Falla de remisión oportuna del RN",
            "Fibrilación auricular",
            "HTA No controlada",
            "HTA inducida en el embarazo descompensada",
            "IAM",
            "Isquemia critica ( Enfermedad arterial oclusiva)",
            "ICC descompensada",
            "Infección del tracto urinario (ITU)",
            "Infecciones neonatales tempranas en madres con antecedente de patología infecciosa evitables como IVU, corioamnionitis, neumonía.",
            "Macrosomía",
            "Neumonía",
            "No dispensación de medicamentos",
            "Patología Psiquiatrica",
            "Pre-eclampsia",
            "RCIU",
            "Recién nacido con TORCH",
            "RN pretérmino",
            "RPM",
            "SDR de RN (TTRN, pulmón húmedo)",
            "TBC congénita",
            "Taquicardia supraventricular",
            "Tétanos neonatal",
            "Trastorno de electrolitos en paciente polimedicado",
            "Trastorno electrolítico con madre diabética",
            "Urgencia dialítica",
            "Urgencia HTA",
            "Covid en seguimiento",
            "VIH (Hospitalización por patología asociada a VIH)",
        ],
        d_egreso: [
            "Muerte en menor de 5 años",
            "Alta",
            "Fuga",
            "Medicina domiciliaria",
            "Muerte Materna",
            "Muerte Perinatal",
            "Muerte por Maltrato",
            "Muerto",
            "Refencia a mayor nivel",
            "Refencia a menor nivel",
            "Referencia a menor tarifa pactada",
            "Salida Voluntaria",
        ],
        ingreso: {
            fecha_ingreso: null,
            cie10_id: null,
            tipo_hospitalizacion: null,
            especialidad_id: null,
            unidad_funcional: null,
            via_ingreso: null,
            referencia_id: null,
            reingreso_15_dias: null,
            reingreso_30_dias: null,
            rep_id: null,
            estancia_total: null,
            alto_costo: null,
            costo_atencion: null,
            reporte_patologia_diagnostica: null,
            hospitalizacion_evitable: null,
            fecha_egreso: null,
            dx_concurrencia: null,
            dx_egreso: null,
            destino_egreso: null,
            nota_ingreso: null,
            ingreso_concurrencia_id: null,
        },
        errors: {
            fecha_ingreso: null,
            cie10_id: null,
            tipo_hospitalizacion: null,
            especialidad_id: null,
            unidad_funcional: null,
            via_ingreso: null,
            referencia_id: null,
            reingreso_15_dias: null,
            reingreso_30_dias: null,
            rep_id: null,
            estancia_total: null,
            alto_costo: null,
            costo_atencion: null,
            reporte_patologia_diagnostica: null,
            hospitalizacion_evitable: null,
            fecha_egreso: null,
            dx_concurrencia: null,
            dx_egreso: null,
            destino_egreso: null,
            nota_ingreso: null,
        },
        mostrarModal: false,
    }),

    mounted() {
        this.buscarAfiliado();
        this.listarEspecialidad();
        this.listarConcurrencia()
        this.rep = this.ingresoConcurrencia.rep.nombre.slice(0, 4)
        this.listarReps();
        // this.filtroDiagnostico = this.ingresoConcurrencia.cie10.Codigo_Nombre.slice(0, 4)
        this.buscarDiagnostico()
        this.buscarDiagnosticoConcurrencia()
        this.buscarDiagnosticoEgreso()
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },

        filtroDiagnostico(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarDiagnostico();
            }
        },

        filtroDiagnosticoEgreso(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarDiagnosticoEgreso();
            }
        },

        filtroDiagnosticoConcurrencia(newVal) {
            if (newVal && newVal.length === 4) {
                this.buscarDiagnosticoConcurrencia();
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        listarReps() {
            this.setPreload(true);
            this.$axios.post('reps/listarConfiltro?page=0', {
                rep: this.rep
            }).then(res => {
                if (res.data.length >= 2) {
                    this.setPreload(false);
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        }
                    })
                } else if (res.data.length == 1) {
                    this.setPreload(false);
                    this.filtro.prestador_id = res.data[0].prestador_id
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        }
                    })
                }
            }).catch(e => {
                this.setPreload(false);
                console.log(e);
            })
        },

        buscarReferencia(item) {
            this.setPreload(true);
            this.$axios.post('referencia/listarConfiltro?page=0', {
                rep_id: item,
                afiliado_id: item
            }).then(res => {
                this.setPreload(false);
                this.reps = res.data.map((rep) => {
                    return {
                        id: rep.prestador_id,
                        nombre: `${rep.nombre} - ${rep.prestadores.nit}`,
                    }
                })
            }).catch(e => {
                this.setPreload(false);
                console.log(e);
            })
        },

        listarEspecialidad() {
            this.setPreload(true);
            this.$axios.post('/especialidades/listar?').then(
                res => {
                    this.especialidades = res.data;
                    this.setPreload(false);
                }).catch(e => {
                    this.setPreload(false);
                })
        },

        guardarConcurrencia() {
            if (!this.ingreso.alto_costo, !this.ingreso.costo_atencion, !this.ingreso.reporte_patologia_diagnostica, !this
                .ingreso.hospitalizacion_evitable, !this.ingreso.fecha_egreso, !this.ingreso.dx_concurrencia, !this.ingreso
                    .dx_egreso, !this.ingreso.destino_egreso) {
                return this.$toast.error('Todos los campos son obligatorios')
            }
            this.setPreload(true);
            this.ingreso.afiliado_id = this.ingresoConcurrencia.afiliado.id;
            this.ingreso.ingreso_concurrencia_id = this.ingresoConcurrencia.id;
            this.ingreso.estado_id = 1;
            this.$axios.post('/concurrencia/crearConcurrencia', this.ingreso).then(
                res => {
                    this.$toast.success(res.data.mensaje);
                    this.setPreload(false);
                    this.listarConcurrencia()
                }).catch(error => {
                    this.setPreload(false);
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje);
                    } else if (error.response.data) {
                        this.Error(error.response.data);
                    }
                })
        },

        actualizarIngreso() {
            if (!this.ingresoConcurrencia.fecha_aplicacion) {
                this.mostrarModal = true;
                return;
            }

            this.ingresoConcurrencia.fecha_ingreso = this.ingresoConcurrencia.fecha_ingreso_formateada;
            this.ingresoConcurrencia.user_id = this.$store.state.auth.usuario.id;

            this.$axios.put("concurrencia/actualizar", this.ingresoConcurrencia)
                .then((res) => {
                    this.ingresoConcurrencia.fecha_aplicacion = null
                    this.$toast.success('¡Se ha actualizado el registro de ingreso correctamente!');
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al actualizar el reporte de ingreso");
                    console.log(err);
                });
        },
        confirmarFechaAplicacion() {
            this.mostrarModal = false;
            this.actualizarIngreso();
        },
        cancelarModal() {
            this.mostrarModal = false;
        },

        buscarAfiliado() {
            this.setPreload(true);
            this.$axios.get("afiliados/" + this.ingresoConcurrencia.afiliado.numero_documento + "/" + this
                .ingresoConcurrencia.afiliado.tipo_documento).then((res) => {
                    this.afiliado = res.data;
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                    this.$toast.error(e.response.data.error);
                });
        },

        Error(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(",");
                }
            }
        },

        limpiarData() {
            for (const key in this.ingreso) {
                this.ingreso[key] = null;
            }
            for (const key in this.errors) {
                this.errors[key] = null;
            }
            this.$emit('respuestaComponente');
        },

        buscarDiagnostico() {
            const data = {
                valor: this.filtroDiagnostico,
            };
            this.$axios
                .post("cie10/listarFiltro", data)
                .then((res) => {
                    this.diagnosticos = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnósticos");
                    console.log(err);
                })
                .finally(() => {

                });
        },

        buscarDiagnosticoEgreso() {
            const data = {
                valor: this.filtroDiagnosticoEgreso,
            };
            this.$axios
                .post("cie10/listarFiltro", data)
                .then((res) => {
                    this.diagnosticosEgreso = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnósticos");
                    console.log(err);
                })
                .finally(() => {

                });
        },

        buscarDiagnosticoConcurrencia() {
            const data = {
                valor: this.filtroDiagnosticoConcurrencia,
            };
            this.$axios
                .post("cie10/listarFiltro", data)
                .then((res) => {
                    this.diagnosticosConcurrencias = res.data;
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al cargar los diagnósticos");
                    console.log(err);
                })
                .finally(() => {

                });
        },

        listarConcurrencia() {
            this.setPreload(true);
            this.$axios.get("concurrencia/listarConcurrenciasIngreso/" + this.ingresoConcurrencia.id).then((res) => {
                this.ingreso = res.data;
                this.setPreload(false);
            })
                .catch((e) => {
                    this.setPreload(false);
                    this.$toast.error(e.response.data.error);
                });
        },

        abrirDialogo() {
            this.dialogoConcurrencia = true;
        },
        validarYActualizarConcurrencia() {
            if (!this.ingreso.fecha_aplicacion) {
                this.$toast.error("Debe ingresar la fecha de aplicación antes de continuar");
                return;
            }

            this.dialogoConcurrencia = false;

            this.actualizarConcurrencia();
        },
        actualizarConcurrencia() {
            this.$axios.put("concurrencia/actualizarConcurrencia", this.ingreso)
                .then((res) => {
                    this.$toast.success('Se ha actualizado el registro de concurrencia correctamente!');
                })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al actualizar la concurrencia");
                    console.log(err);
                });
        },

        DarAlta() {
            this.ingreso.estado_id = 52
            this.$axios.put("concurrencia/actualizarConcurrencia", this.ingreso).then((res) => {
                window.location.reload(true);
                return this.$toast.success('se ha actualizado el registro de concurrencia correctamente!.')
            })
                .catch((err) => {
                    this.$toast.error("Ocurrió un error al actualizar la concurrencia");
                    console.log(err);
                })
        },

    },
};

</script>
