<template>
    <div>
        <v-dialog fullscreen hide-overlay v-model="dialog" persistent>
            <v-card>
                <v-card flat tile>
                    <v-toolbar flat dense :class="{ 'ml-300': drawer, 'toolbar-fijo': true }">
                        <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="mr-2"></v-app-bar-nav-icon>

                        <v-toolbar-title class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="40" width="40"
                                class="mr-3 elevation-2 rounded-circle" />
                            <span class="text-h6 font-weight-bold">{{ datos.cita.nombre }}</span>
                        </v-toolbar-title>

                        <v-divider class="mx-4" inset vertical></v-divider>

                        <div>
                            <v-col cols="12">
                                <span class="text-subtitle-2 font-weight-medium grey--text">
                                    Paciente:
                                    {{
                                        `${datos.afiliado.primer_nombre || ''} ${datos.afiliado.segundo_nombre || ''}
                                    ${datos.afiliado.primer_apellido || ''} ${datos.afiliado.segundo_apellido ||
                                            ''}`.trim()
                                    }}
                                    - {{ datos.afiliado.numero_documento }}
                                </span>
                            </v-col>
                        </div>

                        <v-spacer></v-spacer>

                        <v-btn small color="primary" class="mx-2 animated-btn" rounded elevation="2"
                            @click="validarAntesDeOrdenamiento" :class="{ 'boton-palpito': todosLosCamposCompletos }">
                            Ordenamiento
                            <v-icon right>mdi-pill</v-icon>
                        </v-btn>

                        <v-btn small color="warning" class="mx-2 animated-btn" rounded elevation="2"
                            @click="guardarProgreso">
                            Guardar Progreso<v-icon right>mdi-progress-check</v-icon>
                        </v-btn>

                        <v-btn small color="success" class="mx-2 animated-btn" rounded elevation="2"
                            @click="finalizarHistoria">
                            Finalizar <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
                        </v-btn>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="error" v-bind="attrs" v-on="on" @click="cerrarDialogo"
                                    class="animated-icon">
                                    <v-icon>mdi-close-circle-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Salir sin finalizar</span>
                        </v-tooltip>
                    </v-toolbar>
                </v-card>


                <v-navigation-drawer app v-model="drawer" floating :right="$vuetify.rtl" width="260">
                    <v-container fluid class="pa-4">
                        <v-row dense justify="center" class="mb-4">
                            <v-col cols="3" v-for="(item, index) in iconosArriba" :key="'top-' + index"
                                class="d-flex justify-center">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon :color="item.color" v-on="on" @click="item.action"
                                            class="hover-icon elevation-3">
                                            <v-icon large>{{ item.icon }}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ item.label }}</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-divider class="my-2"></v-divider>
                        <v-row dense justify="center" class="mb-4">
                            <v-col cols="3" v-for="(item, index) in iconosAbajo" :key="'bottom-' + index"
                                class="d-flex justify-center">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn icon :color="item.color" v-on="on" @click="item.action"
                                            class="hover-icon elevation-3">
                                            <v-icon large>{{ item.icon }}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ item.label }}</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind="attrs" v-on="on" block color="deep-purple darken-1" dark
                                    @click="dialogEscalas = true">
                                    <v-icon left>mdi-clipboard-list</v-icon>
                                    Escalas
                                </v-btn>
                            </template>
                            <span>Haz clic para verificar que escala deseas realizar</span>
                        </v-tooltip>
                        <v-divider class="my-2"></v-divider>
                        <v-list dense nav>
                            <v-list-item v-for="(componente, index) in componentesHistoria" :key="index"
                                @click="scrollAlComponente(index)">
                                <v-list-item-icon>
                                    <v-chip small color="primary" dark>{{ index + 1 }}</v-chip>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ componente.nombre }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-container>
                </v-navigation-drawer>

                <v-main :class="{ 'pl-0': !drawer, 'pl-300': drawer }" style="margin-top: 0;">
                    <v-container fluid>
                        <div v-if="componentesHistoria.length === 0">
                            <v-alert text dense prominent icon="mdi-alert" color="error">Sin componentes asociados para
                                esta historia clinica, comuniquese con el área de soporte por favor</v-alert>
                        </div>
                        <component v-if="componentesHistoria.length > 0"
                            :is="componentesCargados[componentesHistoria[0].ruta]"
                            v-bind="propsDatos(componentesHistoria[0])" :resumen="resumen_historia"
                            ref="primerComponente" />

                        <div v-for="(componente, index) in componentesHistoria.slice(1)" :key="index"
                            :ref="`componentesCargadosRef-${index}`" class="component-container">
                            <component v-if="componentesVisibles[componente.ruta]"
                                :is="componentesCargados[componente.ruta]" v-bind="propsDatos(componente)"
                                :resumen="resumen_historia" :ref="`componente-${index}`" />
                        </div>
                    </v-container>
                </v-main>
            </v-card>
        </v-dialog>

        <v-dialog persistent max-width="1200" v-model="dialogoHistorico" v-if="dialogoHistorico">
            <component :is="comph" :datosCita="datos" @respuestaComponente="dialogoHistorico = false" />
        </v-dialog>

        <ordenamientoComponet ref="RefdialogoOrdenamientoComponente" :habilitarBoton="false"
            :consulta="parseInt(datos.id)">
        </ordenamientoComponet>

        <v-dialog v-model="dialogEscalas" max-width="500px" persistent>
            <v-card>
                <v-alert type="info" text dense border="bottom" class="mb-0">
                    <v-icon left class="mr-2">mdi-format-list-checks</v-icon>
                    <b>Seleccionar Escalas</b>
                </v-alert>

                <v-card-text class="pt-4">
                    <v-list dense>
                        <v-list-item v-for="(escala, index) in componentesEscala" :key="index" class="py-1">
                            <v-list-item-content>
                                <v-checkbox v-model="escalasSeleccionadas" :label="escala.nombre" :value="escala" dense
                                    hide-details color="primary" />
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                    <v-btn color="red darken-1" @click="dialogEscalas = false" dark>
                        <v-icon left small>mdi-close</v-icon>
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" @click="agregarEscalasSeleccionadas" dark>
                        <v-icon left small>mdi-check</v-icon>
                        Agregar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <consentimientoInformadoAnestesiaComponent ref="RefDialogoConsentimientoComponent" :consultaId="parseInt(datos.id)" :datos-usuario="datos.afiliado" />

        <!-- HorusVoice Card Fija -->
        <v-card v-if="dialog" class="horus-voice-card" elevation="8">
            <HorusVoice @audioProcessed="manejarAudioProcesado" />
        </v-card>

    </div>
