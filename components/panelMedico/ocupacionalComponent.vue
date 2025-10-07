<template>
    <div>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify"
                label="Puede realizar la busqueda por cualquier columna" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="citasOcupacionesPendientes" hide-default-footer :search="search" dense
            class="elevation-1">
            <template v-slot:[`item.nombreAfiliado`]="{ item }">
                {{ [item.primer_nombre, item.segundo_nombre, item.primer_apellido,
                item.segundo_apellido].filter(Boolean).join(' ') || 'Sin nombre' }}
            </template>
            <template v-slot:[`item.tipoDocumentoAfiliado`]="{ item }">
                {{ item.tipo_documento }}
            </template>
            <template v-slot:[`item.documentoAfiliado`]="{ item }">
                {{ item.numero_documento }}
            </template>
            <template v-slot:[`item.sexoAfiliado`]="{ item }">
                {{ item.sexo }}
            </template>
            <template v-slot:[`item.edadAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].edad_cumplida }}
            </template>
            <template v-slot:[`item.sedeAfiliado`]="{ item }">
                {{ item.agenda.afiliados[0].ips }}
            </template>
            <template v-slot:[`item.especialidad`]="{ item }">
                {{ item.especialidad }}
            </template>
            <template v-slot:[`item.actividad`]="{ item }">
                {{ item.tipo_consulta_id }}
            </template>
            <template v-slot:[`item.estado_consulta`]="{ item }">
                <v-chip v-if="item.estado_consulta == 14 || item.estado_consulta == 13"
                    :color="getColor(item.estado_consulta)" small dark>
                    {{ 'Sin atender' }}
                </v-chip>
                <v-chip v-if="item.estado_consulta == 7" :color="getColor(item.estado_consulta)" small dark>
                    {{ 'En consulta' }}
                </v-chip>
                <v-chip v-if="item.estado_consulta == 8" :color="getColor(item.estado_consulta)" small dark>
                    {{ 'Inasistido' }}
                </v-chip>
                <v-chip v-if="item.estado_consulta == 9" :color="getColor(item.estado_consulta)" small dark>
                    {{ 'Atendido' }}
                </v-chip>
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
                <v-btn color="success" small @click="generarHistoria(item)">Atender</v-btn>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogHistoria" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
            <v-card>
                <v-toolbar dark color="info">
                    <v-btn icon dark @click="pausarConsulta()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Historia Clinica ({{ }})</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="orange" icon v-on="on" v-bind="attrs">
                                <v-icon>mdi-account-search</v-icon>
                            </v-btn>
                        </template>
                        <span>Historial de consultas</span>
                    </v-tooltip>
                    <v-btn icon color="pink">
                        <v-icon>mdi-medical-bag</v-icon>
                    </v-btn>
                    <v-btn icon color="yellow">
                        <v-icon>mdi-book-open-page-variant</v-icon>
                    </v-btn>
                    <v-btn icon color="black">
                        <v-icon>mdi-human</v-icon>
                    </v-btn>
                    <v-btn icon color="gray">
                        <v-icon>mdi-close-octagon</v-icon>
                    </v-btn>
                    <v-btn icon color="orange">
                        <v-icon>mdi-file-powerpoint-box</v-icon>
                    </v-btn>

                    <v-btn icon color="purple">
                        <v-icon>mdi-test-tube</v-icon>
                    </v-btn>
                    <v-btn icon color="green">
                        <v-icon>mdi-disqus</v-icon>
                    </v-btn>
                    <!-- <v-btn color="warning" dark @click="finalizarHistoria()" class="ma-2">Finalizar</v-btn> -->
                </v-toolbar>
                <v-stepper alt-labels>
                </v-stepper>
                <v-container fluid v-if="citasOcupacionesPendientes.length > 0" style="background: #3498db14;">
                    <v-row>
                        <v-col cols="12" sm="1">
                            <v-text-field label="# Historia:" outlined dense :value="citasOcupacionesPendientes[0].id"
                                readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-text-field label="Ciclo vital:" outlined dense
                                :value="citasOcupacionesPendientes[0].ciclo_vida_atencion" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-text-field label="Cedula:" outlined dense
                                :value="citasOcupacionesPendientes[0].numero_documento" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-text-field label="Edad:" outlined dense
                                :value="citasOcupacionesPendientes[0].edad_cumplida" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-text-field label="Genero:" outlined dense
                                :value="citasOcupacionesPendientes[0].sexo === 'M' ? 'Masculino' : 'Femenino'"
                                readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="Código blanco:" outlined dense value="" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-text-field label="Domiciliario:" outlined dense value="" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="2">
                            <v-text-field label="Portabilidad:" outlined dense value="" readonly></v-text-field>
                        </v-col>
                        <v-card-actions class="pb-9">
                            <v-btn color="warning" dark @click="pausarConsulta()" small>
                                <v-icon>mdi-close</v-icon>Pausa
                            </v-btn>
                            <v-btn color="success" dark @click="finalizarHistoria()" small>
                                <v-icon>mdi-bookmark-check</v-icon>Finalizar
                            </v-btn>
                        </v-card-actions>
                        <v-col cols="12" sm="12" style="margin-top: -38px;">
                            <v-alert type="info" dense text outlined icon="mdi-alarm-light">
                                <b>Nota:</b><span>Recuerde que la historia debe diligenciarse en su totalidad y en los
                                    campos</span>
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-container>
                <v-responsive class="overflow-y-auto" max-height="855">
                    <template>
                        <v-container grid-list-md fluid class="pa-0">
                            <v-layout row wrap>
                                <v-col cols="12" sm="2">
                                    <v-stepper v-if="e6" v-model="e6" :vertical="true">
                                        <template v-for="(e, index) in elementos">
                                            <v-stepper-step :key="`${e.id}-step`" :complete="e6 > e.id" :step="e.id"
                                                :editable="true" @click="head(e.id, index)">
                                                {{ e.nombre }}
                                            </v-stepper-step>
                                        </template>
                                    </v-stepper>
                                </v-col>
                                <v-col cols="12" sm="10">
                                    <v-stepper v-if="e6" v-model="e6">
                                        <component :is="comp" :datos="usuario" :ocupacional="citasOcupacionesPendientes"
                                            :actualizarDatosAfiliado="true" :datosBasicos="true"
                                            :camposNoEditables="false"
                                            :tipoConsultaOcupacional="tipoConsultaOcupacional"
                                            @respuestaComponente="continuar(step)" />
                                    </v-stepper>
                                </v-col>
                            </v-layout>
                        </v-container>
                    </template>
                </v-responsive>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import AreasPsicologiaOcupacionalComponent from '../../components/historia_ocupacional/PiscologiaOcupacional/AreasPsicologia.vue';
import DiagnosticosOcupacionalesComponent from '../../components/historia/diagnosticos/diagnosticos.vue';
import ConductaOcupacionalComponent from '../historia_ocupacional/ConductaOcupacional.vue';
import AnamnesisVozOcupacionalComponent from '../../components/historia_ocupacional/VozOcupacional/AnamnesisVoz.vue';
import AntecedentesPersonalesOcupacionalesComponent from '../../components/historia/antecedentesHistoria/AntecedentesPersonalesComponent.vue';
import AntecedentesFamiliaresOcupacionalesComponent from '../../components/historia/antecedentesHistoria/AntecedentesFamiliaresComponent.vue';
import RespiracionVozComponent from '../../components/historia_ocupacional/VozOcupacional/RespiracionVoz.vue';
import CualidadesVozComponent from '../../components/historia_ocupacional/VozOcupacional/CualidadesVoz.vue';
import ManejoPersonalVozComponent from '../../components/historia_ocupacional/VozOcupacional/ManejoPersonalVoz.vue';
import ExamenFisicoVozComponent from '../../components/historia_ocupacional/VozOcupacional/ExamenFisicoVoz.vue';
import ExamenVisiometriaComponent from '../../components/historia_ocupacional/VisiometriaOcupacional/ExamenVisiometria.vue';
import AntecedentesOcupacionalesMedicosComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/AntecedentesOcupacionalesMedicos.vue';
import VacunasMedicasOcupacionalesComponent from '../../components/historia/antecedentesHistoria/AntecedentesVacunacionComponent.vue';
import GinecoobstetricosMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/GinecoobstetricosMedica.vue';
import HabitosMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/HabitosMedica.vue';
import RevisionSistemasMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/RevisionSistemasMedica.vue';
import CondicionesSaludMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/CondicionesSaludMedica.vue';
import ExamenFisicoMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/ExamenFisicoMedica.vue';
import ConceptoLaboralMedicaComponent from '../../components/historia_ocupacional/ConsulaMedicaOcupacional/ConceptoLaboralMedica.vue';
import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";
export default {
    name: 'WorkspaceJsonOcupacionalComponent',
    props: {
        datos: Object,
        ocupacional: Array,
        tipoConsultaOcupacional: Object
    },
    components: {
        // SALUD OCUPACIONAL
        AreasPsicologiaOcupacionalComponent,
        DiagnosticosOcupacionalesComponent,
        ConductaOcupacionalComponent,
        AnamnesisVozOcupacionalComponent,
        AntecedentesPersonalesOcupacionalesComponent,
        AntecedentesFamiliaresOcupacionalesComponent,
        RespiracionVozComponent,
        CualidadesVozComponent,
        ManejoPersonalVozComponent,
        ExamenFisicoVozComponent,
        ExamenVisiometriaComponent,
        AntecedentesOcupacionalesMedicosComponent,
        VacunasMedicasOcupacionalesComponent,
        GinecoobstetricosMedicaComponent,
        HabitosMedicaComponent,
        RevisionSistemasMedicaComponent,
        CondicionesSaludMedicaComponent,
        ExamenFisicoMedicaComponent,
        ConceptoLaboralMedicaComponent,
        AfiliadoComponent,
    },
    data() {
        return {
            search: '',
            step: 1,
            e6: 1,
            comp: null,
            elementos: [],
            dialogHistoria: false,
            citasOcupacionesPendientes: [],
            usuario: {},
            datosConsulta: {},
            editar: false,
            headers: [{
                text: 'id',
                sortable: false,
                value: 'id'
            },
            {
                text: 'Hora',
                sortable: false,
                value: 'fecha_hora_inicio'
            },
            {
                text: 'Nombre',
                sortable: false,
                value: 'nombreAfiliado'
            },
            {
                text: 'Tipo Doc',
                sortable: false,
                value: 'tipo_documento'
            },
            {
                text: 'Documento',
                sortable: false,
                value: 'numero_documento'
            },
            {
                text: 'Sexo',
                sortable: false,
                value: 'sexo'
            },
            {
                text: 'Edad',
                sortable: false,
                value: 'edad_cumplida'
            },
            {
                text: 'Sede',
                sortable: false,
                value: 'SEDE'
            },
            {
                text: 'Especialidad',
                sortable: false,
                value: 'especialidad'
            },
            {
                text: 'Actividad',
                sortable: false,
                value: 'ACTIVIDAD'
            },
            {
                text: 'Estado',
                sortable: false,
                value: 'estado_consulta',
                align: 'center',
            },
            {
                text: 'Acciones',
                value: 'acciones',
                align: 'center',
            }
            ],
        };
    },

    created() {
        this.citasOcupacionales()
    },

    methods: {
        continuar(value) {
            const next = value + 1
            this.e6 = next;
            this.step = next;
            this.comp = this.elementos[parseInt(value)].componente;
        },

        head(id, key) {
            this.e6 = id;
            this.step = id;
            this.comp = this.elementos[parseInt(key)].componente;
        },
        citasOcupacionales() {
            this.$axios.post('/consultas/citasOcupacionales').then(res => {
                this.citasOcupacionesPendientes = res.data;
            }).catch(err => {
                this.preload = false;
            })
        },

        atencionOcupacional(item) {
            this.datosConsulta = item
            if (item.ACTIVIDAD == 'Psicologia ocupacional') {
                this.elementos = [{
                    id: 1,
                    nombre: 'Datos Paciente',
                    componente: 'AfiliadoComponent'
                },
                {
                    id: 2,
                    nombre: 'Atención',
                    componente: 'AnamnesisVozOcupacionalComponent'
                },
                {
                    id: 3,
                    nombre: 'Antecedentes Personales De Enfermedad Mental',
                    componente: 'AntecedentesPersonalesOcupacionalesComponent'
                },
                {
                    id: 4,
                    nombre: 'Antecedentes Familiares De Enfermedad Mental',
                    componente: 'AntecedentesFamiliaresOcupacionalesComponent'
                },
                {
                    id: 5,
                    nombre: 'Area Cognitiva - Procesos Cognitivos Superiores',
                    componente: 'AreasPsicologiaOcupacionalComponent'
                },
                {
                    id: 6,
                    nombre: 'Diagnosticos',
                    componente: 'DiagnosticosOcupacionalesComponent'
                },
                {
                    id: 7,
                    nombre: 'Conducta Final',
                    componente: 'ConductaOcupacionalComponent'
                }
                ];
                this.comp = 'AfiliadoComponent';
            }
            if (item.ACTIVIDAD == 'Voz ocupacional') {
                this.elementos = [{
                    id: 1,
                    nombre: 'Datos Paciente',
                    componente: 'AfiliadoComponent'
                },
                {
                    id: 2,
                    nombre: 'Atencion',
                    componente: 'AnamnesisVozOcupacionalComponent'
                },
                {
                    id: 3,
                    nombre: 'Antecedentes Personales',
                    componente: 'AntecedentesPersonalesOcupacionalesComponent'
                },
                {
                    id: 4,
                    nombre: 'Antecedentes Familiares',
                    componente: 'AntecedentesFamiliaresOcupacionalesComponent'
                },
                {
                    id: 5,
                    nombre: 'Respiracion',
                    componente: 'RespiracionVozComponent'
                },
                {
                    id: 6,
                    nombre: 'Cualidades de la Voz',
                    componente: 'CualidadesVozComponent'
                },
                {
                    id: 7,
                    nombre: 'Manejo de Resonadores',
                    componente: 'ManejoPersonalVozComponent'
                },
                {
                    id: 8,
                    nombre: 'Manejo de Resonadores',
                    componente: 'ExamenFisicoVozComponent'
                },
                {
                    id: 9,
                    nombre: 'Diagnosticos',
                    componente: 'DiagnosticosOcupacionalesComponent'
                },
                {
                    id: 10,
                    nombre: 'Conducta Final',
                    componente: 'ConductaOcupacionalComponent'
                },
                ];
                this.comp = 'AfiliadoComponent';
            }
            if (item.ACTIVIDAD == 'Visiometria ocupacional') {
                this.elementos = [{
                    id: 1,
                    nombre: 'Datos Paciente',
                    componente: 'AfiliadoComponent'
                },
                {
                    id: 2,
                    nombre: 'Atencion',
                    componente: 'AnamnesisVozOcupacionalComponent'
                },
                {
                    id: 3,
                    nombre: 'Antecedentes Personales',
                    componente: 'AntecedentesPersonalesOcupacionalesComponent'
                },
                {
                    id: 4,
                    nombre: 'Antecedentes Familiares',
                    componente: 'AntecedentesFamiliaresOcupacionalesComponent'
                },
                {
                    id: 5,
                    nombre: 'Examen Visiometria',
                    componente: 'ExamenVisiometriaComponent'
                },
                {
                    id: 6,
                    nombre: 'Diagnosticos',
                    componente: 'DiagnosticosOcupacionalesComponent'
                },
                {
                    id: 7,
                    nombre: 'Conducta Final',
                    componente: 'ConductaOcupacionalComponent'
                },
                ];
                this.comp = 'AfiliadoComponent';
            }
            if (item.ACTIVIDAD == 'Consulta Medica ocupacional') {
                this.elementos = [{
                    id: 1,
                    nombre: 'Datos Paciente',
                    componente: 'AfiliadoComponent'
                }, {
                    id: 2,
                    nombre: 'Atencion',
                    componente: 'AnamnesisVozOcupacionalComponent'
                },
                {
                    id: 3,
                    nombre: 'Antecedentes Personales',
                    componente: 'AntecedentesPersonalesOcupacionalesComponent'
                },
                {
                    id: 4,
                    nombre: 'Antecedentes Familiares',
                    componente: 'AntecedentesFamiliaresOcupacionalesComponent'
                }, {
                    id: 5,
                    nombre: 'Antecedentes Ocupacionales',
                    componente: 'AntecedentesOcupacionalesMedicosComponent'
                },
                {
                    id: 6,
                    nombre: 'Antecedentes Vacunas',
                    componente: 'VacunasMedicasOcupacionalesComponent'
                },
                {
                    id: 7,
                    nombre: 'Antecedentes  gineco-obstétricos',
                    componente: 'GinecoobstetricosMedicaComponent'
                },
                {
                    id: 8,
                    nombre: 'Habitos',
                    componente: 'HabitosMedicaComponent'
                },
                {
                    id: 9,
                    nombre: 'Revision Por Sistemas',
                    componente: 'RevisionSistemasMedicaComponent'
                },
                {
                    id: 10,
                    nombre: 'Condiciones de Salud',
                    componente: 'CondicionesSaludMedicaComponent'
                },
                {
                    id: 11,
                    nombre: 'Examen Fisico',
                    componente: 'ExamenFisicoMedicaComponent'
                },
                {
                    id: 12,
                    nombre: 'Diagnosticos',
                    componente: 'DiagnosticosOcupacionalesComponent'
                },
                {
                    id: 13,
                    nombre: 'Conducta Final - Medica',
                    componente: 'ConceptoLaboralMedicaComponent'
                },
                ];
                this.comp = 'AfiliadoComponent';
            }
        },

        getColor(estado_id) {
            if (estado_id == 5) return 'blue';
            else if (estado_id == 6) return 'orange'
            else if (estado_id == 7) return 'red'
            else return 'warning'
        },

        pausarConsulta() {
            this.dialogHistoria = false
            this.e6 = 1
        },

        generarHistoria(item) {
            this.dialogHistoria = true;
            this.datosGenerales = item
            this.buscar_afiliado()
            this.atencionOcupacional(item)
        },

        buscar_afiliado() {
            this.$loadingGetRequest(buscarAfiliado(this.citasOcupacionesPendientes[0].numero_documento)).then(res => {
                this.usuario = res.data;
                this.datosBasicos = true;
                this.editar = true;
            }).catch(error => {
                this.$toast.error(error.response.data.error)
            })
        },
    },
};

</script>

<style lang="scss" scoped></style>
