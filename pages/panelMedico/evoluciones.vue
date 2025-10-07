<template>
	<div>
		<v-card>

			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px">
							<span>Evoluciones</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title>
			<v-dialog v-model="preload" persistent width="300">
				<v-card color="primary" dark>
					<v-card-text>
						Tranquilo procesamos tu solicitud !
						<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-divider></v-divider>
			<v-data-table :headers="headers" :items="admisionesUrgencias" :items-per-page="10" :key="tableKey"
				no-data-text="Aún no hay registros de citas no programadas">

				<template v-slot:[`item.triage`]="{ item }">
					<v-chip small :color="colorTriage(item.consulta)" dark>
						{{ item.consulta?.historia_clinica?.triage ?? 'Sin evaluar' }}
					</v-chip>
				</template>
				<template v-slot:[`item.estado_nombre`]="{ item }">
					<v-chip small :color="colorEstadoTriage(item.estado_id)" dark>
						<td v-if="item.estado_id == 9">{{ 'Pendiente de consulta' }}</td>
						<td v-if="item.estado_id == 1">{{ 'Sin triage' }}</td>
						<td v-if="item.estado_id == 7">{{ 'En consulta' }}</td>
					</v-chip>

				</template>
				<template v-slot:[`item.acciones`]="{ item }">
					<v-tooltip right>
						<template v-slot:activator="{ on, attrs }">
							<v-icon small color="success" class="mr-2" v-bind="attrs" v-on="on"
								@click="abrirDialogo(item)">
								mdi-account-check
							</v-icon>
						</template>
						<span>Agregar evolución</span>
					</v-tooltip>

					<v-tooltip bottom v-if="item.evolucion.length > 0">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="warning" v-on="on" v-bind="attrs" @click="print(item)">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
						</template>
						<span>Imprimir</span>
					</v-tooltip>


					<!--<v-tooltip bottom v-if="item.estado_id == 9 || item.estado_id == 7">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="primary" v-on="on" v-bind="attrs" @click="printCertificado(item)">
								<v-icon>mdi-file-certificate</v-icon>
							</v-btn>
						</template>
						<span>Imprimir</span>
					</v-tooltip> -->
				</template>
			</v-data-table>

			<!-- <v-dialog v-model="dialogoCrear" persistent fullscreen v-if="dialogoCrear">
				<v-card>

					<v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
						<b>Registrar evolución</b></v-alert>
					<v-card-actions>
						<v-spacer></v-spacer>
						<ordenamientoComponet :consulta="parseInt(datosAdmision.consulta.id)" :habilitarBoton="true"
							:dialog="false" />
					</v-card-actions>
					<v-card-text>

						<v-form ref="evolucion">
							<v-row>
								<v-col cols="12" md="12" sm="12">
									<v-text-field label="Subjetivos" v-model="subjetivo" outlined required
										:rules="rules.subjetivo">
									</v-text-field>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-textarea label="Descripción Fisica" rows="2" v-model="descripcion_fisica"
										outlined :rules="rules.descripcion_fisica">
									</v-textarea>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-text-field label="Paraclinicos" v-model="paraclinicos" outlined
										:rules="rules.paraclinicos">
									</v-text-field>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-text-field label="Procedimientos" v-model="procedimiento" outlined
										:rules="rules.procedimiento">
									</v-text-field>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-textarea label="Analisis" rows="2" v-model="analisis" outlined
										:rules="rules.analisis">
									</v-textarea>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-textarea label="Tratamiento" rows="2" auto-grow v-model="tratamiento" outlined
										:rules="rules.tratamiento">
									</v-textarea>
								</v-col>
								<v-col cols="12" md="2" sm="12">
									<v-text-field label="Peso" v-model="peso" outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="3" sm="12">
									<v-text-field label="Presión sistólica" v-model="presion_sistolica" type="number"
										outlined @input="calcularTensionArterial" />
								</v-col>
								<v-col cols="12" md="3" sm="12">
									<v-text-field label="Presión diastólica" v-model="presion_diastolica" type="number"
										outlined @input="calcularTensionArterial" />
								</v-col>
								<v-col cols="12" md="3" sm="12">
									<v-text-field label="Tensión arterial (PAM)" v-model="tension_arterial" outlined
										readonly />
								</v-col>
								<v-col cols="12" md="3" sm="12">
									<v-text-field label="Frecuencia respiratoria" v-model="frecuencia_respiratoria"
										outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="2" sm="12">
									<v-text-field label="Frecuencia cardiaca" v-model="frecuencia_cardiaca" outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="2" sm="12">
									<v-text-field label="Temperatura" v-model="temperatura" outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" sm="12" md="6">
									<v-autocomplete v-model="cie10_id" :items="cie10s" item-text="Codigo_Nombre"
										label="Diagnóstico" item-value="id" :search-input.sync="cie10" dense outlined
										solo no-data-text="Por favor escriba el nombre del diagnostico" required>
									</v-autocomplete>
								</v-col>
								<v-col cols="12" sm="12" md="5">
									<v-select v-model="tipo" :items="tipoDiagnosticos" label="Tipo Diagnóstico" dense
										outlined solo>
									</v-select>
								</v-col>
								<v-col cols="12" sm="12" md="1">
									<v-btn color="success" dark small class="mt-2" @click="agregarCie10">Agregar</v-btn>
								</v-col>
								<v-col cols="12" sm="12" md="12">
									<div @click="listarHistorico" class="data-table-container">
										<v-data-table :headers="headersCie10" :items="listaHistorico"
											:items-per-page="5" class="elevation-1" dense disable-pagination>
											<template v-slot:[`item.esprimario`]="{ item }">
												<v-chip v-if="item.esprimario" color="success" dark small>SI</v-chip>
												<v-chip v-else color="error" dark small>NO</v-chip>
											</template>
											<template v-slot:[`item.acciones`]="{ item }">
												<v-tooltip top>
													<template v-slot:activator="{ on, attrs }">
														<v-icon color="warning" small v-bind="attrs" v-on="on"
															@click="eliminarDiagnostico(item)">
															mdi-delete
														</v-icon>
													</template>
													<span>Eliminar</span>
												</v-tooltip>
											</template>
										</v-data-table>
									</div>
								</v-col>

							</v-row>

						</v-form>


					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" small dark @click="dialogoCrear = false">Cerrar</v-btn>
						<v-btn color="success" small dark @click="guardarEvolucion()">Guardar</v-btn>
					</v-card-actions>
				</v-card>


			</v-dialog> -->
		</v-card>

		<modal-agregar-evolucion-admision :mostrar-modal-agregar.sync="mostrarModalAgregar"
			:datos-admision="datosAdmision" />
	</div>
