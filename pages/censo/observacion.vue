<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Observacion</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>

                    <div v-if="contadorCamas" class="d-flex align-center">
                        <v-chip small color="primary" class="mr-2" text-color="white">
                            Total camas: {{ contadorCamas.camas }}
                        </v-chip>
                        <v-chip small color="success" class="mr-2" text-color="white">
                            Disponibles: {{ contadorCamas.disponibles }}
                        </v-chip>
                        <v-chip small color="error" text-color="white">
                            Ocupadas: {{ contadorCamas.ocupadas }}
                        </v-chip>
                    </div>
                </v-toolbar>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-text>
                <v-row dense>
                    <!-- <pre>{{afiliados}}</pre> -->
                    <v-col cols="12" md="5" sm="12">
                        <v-autocomplete dense v-model="form.afiliado" label="Paciente" :items="afiliados"
                            item-value="id" item-text="numero_documento">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="5" sm="12">
                        <v-autocomplete dense v-model="form.estado" label="Estado" :items="estados" item-value="id"
                            item-text="nombre">
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="2" sm="12">
                        <v-btn small depressed color="info" @click="listarCamas()"> Filtrar
                        </v-btn>
                        <v-btn small depressed color="error" @click="limparFormulario()"> Limpiar
                        </v-btn>
                    </v-col>
                    <v-col cols="12" md="4" sm="6" v-for="cama in camas" :key="cama.id">
                        <v-card outlined style="cursor: pointer;" @click="verDetalles(cama)">
                            <v-alert dense text color="blue" class="text-center">
                                <b>{{ cama.nombre.toUpperCase() }}</b></v-alert>
                            <div class="d-flex align-center">
                                <div class="d-flex align-center mr-2" style="min-width: 40px;">
                                    <template v-if="cama.asignacion_cama.length > 0">
                                        <div class="d-flex flex-column align-center">
                                            <small class="texto">{{ '2' }}</small>
                                            <img src="/images/ICONOSCAMILLA.svg" alt="" height="48px" width="37px"
                                                class="thermometer-up">
                                        </div>
                                        <div class="d-flex flex-column align-center">
                                            <small class="texto2">{{ '°' }}</small>
                                            <img src="/images/TERMOMETRO.svg" alt="" height="50px" width="37px"
                                                class="thermometer-up2">
                                            <!-- Aquí se coloca el último botón debajo del termómetro -->
                                            <div class="d-flex flex-column align-center mt-2">
                                            <v-btn small  depressed @click.stop="abrirModales(cama.asignacion_cama[0],'AlergiaComponente')">
                                                <v-icon color="warning">mdi-alert</v-icon>
                                            </v-btn>
                                            <v-btn small class=" mt-2" depressed v-if="cama.asignacion_cama[0].admision_urgencia.estado_id ==61">
                                                <v-icon>mdi-exit-run</v-icon>
                                            </v-btn>
                                        </div>

                                        </div>
                                        <div class="d-flex flex-column align-center">
                                            <v-btn small class="alpha" depressed>
                                                <v-icon>mdi-alpha-u-box-outline</v-icon>
                                            </v-btn>
                                        </div>
                                    </template>
                                </div>

                                <img :src="getImage(cama)" alt="" class="camaPrincipal">
                                <div class="d-flex align-center" style="min-width: 40px;">
                                    <template v-if="cama.asignacion_cama.length > 0">
                                        <div class="d-flex flex-column align-center">
                                            <small class="solido">{{ calcularDias(cama.asignacion_cama[0].fecha) }}</small>
                                            <v-btn small class="medicamento" depressed
                                                v-if="cama.asignacion_cama.length > 0 &&cama.asignacion_cama[0].admision_urgencia.contrato_id ==1">
                                                AUD
                                            </v-btn>
                                            <div class="d-flex align-center">
                                                <div class="heart-container">
                                                    <img src="/images/CORAZON.svg" alt="" height="30px" width="37px">
                                                    <small class="heart-text">{{ '' }}</small>
                                                </div>
                                                <v-btn small class="ordenes ml-2" depressed
                                                    v-if="cama.asignacion_cama.length > 0 &&cama.asignacion_cama[0].admision_urgencia.contrato_id ==1">
                                                    AUT
                                                </v-btn>
                                                <v-btn small class="ordenesVacio ml-2" v-else>

                                                </v-btn>
                                            </div>
                                            <div class="d-flex align-center">
                                                <div class="heart-container"
                                                    @click.stop="abrirModales(cama.asignacion_cama[0],'NotasEnfermeriaComponente')"
                                                    v-if="cama.asignacion_cama.length > 0 &&cama.asignacion_cama[0].admision_urgencia.nota_enfermeria.length >0">
                                                    <img src="/images/Enfermeria.svg" alt="" height="30px" width="37px"
                                                        abr>
                                                </div>

                                                <div class="notas ml-2"
                                                    @click.stop="abrirModales(cama.asignacion_cama[0].admision_urgencia,'HistoricoEvolucionesComponent')"
                                                    v-if="cama.asignacion_cama.length > 0 && cama.asignacion_cama[0].admision_urgencia.evolucion.length >0">
                                                    <img src="/images/DOCTOR.svg" alt="" height="30px" width="37px">
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="cama.estado_id == 1">
                                        <div class="d-flex align-center">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small class="reservar" depressed color="error" outlined
                                                        v-bind="attrs" v-on="on" @click="novedadCama(cama,50)">
                                                        <v-icon>mdi-lock-off</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Reservar</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small class="botonMantenimiento" depressed color="warning"
                                                        outlined v-bind="attrs" v-on="on" @click="novedadCama(cama,52)">
                                                        <v-icon>mdi-wrench-clock</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Mantenimiento</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                    <template v-if="cama.estado_id == 65">
                                        <div class="d-flex align-center">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small class="liberar" depressed color="success" outlined
                                                        v-bind="attrs" v-on="on" @click="novedadCama(cama,51)">
                                                        <v-icon>mdi-lock-open-variant</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Liberar</span>
                                            </v-tooltip>
                                        </div>
                                    </template>
                                    <template v-if="cama.estado_id == 66">
                                        <div class="d-flex align-center">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small class="liberar" depressed color="success" outlined
                                                        v-bind="attrs" v-on="on" @click="novedadCama(cama,53)">
                                                        <v-icon>mdi-wrench-check</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>Liberar</span>
                                            </v-tooltip>
                                        </div>
                                    </template>

                                </div>
                            </div>
                            <v-card-text>
                                <div class="d-flex align-center justify-center text-center" style="min-width: 40px;"
                                    v-if="cama.asignacion_cama.length > 0">
                                    Paciente:
                                    {{ cama.asignacion_cama[0].admision_urgencia.consulta.afiliado.nombre_completo }} -
                                    {{cama.asignacion_cama[0].admision_urgencia.consulta.afiliado.tipo_documento.sigla}}-{{cama.asignacion_cama[0].admision_urgencia.consulta.afiliado.numero_documento}}
                                </div>
                                <div v-if="cama.estado_id == 1" class="d-flex align-center justify-center text-center"
                                    style="min-width: 40px;">
                                    <em>Disponible</em>
                                </div>
                                <div v-if="cama.estado_id == 65" class="d-flex align-center justify-center text-center"
                                    style="min-width: 40px;">
                                    <em>Reservada</em>
                                </div>
                                <div v-if="cama.estado_id == 66" class="d-flex align-center justify-center text-center"
                                    style="min-width: 40px;">
                                    <em>En Mantenimiento</em>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogoReservar" v-if="dialogoReservar" persistent width="650">
            <ReservarCamaComponent :datos="datosReservar" :tipo="tipoNovedad"
                @cerrarModal="dialogoReservar =false,listarCamas(),contador()" />
        </v-dialog>
        <v-dialog v-model="dialogoBotones" persistent width="850">
            <component :is="componente" :datos="info" @cerrar="dialogoBotones = false,info= null,componente =null" />
        </v-dialog>
        <v-dialog v-model="dialogoCama" v-if="dialogoCama" fullscreen persistent hide-overlay
            transition="dialog-bottom-transition">
            <CamaSeleccionadaComponent :datos="camaSeleccionada" @cerrarModal="dialogoCama=false" />
        </v-dialog>

    </div>
