<template>
    <div>
        <div>
            <Ordenamiento :consulta="consultaId" :dialog="modalOrdenamiento" :habilitarBoton="false"
                @respuestaComponente="respuestaComponente()" />
        </div>
        <!-- buscar afiliado -->
        <v-card elevation="0">
            <v-container fluid>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Transcripción externa</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-row dense>
                    <!-- Componente de búsqueda de afiliado -->
                    <v-row>
                        <v-col>
                            <buscar-afiliado :documentos="documentos" @buscarAfiliado="realizarBusqueda"
                                ref="buscarAfiliado" @input="limpiarComponentes">
                            </buscar-afiliado>
                        </v-col>
                    </v-row>
                </v-row>
            </v-container>
        </v-card>
        <!-- datos del afiliado -->
        <v-card v-if="componenteAfiliado">
            <div :loading="preload" :disabled="preload" persistent>
                <component :is="componente" :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                    :mostrarClasificaciones="true" />
            </div>
        </v-card>
        <!-- Formulario registro transcripción -->
        <template v-if="componenteAfiliado">
            <v-card elevation="0">
                <v-container fluid>
                    <v-alert dense text border="left" color="blue-grey" type="info" icon="mdi-text-box-plus-outline">
                        Proceso de
                        registro transcripción <b>(IPS externa)</b></v-alert>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="3" hidden>
                                <v-text-field dense v-model="transcripcion.tipo_transcripcion"
                                    :error-messages="errors.tipo_transcripcion" label="Tipo de transcripción" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select dense v-model="transcripcion.ambito" :error-messages="errors.ambito"
                                    :items="ambitosItems" label="Ámbito de la atención*">
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="3" md="3">
                                <v-text-field v-model="transcripcion.documento_medico_ordeno" dense type="number"
                                    hide-spin-buttons :error-messages="errors.documento_medico_ordeno"
                                    label="Número documento médico ordenó"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="3" md="3">
                                <v-text-field v-model="transcripcion.nombre_medico_ordeno" dense
                                    :error-messages="errors.nombre_medico_ordeno"
                                    label="Nombre médico ordenó"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select dense v-model="transcripcion.finalidad" :error-messages="errors.finalidad"
                                    :items="finalidadItems" label="Finalidad*">
                                </v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete dense v-model="busquedaDiagnostico" :loading="loading" :items="cie10"
                                    item-text="Codigo_Nombre" item-value="id" label="Diagnóstico"
                                    :search-input.sync="buscarCie10"
                                    no-data-text="Por favor escriba el nombre del diagnóstico"
                                    @input="agregarCie10Array" :error-messages="errors.c10" />
                                <v-chip-group column>
                                    <v-chip v-for="diagnostico in transcripcion.c10" :key="diagnostico.id" close
                                        @click:close="eliminarDiagnostico(diagnostico.id)">
                                        {{ diagnostico.Codigo_Nombre }}
                                    </v-chip>
                                </v-chip-group>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-autocomplete
                                    no-data-text="Digite el nombre o el nit de la IPS que ordena el servicio. (6 caracteres)"
                                    :search-input.sync="prestador" dense v-model="transcripcion.prestador_id"
                                    :items="prestadores" :item-text="concatenarPrestador" item-value="id"
                                    label="IPS que ordena*" :error-messages="errors.prestador_id">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea auto-grow dense v-model="transcripcion.observaciones"
                                    :error-messages="errors.observaciones" label="Descripción*">
                                </v-textarea>
                            </v-col>
                            <template>
                                <v-container fluid>
                                    <v-row no-gutters>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-file-input :rules="rules" counter show-size truncate-length="10"
                                                v-model="adjuntos" small-chips multiple outlined dense label="Adjuntar"
                                                accept=".jpg, .jpeg, .pdf">
                                            </v-file-input>
                                            <v-alert border="left" colored-border type="error" dense>
                                                <small>Los archivos deben tener un tamaño máximo de 1GB<p> Extensiones
                                                        permitidas:<b><i>jpg,
                                                                jpeg, pdf</i></b></p></small>
                                            </v-alert>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </template>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small color="boton" dark @click="guardarTranscripcion()">
                                Guardar
                            </v-btn>
                        </v-card-actions>
                    </v-container>
                </v-container>
            </v-card>
        </template>
    </div>