</template>
<script>
import ModalAgregarEvolucionAdmision from '@/components/admisiones/evoluciones/modalAgregarEvolucionAdmision.vue';
import ordenamientoComponet from "~/components/ordenamiento/ordenamiento.vue";
import {
	mapActions
} from "vuex";

export default {
	components: {
		ordenamientoComponet,
		ModalAgregarEvolucionAdmision
	},
	name: 'triage',
	data() {
		return {
			tableKey: 0,
			comp: null,
			preload: false,
			headers: [{
				text: 'Paciente',
				value: 'nombrepaciente'
			},
			{
				text: 'Contrato',
				value: 'nombrecontrato'
			},
			// {
			// 	text: 'Estado',
			// 	value: 'estado_nombre'
			// },
			// { text: 'Causa Muerte', value: 'causa_muerte' },
			{
				text: 'Causa Externa',
				value: 'causa_externa'
			},
			// { text: 'Destino', value: 'destino_usuario' },
			{
				text: 'Acompañante',
				value: 'nombre_acompanante'
			},
			{
				text: 'Teléfono Acompañante',
				value: 'telefono_acompanante'
			},
			{
				text: 'Direccion Acompañante',
				value: 'direccion_acompanante'
			},
			{
				text: 'Triage',
				value: 'triage'
			},
			{
				text: 'Acciones',
				value: 'acciones'
			},
			],
			headersCie10: [{
				text: 'Diagnóstico',
				value: 'cie10.Codigo_Nombre'
			},
			{
				text: 'Tipo',
				value: 'tipo_diagnostico'
			},
			{
				text: 'Primario',
				value: 'esprimario'
			},
			{
				text: 'Acciones',
				value: 'acciones',
				sortable: false,
				align: 'center'
			},
			],
			admisionesUrgencias: [],
			dialogoCrear: false,
			subjetivo: '',
			descripcion_fisica: '',
			paraclinicos: '',
			procedimiento: '',
			tratamiento: '',
			analisis: '',
			cie10_id: '',
			tipo: '',
			peso: '',
			frecuencia_respiratoria: '',
			frecuencia_cardiaca: '',
			temperatura: '',
			presion_sistolica: '',
			presion_diastolica: '',
			tension_arterial: '',
			tipoDiagnosticos: ['Impresión diagnóstica', 'Confirmado nuevo', 'Confirmado repetido'],
			cie10s: [],
			cie10: null,
			datosGenerales: {},
			datosAdmision: {},
			rules: {
				subjetivo: [(v) => !!v || "El campo subjetivo es requerido"],
				descripcion_fisica: [(v) => !!v || "El campo descripción es requerido"],
				paraclinicos: [(v) => !!v || "El campo paraclinicos  es requerido"],
				procedimiento: [(v) => !!v || "El campo procedimiento es requerido"],
				tratamiento: [(v) => !!v || "El campo tratamiento es requerido"],
				analisis: [(v) => !!v || "El campo analisis es requerido"],
			},
			listaHistorico: [],
			mostrarModalAgregar: false
		}
	},
	mounted() {
		this.listarAdmisionesUrgencias();
	},

	watch: {
		cie10(val) {
			if (val) {
				if (val.length === 4) {
					this.listarCie10();
				} else if (val.length < 4) {
					this.cie10s = [];
				}
			} else {
				this.cie10s = [];

			}
		}
	},

	methods: {
		...mapActions('app', ['setPreload']),

		listarAdmisionesUrgencias() {
			this.preload = true
			this.$axios.post('admisiones/listarAdmisionesUrgenciasEvolucion').then(res => {
				this.preload = false
				this.admisionesUrgencias = [...res.data];
				this.tableKey++;
			}).catch(e => {
				console.log(e);
				this.preload = false
			})
		},


		atenderConsulta(item) {
			this.$axios.post('consultas/obtenerConsultaTriage', {
				consulta_id: item.consulta.id
			}).then(res => {
				// this.preload = false

				this.datosGenerales = res.data
				this.comp = 'HistoriaIntegral';
			}).catch(e => {
				console.log(e);
				// this.preload = false
			})
		},

		cerrarHistoria() {
			this.comp = null;
			this.listarAdmisionesUrgencias()
			// this.$emit("actualizarContadores");
		},

		colorTriage(item) {
			if (item) {
				if (item.historia_clinica) {
					if (item.historia_clinica.triage == 'TRIAGE I') {
						return 'error white--text';
					} else if (item.historia_clinica.triage == 'TRIAGE II') {
						return 'warning white--text';
					} else if (item.historia_clinica.triage == 'TRIAGE III') {
						return 'yellow black--text';
					} else if (item.historia_clinica.triage == 'TRIAGE IV') {
						return 'success white--text';
					} else if (item.historia_clinica.triage == 'TRIAGE V') {
						return 'primary white--text';
					}
				} else {
					return 'gray white--text';
				}

			}
		},

		colorEstadoTriage(item) {
			if (item == 1) {
				return 'success white--text';
			} else if (item == 9) {
				return 'error white--text';
			} else if (item == 7) {
				return 'warning white--text';
			}
		},

		async print(pdf) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				consulta: pdf.consulta.id,
				tipo: 'Evolucion'
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

		async printCertificado(pdf) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				consulta: pdf.consulta.id,
				tipo: 'CertificadoMedimas',
				correo: null
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

		abrirDialogo(item) {
			this.datosAdmision = item;
			this.mostrarModalAgregar = true;
		},

		guardarEvolucion() {
			if (!this.$refs.evolucion.validate()) {
				return
			}
			this.setPreload(true)
			this.$axios.post('evoluciones/crear', {
				subjetivo: this.subjetivo,
				descripcion_fisica: this.descripcion_fisica,
				paraclinicos: this.paraclinicos,
				procedimiento: this.procedimiento,
				analisis: this.analisis,
				tratamiento: this.tratamiento,
				peso: this.peso,
				tension_arterial: this.tension_arterial,
				frecuencia_respiratoria: this.frecuencia_respiratoria,
				frecuencia_cardiaca: this.frecuencia_cardiaca,
				temperatura: this.temperatura,
				consulta_id: this.datosAdmision.consulta.id,
				admision_urgencia_id: this.datosAdmision.id,
				presion_sistolica: this.presion_sistolica,
				presion_diastolica: this.presion_diastolica,
			}).then(res => {
				this.dialogoCrear = false
				this.limpiarEvolucion()
				this.$toast.success('Evolución creada con exito')
				this.listarAdmisionesUrgencias()
			}).catch(e => {
				console.log(e);
				// this.preload = false
			}).finally(e => {
				this.setPreload(false)
			})

		},


		listarCie10() {
			const data = {
				valor: this.cie10
			}
			// this.loading = true
			this.$axios.$post('cie10/listarFiltro', data).then(res => {
				this.cie10s = res
			}).catch(err => {
				console.log(err)
				this.$toast.error(err.response.data.mensaje)
			}).finally(() => {
				// this.loading = false
			})
		},

		listarHistorico() {
			// this.loading = true
			this.$axios.post("/historia/listarCie10Historico", {
				consulta: this.datosAdmision.consulta.id
			}).then((res) => {
				this.listaHistorico = res.data;
			}).catch((err) => {
				return this.$toast.error("Error al listar antecedentes personales");
			}).finally(() => {
				// this.loading = false
			})
		},

		limpiarFormulario() {
			this.cie10_id = '',
				this.tipo = ''
			this.listarHistorico()
		},

		agregarCie10() {
			this.preload = true
			this.$axios.post("/historia/guardarCie10", {
				consulta_id: this.datosAdmision.consulta.id,
				tipo: this.tipo,
				cie10_id: this.cie10_id
			})
				.then((res) => {
					// this.$toast.success(res.data.mensaje);
					this.limpiarFormulario();
					// this.preload = false
				})
				.catch((err) => {
					console.log(err);
					return this.$toast.error('Debes diligenciar ambos campos para agregar el diagnóstico');
				}).finally(() => {
					this.preload = false
				})
		},

		eliminarDiagnostico(item) {
			this.$swal({
				title: '¿Está Seguro?',
				text: `Está a punto de eliminar el diagnóstico ${item.cie10.Codigo_Nombre}`,
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si, eliminar!',
				cancelButtonText: 'Cancelar',
			}).then((result) => {
				if (result.value) {
					// this.preload = true
					this.$axios.delete(`/historia/eliminarCie10/${item.id}`, {
						data: {
							consulta_id: item.consulta_id
						},
					})
						.then((res) => {
							this.$toast.success(res.data.mensaje)
							this.listarHistorico()
						})
						.catch(() => {
							return this.$toast.error('Error al eliminar diagnóstico')
						})
						.finally(() => {
							// this.preload = false
						})
				}
			})
		},

		limpiarEvolucion() {
			this.datosAdmision = {}
			this.subjetivo = '',
				this.descripcion_fisica = '',
				this.paraclinicos = '',
				this.procedimiento = '',
				this.tratamiento = '',
				this.analisis = '',
				this.cie10_id = '',
				this.tipo = '',
				this.peso = '',
				this.frecuencia_respiratoria = '',
				this.frecuencia_cardiaca = '',
				this.temperatura = '',
				this.tension_arterial = ''
		},

		calcularTensionArterial() {
			const ps = parseFloat(this.presion_sistolica);
			const pd = parseFloat(this.presion_diastolica);

			if (!isNaN(ps) && !isNaN(pd)) {
				const pam = ((ps + (2 * pd)) / 3).toFixed(1);
				this.tension_arterial = pam;
			} else {
				this.tension_arterial = '';
			}
		},


	}
}

</script>