</template>

<script>
    import AlergiaComponente from "../../components/urgencias/AlergiaComponent.vue";
    import NotasEnfermeriaComponente from "../../components/urgencias/NotasEnfermeriaComponent.vue";
    import CamaSeleccionadaComponent from "../../components/camas/CamaSeleccionadaComponent.vue";
    import HistoricoEvolucionesComponent from "../../components/panelMedico/urgencias/HistoricoEvolucionesComponent.vue";
    import ReservarCamaComponent from "../../components/camas/ReservarCamaComponent.vue";
    import {
        mapActions
    } from "vuex"
    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can('blog.vista')) {
                return redirect('/');
            }
        },
        components: {
            AlergiaComponente,
            NotasEnfermeriaComponente,
            ReservarCamaComponent,
            HistoricoEvolucionesComponent,
            CamaSeleccionadaComponent
        },
        name: 'FrontHorusParametrizacion',
        data() {
            return {
                contadorCamas: null,
                camas: [],
                camaSeleccionada: null,
                afiliados: [],
                form: {
                    estado: '',
                    afiliado: ''
                },
                estados: [{
                        id: 1,
                        nombre: 'Disponible'
                    },
                    {
                        id: 64,
                        nombre: 'Ocupado'
                    },
                    {
                        id: 65,
                        nombre: 'Reservado'
                    },
                    {
                        id: 66,
                        nombre: 'Mantenimiento'
                    },
                ],
                dialogoReservar: false,
                datosReservar: null,
                tipoNovedad: null,
                dialogoBotones: false,
                info: null,
                componente: null,
                dialogoCama: false
            };
        },

        mounted() {
            this.listarCamas()
            this.contador()
        },

        methods: {
            ...mapActions('app', ['setPreload']),

            contador() {
                this.$axios.get("/cama/contadorObservacion")
                    .then((res) => {
                        this.contadorCamas = res.data;
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los tipos de documento"
                        );
                    })
                    .finally(() => {
                        // this.loading = false;
                    });
            },

            listarCamas() {
                this.setPreload(true)
                this.$axios.post("/cama/listarCamaCenso", this.form)
                    .then((res) => {
                        this.camas = res.data;
                        this.afiliados = res.data.filter(e => e.asignacion_cama[0]?.admision_urgencia?.consulta?.afiliado)
                            .map(e => {
                                const afiliado = e.asignacion_cama[0].admision_urgencia.consulta.afiliado;
                                return {
                                    numero_documento: afiliado.tipo_documento.sigla + '-' + afiliado
                                        .numero_documento + '-' + afiliado.nombre_completo,
                                    id: afiliado.id
                                };
                            });
                    })
                    .catch((error) => {
                        this.$toast.error(
                            "Ocurrió un error al cargar los tipos de documento"
                        );
                    })
                    .finally(() => {
                        this.setPreload(false)
                    });
            },

            getImage(cama) {
                // Si la cama está vacía, retorna la imagen para cama vacía
                if (cama.asignacion_cama.length === 0) {
                    return "/images/CAMA SOLA.svg";
                } else {

                    let edad = cama.asignacion_cama[0].admision_urgencia.consulta.afiliado.edad_cumplida;
                    let sexo = cama.asignacion_cama[0].admision_urgencia.consulta.afiliado.sexo;
                    if (edad < 18) {
                        return sexo === "F" ?
                            "/images/NINA.svg" :
                            "/images/NINO.svg";
                    } else {
                        return sexo === "F" ?
                            "/images/MUJER.svg" :
                            "/images/HOMBRE.svg";
                    }
                }
            },

            limparFormulario() {
                this.form.afiliado = ''
                this.form.estado = ''
                this.listarCamas()
            },

            novedadCama(cama, tipo) {
                this.tipoNovedad = tipo
                this.datosReservar = cama.id
                this.dialogoReservar = true
            },

            abrirModales(data, componente) {
                console.log('dd', data);

                this.componente = componente
                this.info = data
                this.dialogoBotones = true
            },

            verDetalles(cama) {
                if (cama.estado_id == 64) {
                    this.camaSeleccionada = cama
                    this.dialogoCama = true
                }

            },

             calcularDias(fechaInicio) {
                if (!fechaInicio) return 0;
                const inicio = new Date(fechaInicio);
                const hoy = new Date();
                return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
            }
        },
    };