</template>

<script>
import {
    mapActions
} from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import BuscarAfiliado from '@/components/afiliado/BuscarAfiliadoComponente.vue';
import {
    buscarAfiliado
} from "@/api/afiliados/afiliados";


export default {
    middleware({
        $can,
        redirect
    }) {
        if (!$can("transcripcion.crear")) {
            return redirect("/");
        }
    },
    components: {
        // AfiliadoComponent,
        EditarAfiliadoComponente,
        BuscarAfiliado
    },
    props: {
        documentos: Array
    },
    data: () => ({
        rules: [
            files => !files || !files.some(file => file.size > 1_073_741_824) ||
                'El archivo no puede pesar más de 1 GB!'
        ],
        busquedaDiagnostico: '',
        prestador: null,
        cedulaAfiliado: '',
        afiliado: null,
        loading: false,
        buscarCie10: null,
        componenteAfiliado: false,
        preload: null,
        componente: null,
        datos: {},
        cie10: [],
        adjuntos: [],
        prestadores: [],
        datos_personales: null,
        ambitosItems: ['Ambulatorio', 'Hospitalario', 'Urgencias'],
        medicoOrdenoItems: ['Médico general externo', 'Médico especialista externo'],
        finalidadItems: ['Accidente de trabajo', 'Detección temprana de enfermedad general',
            'Detección temprana profesional', 'Diagnóstico', 'No aplica', 'Protección específica', 'Terapéutico',
            'Teleconsulta'
        ],
        consultaId: null,
        transcripcion: {
            ambito: '',
            medico_ordeno: '',
            finalidad: '',
            c10: [],
            prestador_id: '',
            observaciones: '',
            afiliado_id: '',
            tipo_transcripcion: 'Externa',
            nombre_medico_ordeno: '',
            documento_medico_ordeno: '',
        },
        errors: {
            ambito: '',
            medico_ordeno: '',
            finalidad: '',
            c10: [],
            prestador_id: '',
            observaciones: '',
            afiliado_id: '',
            nombre_medico_ordeno: '',
            documento_medico_ordeno: '',
        },
        loading: false,
        buscarCie10: null,
        modalOrdenamiento: false,
        defecto: {
            ambito: '',
            medico_ordeno: '',
            finalidad: '',
            c10: [],
            prestador_id: '',
            observaciones: '',
            afiliado_id: '',
            tipo_transcripcion: '',
            nombre_medico_ordeno: '',
            documento_medico_ordeno: '',
        }
    }),

    watch: {
        prestador(val) {
            if (val) {
                if (val.length === 6) {
                    this.listarPrestadores();
                } else if (val.length < 6) {
                    this.prestadores = null;
                }
            } else {
                this.prestadores = null;
            }
        },

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

    methods: {
        ...mapActions('app', ['setPreload']),

        realizarBusqueda(cedula, tipoDocumento) {
            this.setPreload(true);
            this.$loadingGetRequest(buscarAfiliado(cedula, tipoDocumento)).then((res) => {
                this.componente = "EditarAfiliadoComponente";
                this.componenteAfiliado = true;
                this.datos = res.data;
                this.setPreload(false);
            }).catch(error => {
                this.setPreload(false);
                this.$toast.error(error.response.data.error);
                console.log(error)
            });
        },
        agregarCie10Array(diagnosticoId) {
            if (diagnosticoId) {
                const seleccionado = this.cie10.find(d => d.id === diagnosticoId);
                if (seleccionado && !this.transcripcion.c10.some(d => d.id === seleccionado.id)) {
                    this.transcripcion.c10.push(seleccionado);
                }
            }
            this.busquedaDiagnostico = [];
        },
        eliminarDiagnostico(id) {
            this.transcripcion.c10 = this.transcripcion.c10.filter(d => d.id !== id);
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
        listarPrestadores() {
            this.setPreload(true);
            this.$axios.post('prestador/listar?page=0', {
                nombreNit: this.prestador
            }).then(res => {
                this.setPreload(false);
                this.prestadores = res.data.data
            }).catch(e => {
                this.setPreload(false);
                console.log(e);
            })
        },

        limpiarForms() {
            this.cedulaAfiliado = null;
            this.componenteAfiliado = false
            this.transcripcion.ambito = '';
            this.transcripcion.nombre_medico_ordeno = '';
            this.transcripcion.documento_medico_ordeno = '';
            this.transcripcion.medico_ordeno = '';
            this.transcripcion.finalidad = '';
            this.transcripcion.c10 = [];
            this.transcripcion.prestador_id = '';
            this.transcripcion.observaciones = '';
            this.transcripcion.afiliado_id = '';
            this.transcripcion.tipo_transcripcion = 'Externa';
            this.componente = null;
            this.componenteAfiliado = false;
            this.adjuntos = [];
            this.busquedaDiagnostico = [],
                this.datos = {};
        },

        concatenarPrestador(listarPrestadores) {
            return `${listarPrestadores.codigo_habilitacion} | ${listarPrestadores.nombre_prestador} | ${listarPrestadores.municipio.nombre}`;
        },
        guardarTranscripcion() {
            if (this.datos.tipo_afiliado_id == 4) {
                this.setPreload(false);
                return this.$swal({
                    title: 'El afiliado está fallecido.',
                    type: 'error',
                });
            }
            if (this.adjuntos.length < 1) {
                this.setPreload(false);
                return this.$swal({
                    title: '!No puede ser!',
                    text: "Debe adjuntar como mínimo un archivo",
                    type: 'error',
                })
            } else {
                this.setPreload(true);
                const formData = new FormData();
                formData.append(`afiliado_id`, this.datos.id);
                formData.append(`ambito`, this.transcripcion.ambito);
                formData.append(`nombre_medico_ordeno`, this.transcripcion.nombre_medico_ordeno);
                formData.append(`documento_medico_ordeno`, this.transcripcion.documento_medico_ordeno);
                formData.append(`medico_ordeno`, this.transcripcion.medico_ordeno);
                formData.append(`finalidad`, this.transcripcion.finalidad);
                formData.append(`observaciones`, this.transcripcion.observaciones);
                formData.append(`prestador_id`, this.transcripcion.prestador_id);
                formData.append(`tipo_transcripcion`, 'Externa');
                formData.append(`user_id`, this.$store.state.auth.usuario.id);

                for (let i = 0; i < this.transcripcion.c10.length; i++) {
                    formData.append(`c10[]`, this.transcripcion.c10[i].id);
                }

                for (let i = 0; i < this.adjuntos.length; i++) {
                    formData.append(`adjuntos[]`, this.adjuntos[i]);
                }

                this.$axios.post('transcripciones/crear', formData).then(res => {
                    this.$toast.success(res.data.mensaje)
                    this.consultaId = parseInt(res.data.data['consulta'].id);
                    this.modalOrdenamiento = true
                    this.setPreload(false);
                    this.limpiarForms();
                }).catch(error => {
                    this.setPreload(false);
                    console.log(error);
                    if (error.response.data.mensaje) {
                        this.$toast.error(error.response.data.mensaje)
                    } else if (error.response.data) {
                        this.ErrorEntrada(error.response.data)
                    }
                })
                this.limpiarError();
            }
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },
        limpiarError() {
            for (const key in this.errors) {
                this.errors[key] = ''
            }
        },
        respuestaComponente() {
            this.modalOrdenamiento = false;
        },
        limpiarComponentes() {
            this.componenteAfiliado = false,
                this.limpiarError()
            this.limpiarForms()
        }
    },
};

</script>
