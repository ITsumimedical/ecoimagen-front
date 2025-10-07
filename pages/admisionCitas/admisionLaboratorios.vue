<template>
	<v-card>
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="logo horus" height="50px" width="50px" />
						<span>Módulo de ingreso laboratorios</span>
					</div>
				</v-toolbar-title>
			</v-toolbar>
		</v-card-title>

		<v-container fluid>
			<!-- Buscar Afiliado -->
			<v-row dense>
				<v-col cols="12" md="4" sm="12">
					<v-autocomplete dense outlined label="Tipo de documento" :items="tiposDocumentos" :loading="loading"
						no-data-text="No hay resultados" item-value="id" item-text="nombre"
						v-model="datosBuscarAfiliado.tipo_documento" />
				</v-col>
				<v-col cols="12" md="4" sm="12">
					<v-text-field dense outlined label="Número documento" @keyup.enter="consultarAfiliado()"
						v-model.trim="datosBuscarAfiliado.numero_documento" />
				</v-col>
				<v-col cols="12" md="4" sm="12" style="display: flex; gap: 0.2rem">
					<v-btn color="primary" dark @click="consultarAfiliado()" style="width: 50%">Consultar <v-icon right>
							mdi-magnify</v-icon>
					</v-btn>
					<v-btn color="red" dark @click="
						limpiarAfiliado();
					" style="width: 50%">Limpiar<v-icon right>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>

			<!-- Afiliado -->
			<v-row dense v-if="afiliado">
				<v-col cols="12" md="12" sm="12">
					<EditarAfiliadoComponente :afiliado="afiliado" :modoDetalle="true"
                    :modoEdicion="true" :mostrarClasificaciones="true"/>
				</v-col>
			</v-row>
			<div dense v-if="afiliado && datosCita.length == 0" class="mt-2">
				<v-alert text dense border="left" type="warning" icon="mdi-information-off-outline"
					class="text-center"><b>El afiliado no presenta ordenes</b></v-alert>
			</div>

			<v-card-text v-if="datosCita.length > 0" class="mt-2">
				<v-row dense>

					<v-col cols="12" md="12" sm="12">

						<v-alert class="text-center mt-2" dense text outlined type="info"
							icon="mdi-book-open-page-variant">
							<b>Laboratorios</b></v-alert>
						<v-row dense v-if="datosCita.length > 0">
							<v-col cols="6">
								<v-text-field v-model="buscar" append-icon="mdi-magnify" label="Buscar examenes"
									hint="Busca por la orden o fecha deseada" class="mb-4 ml-2"></v-text-field>
							</v-col>
						</v-row>
						<v-divider></v-divider>
						<v-row dense v-if="datosCita.length > 0" class="ml-2 mb-2 mt-2">
							<v-col cols="4">
								<b>N° Orden</b>
							</v-col>
							<v-col cols="5">
								<b>Fecha</b>
							</v-col>
							<v-col cols="3">
								<b class="text-left">Admisión</b>
							</v-col>
						</v-row>

						<v-expansion-panels inset focusable accordion>
							<v-expansion-panel v-for="item in filtrarOrdenes" :key="item.orden_id">
								<v-expansion-panel-header>
									<v-row no-gutters>
										<v-col cols="4">{{ item.orden_id }}</v-col>
										<v-col cols="4">{{ $moment(item.created_at).format("DD-MM-YYYY") }}</v-col>
										<v-col cols="4">
											<template>
												<div class="d-flex justify-center">
													<v-tooltip top>
														<template v-slot:activator="{ on, attrs }">
															<v-icon color="success" class="mr-2" v-bind="attrs"
																v-on="on" @click.stop="confirmarConsulta()">
																mdi-calendar-check
															</v-icon>
														</template>
														<span>Admitir y firmar consentimiento</span>
													</v-tooltip>
												</div>
											</template>
										</v-col>

									</v-row>
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-data-table hide-default-footer :headers="headers" :items="item.examenes"
										show-select v-model:select="ordenesFirmar" item-key="cup_id">

										<template v-slot:[`item.admision`]="{ item }">
											<v-icon color="red">mdi-close-thick</v-icon><br>
											{{ estadoFirma(item) }}
										</template>
									</v-data-table>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>

					</v-col>
				</v-row>
			</v-card-text>
			<consentimientoInformadoComponent v-if="abrirModalConsentimiento"
				:mostrarModalConsentimiento.sync="abrirModalConsentimiento" :item="laboratorioSeleccionado"
				:datosUsuario="afiliado" @firma="obtenerFirmaConsentimiento"
				:servicioGenera="'Toma de muestras - laboratorio'" />

			<v-dialog v-model="dialogoFirma" persistent fullscreen>
				<v-card>
					<v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
						<b>Firma afiliado para admisión</b></v-alert>
					<v-col cols="12" sm="12" md="12">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<div class="firma mb-5">
									<h4 class="ml-3">Firma</h4>
									<vueSignature ref="signature" :sigOption="option" :w="'400'">
									</vueSignature>
									<v-card-actions>
										<v-spacer></v-spacer>
										<v-btn small color="warning" @click="clear">Limpiar</v-btn>
									</v-card-actions>
								</div>
							</v-col>
						</v-row>
					</v-col>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" small dark
							@click="dialogoFirma = false, datosFirma = [], clear">Cancelar</v-btn>
						<v-btn color="success" small dark @click="confirmarCita()">Guardar firma</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
	</v-card>