</script>

<style lang="scss" scoped>
    .thermometer-up {
        margin-top: -5px;
    }

    .thermometer-up2 {
        margin-top: -5px;
    }

    .texto {
        margin-top: -90px;
    }

    .texto2 {
        margin-top: -40px;
    }

    .alpha {
        margin-top: -80px;
        color: rgb(3, 184, 216);
    }

    .camaPrincipal {
        margin-top: -1px;
        height: 140px;
        width: 220px;
        margin-right: 12px;
    }

    .solido {
        margin-top: -52px;
        text-align: center;
        height: 30px;
        width: 30px;
        border: 1px solid rgb(3, 184, 216);
        border-radius: 4px;
        margin-right: 140px;
    }

    .medicamento {
        margin-top: -30px;
        color: rgb(3, 184, 216);
        margin-right: 50px;
        background: transparent;
    }

    .ordenes {
        margin-top: 1px;
        margin-right: 90px;
        background: transparent;
    }

    .reservar {
        // margin-top: 1px;
        margin-left: -57px;
        background: transparent;
    }

    .liberar {
        margin-left: -20px;
        background: transparent;
    }

    .botonMantenimiento {
        // margin-top: -1px;
        margin-left: 1px;
    }

    .heart-container {
        position: relative;
        width: 37px;
        height: 30px;
        margin-top: 7px;
        margin-right: -6px;
    }

    .heart-text {
        position: absolute;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
        color: rgb(244, 251, 252);
        font-size: 0.8rem;
    }

    .ml-2 {
        margin-left: 8px;
    }

    .notas {
        margin-top: 12px;
        margin-right: 100px;
        background: transparent;
    }

    .ordenesVacio {
        margin-top: 1px;
        margin-right: 90px;
        background: transparent !important;
        border: none !important;
        box-shadow: none;
        text-transform: none;

    }

    .ordenesVacio:focus {
        outline: none;
    }

    .ordenesVacio:hover {
        background-color: transparent !important;
        cursor: pointer;
    }

    .toolbar-fijo {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }

    .alerta {
         margin-top: -80px;
        color: rgb(216, 99, 3);
    }



</style>
