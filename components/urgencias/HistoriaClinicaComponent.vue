<template>
    <div>
        <v-card>
            <v-alert dense text color="blue" class="text-center">
                <b>Historia</b></v-alert>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" md="2" sm="3">
                        <!-- panel lateral fijo -->
                        <v-card>
                            <v-navigation-drawer v-model="drawer" permanent>


                                <v-stepper vertical v-model="step">

                                    <v-stepper-step v-for="(item, index) in elementos" :key="index" :step="item.id"
                                        @click="scrollAComponente(item.componente)">
                                        <a style="text-decoration: none" href="javascript:void(0);">{{
													item.nombre }}</a>
                                    </v-stepper-step>
                                </v-stepper>
                            </v-navigation-drawer>
                        </v-card>

                    </v-col>

                    <!-- componentes fijos de la historia -->
                    <v-col style="margin-top: 1%" :cols="drawer ? 10 : 12" :md="drawer ? 10 : 12" :sm="drawer ? 9 : 12">

                        <v-responsive style="margin-left: 40px;">
                            <v-container fluid>
                                <div v-for="(item, index) in elementos" :key="item.id">
                                    <div :id="item.componente">
                                        <component v-if="item.visible" :is="item.componente"
                                            :actualizarDatosAfiliado="true" :datos="item.datos"
                                            :consulta="item.consulta" :resumen="resumen_historia" :ref="item.componente"
                                            :key="index"></component>
                                        <div v-else>
                                            Cargando {{ item.nombre }}...
                                        </div>
                                    </div>
                                </div>
                            </v-container>
                        </v-responsive>
                    </v-col>
                </v-row>
            </v-container>


        </v-card>
    </div>