</template>

<script>
import { mapActions } from "vuex";
import HistoricoMedicamentosComponentVue from "../historia/antecedentesHistoria/HistoricoMedicamentosComponent.vue";
import HistoricoConsultasComponentVue from "../historia/antecedentesHistoria/HistoricoConsultasComponent.vue";
import HistoricoAlertasComponentVue from "../historia/antecedentesHistoria/HistoricoAlertasComponent.vue";
import HistoricoServiciosComponentVue from "../historia/antecedentesHistoria/HistoricoServiciosComponent.vue";
import ordenamientoComponet from "~/components/ordenamiento/ordenamiento.vue";
import consentimientoInformadoAnestesiaComponent from "@/components/consentimientos/consentimientoInformadoAnestesiaComponent.vue";
import HorusVoice from '@/components/horus-voice/horus-voice-componente.vue';
export default {
    props: {
        datos: {
            type: Object,
            required: true
        },
    },
    components: {
        HistoricoMedicamentosComponentVue,
        HistoricoConsultasComponentVue,
        HistoricoAlertasComponentVue,
        HistoricoServiciosComponentVue,
        ordenamientoComponet,
        consentimientoInformadoAnestesiaComponent,
        HorusVoice
    },
    data() {
        return {
            componentesHistoria: [],
            componentesCargados: {},
            componentesVisibles: {},
            observers: [],
            drawer: false,
            dialog: false,
            resumen_historia: {},
            dialogoHistorico: false,
            todosLosCamposCompletos: false,
            iconosArriba: [
                { label: "Historial Consultas", icon: "mdi-doctor", color: "warning", action: this.historicoConsultas },
                { label: "Historial Alergias", icon: "mdi-alarm-light-off", color: "red", action: this.historicoAlertas },
                { label: "Historial Servicios", icon: "mdi-file-document-check", color: "success", action: this.historicoServicios },
                { label: "Historial Medicamentos", icon: "mdi-pill-multiple", color: "blue", action: this.historicoMedicamentos }
            ],
            iconosAbajo: [
                { label: "Prodiagnóstico", icon: "mdi-file-powerpoint-box", color: "blue", action: this.resultadoProdiagnostico },
                { label: "Dinámica", icon: "mdi-disqus", color: "green", action: this.enlaseDinamica },
                { label: "San Marcos de León", icon: "mdi-hospital-building", color: "green", action: this.enlaceSanMarcosLeon },
                { label: "SYNLAB", icon: "mdi-hospital-building", color: "blue", action: this.enlaceSynlab }
            ],
            dialogEscalas: false,
            componentesEscala: [],
            escalasSeleccionadas: []
        };
    },
    mounted() {
        this.listarComponentesHistoria();
        this.listarEscala();
    },
    updated() {
        this.$nextTick(() => {
            this.iniciarObservacionComponentes();
        });
    },
    beforeDestroy() {
        this.desconectarObserver();
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        ...mapActions('historiaClinica', ['guardarDatosComponente', 'enviarHistoriaClinica', 'limpiarHistoriaClinica']),

        async guardarProgreso() {
            const datosHistoria = {};
            const referenciasComponentes = [];

            // Mapear modelo → componenteHistoria completo
            const modeloComponenteMap = this.componentesHistoria.reduce((map, comp) => {
                map[comp.modelo] = comp;
                return map;
            }, {});

            // Agregar el primer componente
            if (this.$refs.primerComponente) {
                const primerModelo = this.componentesHistoria[0]?.modelo;
                const primerRuta = this.componentesHistoria[0]?.ruta;
                referenciasComponentes.push({
                    ref: this.$refs.primerComponente,
                    modelo: primerModelo,
                    ruta: primerRuta
                });
            }

            // Agregar los componentes del v-for
            this.componentesHistoria.slice(1).forEach((componente, index) => {
                const refKey = `componente-${index}`;
                const ref = this.$refs[refKey];

                if (Array.isArray(ref)) {
                    ref.forEach(subRef => {
                        referenciasComponentes.push({
                            ref: subRef,
                            modelo: componente.modelo,
                            ruta: componente.ruta
                        });
                    });
                } else if (ref) {
                    referenciasComponentes.push({
                        ref,
                        modelo: componente.modelo,
                        ruta: componente.ruta
                    });
                }
            });

            if (referenciasComponentes.length === 0) {
                console.error("No hay componentes cargados en this.$refs.");
                return;
            }

            referenciasComponentes.forEach(({ ref, modelo, ruta }) => {
                if (ref && typeof ref.obtenerDatos === "function") {
                    const { datos } = ref.obtenerDatos();

                    if (!modelo || !ruta) {
                        console.warn("Componente sin modelo o ruta definida.");
                        return;
                    }

                    this.guardarDatosComponente({
                        consulta_id: this.datos.id,
                        modelo,
                        ruta,
                        datos
                    });
                }
            });
            this.$toast.success('Progreso guardado con éxito');

        },

        async guardarHistoriaClinica() {
            try {
                await this.enviarHistoriaClinica(this.datos?.id);
                this.$toast.success('Historia clínica guardada con éxito');
            } catch (error) {
                this.$toast.error('Error al guardar la historia clínica');
                throw error;
            }
        },
        listarComponentesHistoria() {
            this.setPreload(true);
            this.$axios.get("tipo-historia/listar-componentes-tipo-historia/" + this.datos?.cita?.tipo_historia_id).then((res) => {
                this.componentesHistoria = res.data.filter(componente => {
                    const sexoAfiliado = this.datos?.afiliado?.sexo;
                    const edadAfiliado = this.datos?.afiliado?.edad_cumplida;

                    const sexoValido = !componente.sexo || componente.sexo === 'A' || componente.sexo === sexoAfiliado;

                    const edadValida = (
                        (componente.edad_inicial == null || componente.edad_inicial === '') &&
                        (componente.edad_final == null || componente.edad_final === '')
                    ) || (
                            edadAfiliado >= componente.edad_inicial && edadAfiliado <= componente.edad_final
                        );

                    return sexoValido && edadValida;
                });

                if (this.componentesHistoria.length === 0) {
                    return;
                }

                // Inicializar visibilidad: solo el primero visible
                this.componentesHistoria.forEach((componente, index) => {
                    this.$set(this.componentesVisibles, componente.ruta, index === 0);
                });

                this.cargarComponentesDinamicamente();
            }).catch((error) => {
                console.error(error);
                this.$toast.error("Error al cargar componentes");
            }).finally(() => {
                this.setPreload(false);
            });
        },

        cargarComponentesDinamicamente() {
            this.setPreload(true);

            this.componentesHistoria.forEach(async (componente) => {
                if (!this.componentesCargados[componente.ruta]) {
                    try {
                        const mod = await import(`@/components/${componente.ruta}.vue`);
                        this.$set(this.componentesCargados, componente.ruta, mod.default);
                    } catch (error) {
                        console.error(`Error al cargar el componente ${componente.ruta}:`, error);
                        this.$toast.error(`No se pudo cargar el componente ${componente.ruta}`);
                    }
                }
            });

            this.setPreload(false);
        },
        iniciarObservacionComponentes() {
            this.desconectarObserver();
            this.componentesHistoria.slice(1).forEach((componente, index) => {
                const refComponente = `componentesCargadosRef-${index}`;
                const elementos = this.$refs[refComponente];
                if (elementos && elementos.length > 0) {
                    const elemento = elementos[0];
                    const observador = new IntersectionObserver(
                        entradas => {
                            const entrada = entradas[0];
                            if (entrada.isIntersecting) {
                                // Marcar el componente como visible
                                this.$set(this.componentesVisibles, componente.ruta, true);
                                // Dejar de observar este elemento
                                observador.unobserve(elemento);
                            }
                        }, {
                        threshold: 0.05,
                        rootMargin: '100px 0px'
                    }
                    );

                    observador.observe(elemento);
                    this.observers.push(observador);
                }
            });
        },
        desconectarObserver() {
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            this.observers = [];
        },
        async abrirDialog() {
            this.dialog = true;
            const resumen = await this.$axios.get("historia/registro/" + this.datos.id + "/" + this.datos
                .afiliado_id);
            this.resumen_historia = resumen.data;
        },
        propsDatos(componente) {
            if (componente.ruta === "afiliado/FormularioAfiliadoComponente") {
                return {
                    consulta: this.datos,
                    afiliado: this.datos.afiliado,
                    modoEdicion: true,
                    modoDetalle: true,
                    mostrarClasificaciones: true,
                    afiliadoHistoriaClinica: true
                };
            } else {
                return {
                    datos: this.datos
                };
            }
        },
        cerrarDialogo() {
            return this.$swal({
                title: "¿Está Seguro?",
                text: "La historia aún no ha finalizado ¿Está seguro de salir sin finalizarla?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.value) {
                    this.dialog = false;
                    this.guardarProgreso();
                    this.$emit('cerrar');
                    this.componentesHistoria = [];
                    this.componentesCargados = {};
                    this.componentesVisibles = {};
                    this.desconectarObserver();
                }
            })
        },

        scrollAlComponente(index) {
            const refComponente = `componentesCargadosRef-${index - 1}`;
            const componente = this.componentesHistoria[index];
            this.$set(this.componentesVisibles, componente.ruta, true);
            this.$nextTick(() => {
                const elementos = this.$refs[refComponente];
                if (elementos && elementos.length > 0) {
                    const elemento = elementos[0];
                    elemento.scrollIntoView({
                        behavior: 'instant',
                        block: 'center'
                    });
                }
            });
        },

        historicoConsultas() {
            this.dialogoHistorico = true;
            this.comph = "HistoricoConsultasComponentVue";
        },

        historicoAlertas() {
            this.dialogoHistorico = true;
            this.comph = "HistoricoAlertasComponentVue";
        },

        historicoServicios() {
            this.dialogoHistorico = true;
            this.comph = "HistoricoServiciosComponentVue";
        },

        historicoMedicamentos() {
            this.dialogoHistorico = true;
            this.comph = "HistoricoMedicamentosComponentVue";
        },

        resultadoProdiagnostico() {
            window.open("https://prodiagnostico.hiruko.com.co/login", "ventana1",
                "width=800,height=800,scrollbars=NO");
        },

        enlaseDinamica() {
            window.open("http://192.168.0.30:8887", "ventana1", "width=800,height=800,scrollbars=NO");
        },
        enlaceSanMarcosLeon() {
            window.open("http://200.122.220.78:9098/resultados/CResultados?accion=inicioHome#nbb", "ventana1",
                "width=800,height=800,scrollbars=NO");
        },

        enlaceSynlab() {
            window.open("https://webapps.synlab.co/_resultados/view/formLogin.php", "ventana1",
                "width=800,height=800,scrollbars=NO");
        },

        async finalizarHistoria() {
            if (!this.todosLosCamposCompletos) {
                const validado = await this.validarTodosLosComponentes();
                if (!validado) return;

                
                if(parseInt(this.datos.cita.especialidad.id) === 14){
                    const resultado = await this.$swal({
                        title: 'Firmar consentimiento informado',
                        text: 'Es obligatorio firmar el consentimiento informado de anestesia para finalizar la historia clínica.',
                        type: 'info',
                        confirmButtonText: 'Entendido',
                    });
                    
                    if (resultado.value) {
                        this.modalConsentimiento();
                        await new Promise(resolve => {
                            const unwatch = this.$watch('$refs.RefDialogoConsentimientoComponent.mostrarModalConsentimiento', 
                                (newVal) => {
                                    if (!newVal) {
                                        unwatch();
                                        resolve();
                                    }
                                }
                            );
                        });
                    } else {
                        return;
                    }
                }

                const result = await this.$swal({
                    title: '¿Deseas ordenar o finalizar la historia?',
                    text: 'Todos los campos están diligenciados.',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Ordenar',
                    cancelButtonText: 'Finalizar',
                });
                if (result.value) {
                    this.abrirDialogoOrdenamiento();
                } else if (result.dismiss === this.$swal.DismissReason.cancel) {
                    try {
                        this.setPreload(true);
                        await this.guardarProgreso();
                        await this.guardarHistoriaClinica(true);
                        await this.limpiarHistoriaClinica(this.datos?.id);
                        this.$toast.success('Historia finalizada correctamente');
                        this.dialog = false;
                        this.$emit('cerrar');
                    } catch (error) {
                        console.error('Error al finalizar historia:', error);
                        this.$toast.error('Error al finalizar la historia');
                    } finally {
                        this.setPreload(false);
                    }
                }

                return;
            }

            try {
                const validar = await this.validarTodosLosComponentes();
                if (!validar) return;
                this.setPreload(true);
                await this.guardarProgreso();
                await this.guardarHistoriaClinica(true);
                await this.limpiarHistoriaClinica(this.datos?.id);
                this.$toast.success('Historia finalizada correctamente');
                this.dialog = false;
                this.$emit('cerrar');
            } catch (error) {
                console.error('Error al finalizar historia:', error);
                this.$toast.error('Error al finalizar la historia');
            } finally {
                this.setPreload(false);
            }
        },


        async validarAntesDeOrdenamiento() {
            if (this.todosLosCamposCompletos) {
                this.abrirDialogoOrdenamiento();
                return;
            }

            const validado = await this.validarTodosLosComponentes();
            if (!validado) return;

            this.$toast.success("Todos los campos están diligenciados. Abriendo ordenamiento...");
            this.abrirDialogoOrdenamiento();
        },

        async validarTodosLosComponentes() {
            // Validar primer componente
            if (
                this.$refs.primerComponente &&
                typeof this.$refs.primerComponente.validarErrores === "function"
            ) {
                const esValido = this.$refs.primerComponente.validarErrores();
                if (!esValido) {
                    this.$refs.primerComponente.$el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                    this.$toast.error('Hay campos obligatorios sin diligenciar en el primer componente');
                    return false;
                }
            }

            // Validar los demás componentes
            for (let i = 0; i < this.componentesHistoria.slice(1).length; i++) {
                const refKey = `componente-${i}`;
                const componente = this.componentesHistoria[i + 1];

                if (!this.componentesVisibles[componente.ruta]) {
                    this.$set(this.componentesVisibles, componente.ruta, true);
                    await this.$nextTick();
                }

                if (this.$refs[refKey]) {
                    const componenteRef = Array.isArray(this.$refs[refKey])
                        ? this.$refs[refKey][0]
                        : this.$refs[refKey];

                    if (
                        componenteRef &&
                        typeof componenteRef.validarErrores === "function"
                    ) {
                        const esValido = componenteRef.validarErrores();
                        if (!esValido) {
                            const contenedorRef = this.$refs[`componentesCargadosRef-${i}`];
                            if (contenedorRef && contenedorRef.length > 0) {
                                contenedorRef[0].scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });
                            }
                            this.$toast.error(`Hay campos obligatorios sin diligenciar en ${componente.nombre}`);
                            return false;
                        }
                    }
                }
            }

            this.todosLosCamposCompletos = true;
            return true;
        },

        abrirDialogoOrdenamiento() {
            this.$refs.RefdialogoOrdenamientoComponente.abrirDialogo()
        },

        listarEscala() {
            this.$axios.get('componentes-historia-clinica/listar-componentes-escalas').then((res) => {
                this.componentesEscala = res.data;
            }).catch((error) => {
                console.error(error);
            })
        },

        agregarEscalasSeleccionadas() {
            this.escalasSeleccionadas.forEach((escala) => {
                const yaExiste = this.componentesHistoria.some(
                    (c) => c.ruta === escala.ruta
                );

                if (!yaExiste) {
                    this.componentesHistoria.push(escala);
                    this.$set(this.componentesVisibles, escala.ruta, true);
                }
            });

            this.dialogEscalas = false;
            this.escalasSeleccionadas = [];

            // Cargar dinámicamente los nuevos
            this.cargarComponentesDinamicamente();
        },

        modalConsentimiento() {
            this.$refs.RefDialogoConsentimientoComponent.abrirModal();
        },

        manejarAudioProcesado(respuesta) {
            console.log('Audio procesado recibido:', respuesta);
            
            try {
                const { text, json } = respuesta;
                
                if (json) {
                    // Parsear el JSON si viene como string
                    let datosClinica;
                    try {
                        datosClinica = typeof json === 'string' ? JSON.parse(json) : json;
                    } catch (parseError) {
                        console.error('Error parseando JSON:', parseError);
                        this.$toast.error('Error en el formato de los datos recibidos');
                        return;
                    }
                    
                    this.$toast.success('Audio procesado correctamente');
                    
                    this.llenarHistoriaConDatos(datosClinica);
                    
                    console.log('Datos estructurados:', datosClinica);
                    console.log('Transcripción:', text);
                } else {
                    console.log('Solo transcripción disponible:', text);
                    this.$toast.warning('Audio procesado pero sin datos estructurados');
                }
                
            } catch (error) {
                console.error('Error procesando respuesta de audio:', error);
                this.$toast.error('Error al procesar los datos del audio');
            }
        },

        llenarHistoriaConDatos(datos) {
            console.log('Llenando historia con datos:', datos);
            
            try {
                let componentesLlenados = 0;
                
                // Llenar el componente de Motivo de Consulta (primer componente)
                if (this.$refs.primerComponente) {
                    if (typeof this.$refs.primerComponente.llenarConDatos === 'function') {
                        this.$refs.primerComponente.llenarConDatos(datos);
                        componentesLlenados++;
                        console.log('Datos aplicados al primer componente (MotivoConsulta)');
                    } else {
                        console.warn('El primer componente no tiene el método llenarConDatos');
                    }
                } else {
                    console.warn('No se encontró referencia al primer componente');
                }
                
                // Buscar y llenar otros componentes específicos
                this.componentesHistoria.forEach((componente, index) => {
                    // Para el primer componente, usar primerComponente
                    if (index === 0) {
                        return; // Ya se procesó arriba
                    }
                    
                    // Para los demás componentes, usar componente-{index-1}
                    const refKey = `componente-${index - 1}`;
                    const ref = this.$refs[refKey];
                    
                    console.log(`Buscando componente en ref: ${refKey}, componente: ${componente.ruta}`);
                    
                    if (Array.isArray(ref) && ref.length > 0) {
                        const componenteRef = ref[0];
                        console.log(`Componente encontrado (array): ${componente.ruta}`, componenteRef);
                        if (componenteRef && typeof componenteRef.llenarConDatos === 'function') {
                            componenteRef.llenarConDatos(datos);
                            componentesLlenados++;
                            console.log(`Datos aplicados al componente: ${componente.ruta}`);
                        } else {
                            console.log(`Componente ${componente.ruta} no tiene método llenarConDatos`);
                        }
                    } else if (ref && typeof ref.llenarConDatos === 'function') {
                        console.log(`Componente encontrado (objeto): ${componente.ruta}`, ref);
                        ref.llenarConDatos(datos);
                        componentesLlenados++;
                        console.log(`Datos aplicados al componente: ${componente.ruta}`);
                    } else {
                        console.log(`No se encontró referencia para: ${refKey}, componente: ${componente.ruta}`);
                    }
                });
                
                if (componentesLlenados > 0) {
                    console.log(`Datos aplicados a ${componentesLlenados} componente(s)`);
                    this.$toast.success(`Historia actualizada en ${componentesLlenados} sección(es)`);
                } else {
                    console.warn('No se pudo aplicar datos a ningún componente');
                    this.$toast.warning('No se encontraron componentes compatibles para llenar');
                }
                
            } catch (error) {
                console.error('Error aplicando datos a los componentes:', error);
                this.$toast.error('Error al aplicar los datos a la historia clínica');
            }
        }
    },

};

</script>

<style scoped>
.pl-0 {
    padding-left: 0 !important;
}

.pl-300 {
    padding-left: 300px !important;
}

.ml-300 {
    margin-left: 300px;
    transition: margin-left 0.3s ease;
}

.toolbar-fijo {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.component-container {
    width: 100%;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.07);
    }
}

.boton-palpito {
    animation: pulse 1.4s infinite;
    transition: transform 0.3s ease-in-out;
}

.hover-icon {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-icon:hover {
    transform: scale(1.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.horus-voice-card {
    position: fixed !important;
    bottom: 20px;
    right: 20px;
    z-index: 1050;
    width: 280px;
    border-radius: 12px !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transition: all 0.3s ease;
}

.horus-voice-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
</style>
