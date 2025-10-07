<template>
	<div>
		<v-card elevation="0">
			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px" :rules="[rules.obligatorio]" />
							<span>CARACTERIZAR UN AFILIADO</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
			<v-card-text>
				<v-form ref="formBuscarAfiliado" v-show="data === null">
					<v-row class="mt-4">
						<v-col cols="12" md="4">
							<v-autocomplete dense outlined label="Tipo de Documento" :items="tiposDocumentos"
								:loading="loading.tiposDocumentos" no-data-text="No hay resultados" item-value="id"
								item-text="nombre" v-model="datosBuscarAfiliado.tipo_documento"
								:rules="[rules.obligatorio]" />
						</v-col>
						<v-col cols="12" md="4">
							<v-text-field dense outlined label="Número Documento"
								v-model.trim="datosBuscarAfiliado.numero_documento" @keyup.enter="manejarCaracterizacionAfiliado"
								:rules="[rules.obligatorio]" />
						</v-col>
						<v-col cols="12" md="4" class="d-flex gap-2">
							<v-btn color="primary" dark @click="manejarCaracterizacionAfiliado">Consultar <v-icon right>mdi-magnify
								</v-icon>
							</v-btn>
							<v-btn color="red" dark @click="limpiarAfiliado">Limpiar <v-icon right>mdi-close</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-form>

				<v-row v-if="data !== null">
					<v-card-text>
						<!-- Barra de Progreso -->
						<div class="progress-container">
							<div class="progress-bar" :style="{ width: progreso + '%' }"></div>
						</div>
						<p>Progreso: {{ progreso }}%</p>
					</v-card-text>
					<v-container>
						<v-col cols="12" class="d-flex justify-end">
							<v-btn color="primary" dark dense @click="scrollToBottom">
								Bajar <v-icon right>mdi-arrow-down</v-icon>
							</v-btn>
						</v-col>
					</v-container>
					<v-col align-self="center" cols="12">

						<!-- Renderizado Condicional de los Stans -->
						<component :is="stans[stanActual]" @guardar="guardarDatos"
							@siguiente="siguienteStan" @anterior="stanActual--" @completado="marcarStanCompletado" />

						<!-- Botones de Navegación -->
						<v-col cols="12" class="d-flex justify-start">
							<v-btn color="success" dark dense v-if="stanActual < stans.length - 1"
								@click="siguienteStan" :disabled="!stansCompletados[stanActual]" >
								Siguiente<v-icon right>mdi-arrow-right</v-icon>
							</v-btn>
						</v-col>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	import InformacionGeneral from "~/components/caracterizacion/informacionGeneralComponent.vue";
	import DatosGenerales from "~/components/caracterizacion/datosGeneralesComponent.vue";
	import EncuestaPsicosocial from "~/components/caracterizacion/encuestaPsicosocialComponent.vue";
	import Vivienda from "~/components/caracterizacion/viviendaComponent.vue";

	import { mapState, mapMutations, mapActions } from "vuex";


	export default {
		components: {
			InformacionGeneral,
			DatosGenerales,
			EncuestaPsicosocial,
			Vivienda
		},

		data() {
			return {
				encuesta: null,
				stanActual: 0,
				stans: [
					"InformacionGeneral",
					"DatosGenerales",
					"EncuestaPsicosocial",
					"Vivienda"
				],
				stansCompletados: Array(4).fill(false),
				datosBuscarAfiliado: {
					numero_documento: null,
					tipo_documento: null,
				},
				tiposDocumentos: [],
				loading: {
					tipo_documento: false,
				},
				preload: false,
				intentoBuscar: false,
				afiliado_id: null,
				rules: {
					obligatorio: v => !!v || 'Este campo es obligatorio',
				},
			};
		},
		computed: {
			...mapState("encuesta", ["afiliado", "data"]),
			progreso() {
				const completados = this.stansCompletados.filter(c => c).length;
				return (completados / this.stans.length) * 100;
			},
			todosStansCompletados() {
				return !this.stansCompletados.includes(false);
			},
		},

		created() {
			this.stansCompletados = new Array(this.stans.length).fill(false);
			this.listarTiposDocumentos();
		},
		methods: {
			...mapMutations("encuesta", ["setEncuesta", "setAfiliado"]),
			...mapActions("encuesta", ["guardarDatos", "enviarFormulario"]),
       		...mapActions("app", ["setPreload"]),

            verificarSiTodosCompletados() {
				if (!this.stansCompletados.includes(false)) {
				}
			},

            marcarStanCompletado({ stan, completo }) {
                const index = this.stans.indexOf(stan);
                if (index !== -1) {
                    this.$set(this.stansCompletados, index, completo);
                    this.verificarSiTodosCompletados();
                }
            },

            verificarSiTodosCompletados() {
                const todosCompletos = this.stansCompletados.every(estado => estado === true);

                if (todosCompletos) {
                    this.enviarFormularioFinal();
                }
            },

			listarTiposDocumentos() {
				this.loading.tipo_documento = true;
				this.$axios
					.get("/tipo-documento/listar")
					.then((res) => {
						this.tiposDocumentos = res.data;
					})
					.catch((error) => {
						this.$toast.error(
							"Ocurrió un error al cargar los tipos de documento"
						);
					})
					.finally(() => {
						this.loading.tipo_documento = false;
					});
			},

			scrollToBottom() {
				this.$nextTick(() => {
					window.scrollTo({
						top: document.body.scrollHeight,
						behavior: "smooth",
					});
				});
			},

            crearCaracterizacionCotizante($afiliado_id){
                this.$axios
                    .post(`/caracterizacion/crear-encuesta-id/${$afiliado_id}`)
                    .then((res) => {
                        if (res.data) {
                            this.setEncuesta(res.data[0]);
                        } else {
                            this.$toast.error("No se encontró caracterización del afiliado.");
                        }
                    })
                    .catch((error) => {
                        this.$toast.error("Afiliado no existe.");
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            },

            consultarCaracterizacion($afiliado_id) {
                return this.$axios
                    .get(`/caracterizacion/obtener-caracterizacion-por-afiliado/${$afiliado_id}`)
                    .then((res) => {
                        if (res.data) {
                            this.setEncuesta(res.data);
                            return res.data;
                        } else {
                            throw new Error("No se encontró caracterización del afiliado.");
                        }
                    });
            },

            async consultarCaracterizacionCotizante(numeroDoc) {
                try {
                    const res = await this.$axios.post(`/afiliados/consultar-afiliado-documento/${numeroDoc}`);

                    if (res.data) {
                        this.setAfiliado(res.data);

                        try {
                            await this.consultarCaracterizacion(res.data.id);
                        } catch (error) {
                            throw new Error("No se encontró la caracterización del cotizante.");
                        }
                    } else {
                        throw new Error("No se encontró información del cotizante.");
                    }
                } catch (error) {
                    throw error;
                }
            },

            async consultarBeneficiarios(documento_afiliado) {
                try {
                    const res = await this.$axios.post(`/afiliados/listar-beneficiarios-por-doc/${documento_afiliado}`);
                    return res.data;
                } catch (error) {
                    this.$toast.error("El afiliado no tiene beneficiarios.");
                    return [];
                }
            },

            crearCaracterizacionBeneficiarios(beneficiarios) {
                let peticiones = beneficiarios.map(beneficiario => {
                    return this.$axios.post(`/caracterizacion/crear-encuesta-id/${beneficiario.id}`)
                        .then((res) => {
                            if (res.data) {
                            } else {
                                this.$toast.error(`No se pudo crear caracterización para ${beneficiario.numero_documento}`);
                            }
                        })
                        .catch((error) => {
                            this.$toast.error(`Error al crear caracterización para ${beneficiario.numero_documento}`);
                        });
                });

                Promise.all(peticiones)
                    .finally(() => {
                        this.$toast.success("Caracterización creada para todos los beneficiarios.");
                    });
            },

            //Maneja la caracterización del afiliado
            async manejarCaracterizacionAfiliado() {
                if (!this.datosBuscarAfiliado.numero_documento || !this.datosBuscarAfiliado.tipo_documento) {
                    return this.$toast.error("Ingrese todos los datos.");
                }
                try {
                    this.setPreload(true);

                    // Consultar afiliado
                    let afiliadoResponse = await this.$axios.get(`/afiliados/listarActivos/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`);

                    this.setAfiliado(afiliadoResponse.data);

                    //verifico si es cotizante, si el campo 'numero_documento_cotizante' es igual a null -> ES COTIZANTE
                    if(this.afiliado.numero_documento_cotizante === null){
                        // Si el afiliado es cotizante, consulto su caracterización
                        try {
                            await this.consultarCaracterizacion(this.afiliado.id);
                        } catch (error) {
                            // Si no existe la caracterización, se crea una nueva
                            await this.crearCaracterizacionCotizante(this.afiliado.id);

                            // Consultar beneficiarios del afiliado
                            let beneficiarios = await this.consultarBeneficiarios(this.afiliado.numero_documento);
                            // Si hay beneficiarios, crear caracterización para cada uno
                            if (beneficiarios.length > 0) {
                                await this.crearCaracterizacionBeneficiarios(beneficiarios);
                            }
                        }
                    }
                    //Caso de ser beneficiario
                    else if(this.afiliado.numero_documento_cotizante.length > 0){
                        try {
                            //consulto la caracterización de su cotizante
                            await this.consultarCaracterizacionCotizante(this.afiliado.numero_documento_cotizante);
                        } catch (error) {
                            // Si no existe la caracterización, se muestra una alerta con el numero de documento de su cotizante

                            this.$swal.fire({
                                type: "warning",
                                title: "Afiliado Beneficiario",
                                html: `No exíste caracterización de su cotizante. <br><br>Debe diligenciar la caracterización a travez del <br>documento del cotizante..<br>
                                <br><b>Número documento de cotizante:</b> ${this.afiliado.numero_documento}`,
                                confirmButtonText: "Entendido"
                            });
                        }
                    } else {
                        //si no es afiliado ni beneficiario activo
                        this.$toast.error("No se encontró información del afiliado.");
                    }

                } catch (error) {
                    // Si no existe el afiliado, se muestra un mensaje de error
                    this.$toast.error("Afiliado no existe.");
                } finally {
                    this.setPreload(false);
                }
            },

			limpiarAfiliado() {
				this.datosBuscarAfiliado = {
					numero_documento: null,
					tipo_documento: null,
				};
				this.afiliado_id = null;
				this.intentoBuscar = false;
			},

			guardarDatos({ modulo, data }) {
				this.$store.dispatch("encuesta/guardarDatos", { modulo, data });
			},


            enviarFormularioFinal() {
                this.$store.dispatch("encuesta/enviarFormulario", {
                    afiliado: this.afiliado
                }).then(() => {
                    this.limpiarAfiliado();
                    this.stanActual = 0;
                    this.stansCompletados = Array(this.stans.length).fill(false);
                });
            },

			siguienteStan() {
				if (this.stanActual < this.stans.length - 1) {
					this.stanActual++;
				}
			},

		},
	};

</script>

<style scoped>
	.progress-container {
		width: 100%;
		background-color: #ddd;
		height: 10px;
		border-radius: 5px;
		margin: 10px 0;
	}

	.progress-bar {
		height: 100%;
		background-color: #4caf50;
		border-radius: 5px;
		transition: width 0.3s;
	}

</style>