</template>

<script>
import vueSignature from "vue-signature";
import {
	mapActions
} from "vuex";
import EditarAfiliadoComponente from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import CitasAfiliado from "@/components/afiliado/CitasAfiliado.vue";
import moment from "moment";
moment.locale("es");
import consentimientoInformadoComponent from "@/components/consentimientos/consentimientoInformadoComponent.vue"


export default {
	middleware({
		$can,
		redirect
	}) {
		if (!$can("cita.agendamiento.vista")) {
			return redirect("/");
		}
	},
	components: {
		EditarAfiliadoComponente,
		CitasAfiliado,
		vueSignature,
		consentimientoInformadoComponent
	},
	data() {
		return {
			ordenesFirmar: [],
			laboratorioSeleccionado: null,
			buscar: '',
			abrirModalConsentimiento: false,
			menu: false,
			loading: false,
			tiposDocumentos: [],
			datosBuscarAfiliado: {
				numero_documento: null,
				tipo_documento: null,
			},
			afiliado: null,
			fechaMinima: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
				.toISOString()
				.substring(0, 10),
			headers: [
				{ text: 'Nombre', value: 'nombre', sortable: false, align: 'center' },
				{ text: 'Cantidad', value: 'cantidad', sortable: false, align: 'center' },
				{ text: 'Observación', value: 'observaciones', sortable: false, align: 'center' },
				{ text: 'Prestador', value: 'rep', sortable: false, align: 'center' },
				{ text: 'Admisión', value: 'admision', sortable: false, align: 'center' }
			],
			datosCita: [],
			dialogoFirma: false,
			datosFirma: [],
			option: {
				penColor: "rgb(0, 0, 0)",
				backgroundColor: "rgb(255,255,255)",
			},
			firmaConsentimiento: null
		};
	},
	mounted() {
		this.listarTiposDocumentos();
		// this.listarEspecialidadesConCitas();
	},
	filters: {
		formatoFecha(fecha) {
			return moment(fecha).format("dddd, D MMMM, YYYY");
		},

		formatoHora(Hora_Inicio) {
			return moment(Hora_Inicio).format("hh:mm A");
		},
	},
	computed: {
		filtrarOrdenes() {
			const busqueda = this.buscar?.toLowerCase()
			return this.datosCita.filter(val => {
				const fecha = this.$moment(val.created_at).format("DD-MM-YYYY").includes(busqueda)
				const orden_id = String(val.orden_id).includes(busqueda)
				return orden_id || fecha
			})
		}
	},
	methods: {
		...mapActions("app", ["setPreload"]),

		listarTiposDocumentos() {
			this.loading = true;
			this.$axios
				.get("/tipo-documento/listar")
				.then((res) => {
					this.tiposDocumentos = res.data;
				})
				.catch((error) => {
					this.$toast.error(
						"Ocurrió un error al cargar los tipos de documento"
					);
					console.log(error);
				})
				.finally(() => {
					this.loading = false;
				});
		},

		consultarAfiliado() {
			this.setPreload(true);
			this.$axios
				.get(
					`/afiliados/${this.datosBuscarAfiliado.numero_documento}/${this.datosBuscarAfiliado.tipo_documento}`
				)
				.then((res) => {
					this.afiliado = res.data;
					this.consultarLaboratorios(res.data.id)
				})
				.catch((error) => {
					this.$toast.error(
						"El afiliado no se encuentra registrado en la base de datos."
					);
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		limpiarAfiliado() {
			this.datosBuscarAfiliado = {
				numero_documento: null,
				tipo_documento: null,
			};
			this.afiliado = null;
			this.datosCita = []
		},

		consultarLaboratorios(id) {
			this.datosCita = []
			this.setPreload(true);
			this.$axios.post(`/ordenamiento/consultarLaboratorio`, {
				afiliado: id
			}).then((res) => {
				this.datosCita = Object.values(
					res.data.reduce((acumulador, datos) => {
						const id = datos.orden_id;

						if (!acumulador[id]) {
							acumulador[id] = {
								orden_id: datos.orden_id,
								created_at: datos.created_at,
								examenes: []
							}
						}

						acumulador[id].examenes.push({
							nombre: datos.cup?.nombre ?? '',
							cantidad: datos.cantidad,
							observaciones: datos.observaciones,
							rep: datos.rep?.nombre ?? 'Sin direccionar',
							cup_id: datos.cup_id,
							requiere_firma: datos.cup.requiere_firma,
							procedimiento_id: datos.id,
							firmado: datos.firmado,
							sin_consentimiento: datos.ingreso_sin_consentimiento,
							fecha_firma: datos.fecha_firma,
							requiere_consentimiento: datos.cup.consentimiento_informado
						});

						return acumulador;
					}, {})
				)
				this.datosCita = this.datosCita.sort((a, b) => b.orden_id - a.orden_id)
			})
				.catch((error) => {
					this.$toast.error(
						"El afiliado no se encuentra registrado en la base de datos."
					);
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false);
				});
		},

		obtenerColorEstado(estadoId) {
			switch (estadoId) {
				case 30:
					return "warning";
				case 8:
					return "info";
				case 9:
					return "success";
				case 10:
					return "warning";
				case 13:
					return "info";
				case 59:
					return "success";
				default:
					return "gray";
			}
		},

		obtenerUltimoMedico(medicos) {
			if (medicos && medicos.length > 0) {
				return medicos[medicos.length - 1].operador.nombre_completo;
			}
			return "No disponible";
		},

		confirmarConsulta() {
			if (this.ordenesFirmar.length === 0) {
				this.$swal({
					title: "¡Error!",
					text: "Seleccione un procedimiento para realizarle la admisión",
					type: "warning",
				});
				return
			}

			const requieren_firma = this.ordenesFirmar?.filter(examen => !examen.requiere_consentimiento)
			const requiere_consentimientos = this.ordenesFirmar?.filter(examen => examen.requiere_consentimiento)

			if (requieren_firma.length > 0 && requiere_consentimientos.length > 0) {

				this.laboratorioSeleccionado = requiere_consentimientos
				this.datosFirma = requieren_firma
				this.abrirConsentimiento()

			} else if (requiere_consentimientos.length > 0) {

				this.laboratorioSeleccionado = requiere_consentimientos
				this.abrirConsentimiento()

			} else if (requieren_firma.length > 0) {

				this.datosFirma = requieren_firma
				this.dialogoFirma = true
			}

			this.ordenesFirmar = []
		},

		clear() {
			var _this = this;
			_this.$refs.signature.clear();
		},
		undo() {
			var _this = this;
			_this.$refs.signature.undo();
		},

		clear2() {
			var _this = this;
			_this.$refs.signature2.clear();
		},
		undo2() {
			var _this = this;
			_this.$refs.signature2.undo();
		},

		confirmarCita() {
			const tieneFirmaLocal = this.$refs.signature && !this.$refs.signature.isEmpty()
			const tieneFirmaHijo = !!this.firmaConsentimiento

			if (!tieneFirmaLocal && !tieneFirmaHijo) {
				this.$swal({
					title: "¡Error!",
					text: "Es necesaria la firma del paciente.",
					type: "warning",
				})
				return
			}
			const firmaBase64 = tieneFirmaLocal ? this.$refs.signature.save() : this.firmaConsentimiento
			const ordenProcedimiento = this.datosFirma.map((procedimiento => { return procedimiento.procedimiento_id }))
			const data = {
				firma_paciente: firmaBase64,
				orden_procedimiento: ordenProcedimiento
			}

			this.setPreload(true)

			this.$axios
				.post("/ordenamiento/firmar", data)
				.then((res) => {
					// this.$toast.success(res.data.mensaje);

					// this.clear2();
					this.datosFirma = []
					this.dialogoFirma = false
					this.consultarLaboratorios(this.afiliado.id)
					this.clear()
					this.firmaConsentimiento = null
					// this.recargarDatos();
				})
				.catch((error) => {
					this.$toast.error(error.response.data.mensaje);
					console.log(error);
				})
				.finally(() => {
					this.setPreload(false)
				});
		},
		abrirConsentimiento() {
			this.abrirModalConsentimiento = true
		},

		obtenerFirmaConsentimiento(firma) {
			if (firma && this.datosFirma.length > 0) {
				this.firmaConsentimiento = firma
				this.confirmarCita()
			}
			this.consultarLaboratorios(this.afiliado.id)
			return
		},
		imprimirConsentimiento(item) {
			this.setPreload(true)
			this.$axios.post('pdf', {
				tipo: "consentimientoInformadoLaboratorio",
				id: item.cup_id,
				orden_id: item.procedimiento_id,
			}, {
				responseType: "arraybuffer"
			}).then(res => {
				let blob = new Blob([res.data], {
					type: "application/pdf"
				});
				let link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				window.open(link.href, "_blank");
				this.setPreload(false)
			}).catch(err => {
				this.setPreload(false);
			})
		},
		estadoFirma(item) {
			if (item.requiere_consentimiento) return 'Consentimiento sin firmar'
			return 'Ingreso sin firmar';
		},

	},
};

</script>