</template>
<script>
import afiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import triage from "~/components/historia/formularios/Triage.vue"
import ExamenFisicoTriage from "~/components/historia/formularios/ExamenFisicoTriage.vue"
import MotivoComponent from "~/components/historia/formularios/MotivoConsulta.vue";
import AntecedentesQuirurgicosComponent from "~/components/historia/antecedentesHistoria/AntecedentesQuirurgicosComponent.vue";
import AntecedentesPersonalesComponent from "~/components/historia/antecedentesHistoria/AntecedentesPersonalesComponent.vue";
import AntecedentesFamiliaresComponent from "~/components/historia/antecedentesHistoria/AntecedentesFamiliaresComponent.vue";
import RevisionSistemasComponent from "~/components/historia/formularios/RevisionSistemas.vue";
import ExamenFisicoComponent from "~/components/historia/formularios/ExamenFisico.vue";
import ImpresionDxComponent from "~/components/historia/diagnosticos/diagnosticos.vue";
import PlanManejoComponent from "~/components/historia/formularios/PlanManejo.vue";
    import {
        mapActions
    } from "vuex";

    export default {
        props: {
            datos: Object,
        },
        name: 'triages',
        components: {
			afiliadoComponente,
			ExamenFisicoTriage,
			triage,
            MotivoComponent,
            AntecedentesQuirurgicosComponent,
            AntecedentesPersonalesComponent,
            AntecedentesFamiliaresComponent,
            RevisionSistemasComponent,
            ExamenFisicoComponent,
            ImpresionDxComponent,
            PlanManejoComponent
		},
        data() {
            return {
                resumen_historia: {},
                dialog: false,
                step: 1,
                elementos: [],
                tituloHistoria: null,
                hover: false,
                drawer: true,
                datosC: {}
            }
        },
        mounted() {
            this.listarConsulta()
        },

        watch: {
        },

        methods: {
            ...mapActions('app', ['setPreload']),
            listarConsulta() {
                this.$axios.post('consultas/obtenerConsultaTriage', {
                    consulta_id: this.datos.admision_urgencia.consulta.id
                }).then(res => {
                    // this.preload = false
                    this.datosC = res.data
                    this.historia()
                }).catch(e => {
                    console.log(e);
                    // this.preload = false
                })
            },

            iniciarObservador() {
				//utilizamos la api IntersectionObserver para detectar que elementos del dom entran a la vista en pantalla
				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								const id = entry.target.id;
								const elemento = this.elementos.find((el) => el.componente === id);
								if (elemento && !elemento.visible) {
									// Solo cambiamos a visible si no lo estaba previamente
									elemento.visible = true;
								}
							}
						});
					}, {
						threshold: 0.05,
					}
				);
				//Usamos el nextick para que la operacion se realice luego de vue haya renderizado el dom y obtenemos cada elemento Dom mediante getElementById, si el elemento existe utilizamos el observe
				this.$nextTick(() => {
					this.elementos.forEach((item) => {
						const elemento = document.getElementById(item.componente);
						if (elemento) {
							observer.observe(elemento);
						}
					});
				});
			},

            scrollAComponente(id) {
                // nos aseguramos que el componente esté visible y luego nos desplazamos a él
                const elemento = this.elementos.find((el) => el.componente === id);
                if (elemento) {
                    elemento.visible = true; // Activo el componente en caso de que no esté visible

                    // Uso $nextTick para esperar hasta que Vue termine de renderizar el componente
                    this.$nextTick(() => {
                        const targetElement = document.getElementById(id);
                        if (targetElement) {
                            //Uso el scrollIntoView para que se realice el desplazamiento hasta el componente especificado
                            targetElement.scrollIntoView({
                                behavior: 'auto',
                                block: 'start'
                            });
                        }
                    });
                }
            },

            async historia() {
                // this.setPreload(true);

                const resumen = await this.$axios.get(
                    "historia/registro/" + this.datosC.id + "/" + this.datosC.afiliado_id
                );
                this.resumen_historia = resumen.data;
                // this.dialog = true;
                // Inicializamos el arreglo de elementos
                this.elementos = [];
                this.elementos = [{
                        id: 1,
                        nombre: "Datos Paciente",
                        componente: "afiliadoComponente",
                        consulta: this.datosC,
                        datos: this.datosC.afiliado,
                        visible: true
                    },
                    {
                        id: 2,
                        nombre: "Triage",
                        componente: "triage",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 3,
                        nombre: "Motivo Consulta",
                        componente: "MotivoComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 4,
                        nombre: "Antecedentes Familiares",
                        componente: "AntecedentesFamiliaresComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 5,
                        nombre: "Antecedentes personales",
                        componente: "AntecedentesPersonalesComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 6,
                        nombre: "Antecedentes Quirugicos",
                        componente: "AntecedentesQuirurgicosComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 7,
                        nombre: "Revisión Sistemas",
                        componente: "RevisionSistemasComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 8,
                        nombre: "Exámen Fisico",
                        componente: "ExamenFisicoComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 9,
                        nombre: "Diagnostico de la Consulta",
                        componente: "ImpresionDxComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    {
                        id: 10,
                        nombre: "Plan de Manejo",
                        componente: "PlanManejoComponent",
                        datos: this.datosC,
                        visible: false
                    },
                    // {
                    //   id: 9,
                    //   nombre: "Plan de tratamiento",
                    //   componente: "planTratamientoComponent",
                    //   datos: this.datos,
                    //   afiliado: this.datos.afiliado,
                    //   visible: false
                    // },

                ];
                    this.iniciarObservador()
            }
        }
    }

</script>

<style>
	#contenedor {
		margin: 1px auto;
		width: 260px;
		height: 20px;
	}

	.reloj {
		float: left;
		font-size: 30px;
		font-family: Courier, sans-serif;
		color: #000000;
	}

	.fixed-card {
		position: fixed;
		top: 0px;
		right: 0px;
		width: 100%;
		z-index: 1000;
	}

	.hora-flotante {
		position: fixed;
		bottom: 0;
		right: 0;
		margin: 10px;
	}

	.toolbar-fijo {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
	}

	.fixed-nav-icon {
		position: fixed;
		top: 75;
		/* Ajusta la distancia desde el borde superior de la ventana */
		left: 260px;
		/* Ajusta la distancia desde el borde izquierdo de la ventana */
		z-index: 1000;
		/* Asegúrate de que esté por encima de otros elementos */
	}

	.hover-blue {
		color: blue !important;
	}

</style>
