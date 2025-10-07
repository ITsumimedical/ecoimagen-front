<template>
	<div>
		<v-card>

			<!-- <v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img src="/images/ojo.svg" alt="" height="50px" width="50px">
							<span>Evoluciones</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
				</v-toolbar>
			</v-card-title> -->
			<v-dialog v-model="preload" persistent width="300">
				<v-card color="primary" dark>
					<v-card-text>
						Tranquilo procesamos tu solicitud !
						<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-divider></v-divider>
			<v-data-table :headers="headers" :items="admisionesUrgencias" :items-per-page="10"
				no-data-text="Aún no hay registros de citas no programadas">

				<template v-slot:[`item.triage`]="{ item }">
					<v-chip small :color="colorTriage(item.consulta)" dark>
						{{ item.consulta?.historia_clinica?.triage ?? 'Sin evaluar' }}
					</v-chip>
				</template>
				<template v-slot:[`item.estado_nombre`]="{ item }">
					<v-chip small :color="colorEstadoTriage(item.estado_id)" dark>
						<td v-if="item.estado_id == 9">{{'Pendiente de consulta'}}</td>
						<td v-if="item.estado_id == 1">{{'Sin triage'}}</td>
						<td v-if="item.estado_id == 7">{{'En consulta'}}</td>
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
						<span>Registrar Epicrisis</span>
					</v-tooltip>

					<v-tooltip bottom v-if="item.evolucion.length >0">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="info" v-on="on" v-bind="attrs" @click="print(item)">
								<v-icon>mdi-clipboard-text</v-icon>
							</v-btn>
						</template>
						<span>Ver evoluciones</span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="warning" v-on="on" v-bind="attrs" @click="printHistoria(item)">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
						</template>
						<span>Imprimir historia</span>
					</v-tooltip>
				</template>
			</v-data-table>

			<v-dialog v-model="dialogoCrear" persistent width="1150" v-if="dialogoCrear">
				<v-card>

					<v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
						<b>Registrar</b></v-alert>
					<v-card-text>

						<v-form ref="evolucion">
							<v-row>
								<v-col cols="12" md="12" sm="12">
									<v-text-field label="Diagnostico principal" v-model="formulario.principal" outlined
										readonly>
									</v-text-field>
								</v-col>
								<v-col cols="12" sm="12" md="12">
									<v-autocomplete v-model="formulario.cie10_id" :items="cie10s"
										item-text="Codigo_Nombre" label="Diagnóstico Egreso" item-value="id"
										:search-input.sync="cie10" dense outlined solo
										no-data-text="Por favor escriba el nombre del diagnostico" required
										:rules="rules.cie10_id">
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-autocomplete label="Motivo de la salida" v-model="formulario.motivo_salida"
										:items="motivos" outlined :rules="rules.motivo_salida">
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-autocomplete label="Estado de la salida" v-model="formulario.estado_salida"
										:items="salida" outlined :rules="rules.estado_salida">
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="6" sm="12" v-if="formulario.estado_salida =='Muerto'">
									<v-text-field type="datetime-local" v-model="formulario.fecha_deceso" outlined
										label="Fecha y hora deceso"></v-text-field>
								</v-col>
								<v-col cols="12" md="6" sm="12" v-if="formulario.estado_salida =='Muerto'">
									<v-text-field label="Certificado de defuncion"
										v-model="formulario.certificado_defuncion" outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="12" sm="12" v-if="formulario.estado_salida =='Muerto'">
									<v-text-field label="Causa de muerte" v-model="formulario.causa_muerte" outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-text-field type="datetime-local" v-model="formulario.fecha_egreso" outlined
										label="Fecha y hora de egreso" :rules="rules.fecha_egreso"></v-text-field>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-autocomplete label="Orden de alta" :items="sino" v-model="formulario.orden_alta"
										outlined :rules="rules.orden_alta">
									</v-autocomplete>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-textarea label="Observación" v-model="formulario.observacion"
										:rules="rules.observacion" outlined>
									</v-textarea>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" small dark @click="dialogoCrear=false">Cerrar</v-btn>
						<v-btn color="success" small dark @click="guardarEpicrisis()">Guardar</v-btn>
					</v-card-actions>
				</v-card>


			</v-dialog>
		</v-card>

	</div>
</template>
<script>
	import ordenamientoComponet from "~/components/ordenamiento/ordenamiento.vue";
	import {
		mapActions
	} from "vuex";

	export default {
		components: {
			ordenamientoComponet
		},
         props: {
            ejecutar: {
                type: Boolean,
                default: false,
            },
        },
		name: 'triage',
		data() {
			return {
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
				formulario: {
					principal: '',
					motivo_salida: '',
					estado_salida: '',
					fecha_deceso: '',
					certificado_defuncion: '',
					causa_muerte: '',
					fecha_egreso: '',
					orden_alta: '',
					observacion: '',
					cie10_id: ''
				},
				motivos: ['Fuga', 'Orden medica', 'Salida voluntaria', 'Remision'],
				salida: ['Vivo', 'Muerto'],
				sino: ['Si', 'No'],
				admisionesUrgencias: [],
				dialogoCrear: false,
				cie10s: [],
				cie10: null,
				datosAdmision: {},
				rules: {
					cie10_id: [(v) => !!v || "El campo diagnostico egreso es requerido"],
					motivo_salida: [(v) => !!v || "El campo motivo de la salida es requerido"],
					estado_salida: [(v) => !!v || "El campo estado de la salida  es requerido"],
					fecha_egreso: [(v) => !!v || "El campo fecha de egreso es requerido"],
					orden_alta: [(v) => !!v || "El campo orde de alta es requerido"],
					observacion: [(v) => !!v || "El campo observación es requerido"],
				},
				listaHistorico: []
			}
		},
		mounted() {
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
			},
             ejecutar: {
                handler(valor) {
                    if (valor) {
                        this.listarAdmisionesUrgencias()
                    }
                },
                immediate: true

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
					epicrisis: pdf.id,
					tipo: 'CertificadoEpicrisis',
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
				this.datosAdmision = item

				this.formulario.principal = item.consulta.cie10_afiliado.filter((item => item.esprimario == true)).map((
					cie1o) => {
					return `${cie1o.cie10.codigo_cie10}- ${cie1o.cie10.descripcion}`
				})
				this.dialogoCrear = true
			},

			guardarEpicrisis() {
				if (!this.$refs.evolucion.validate()) {
					return
				}
				this.setPreload(true)
				this.formulario.consulta_id = this.datosAdmision.consulta.id
				this.formulario.admision_urgencia_id = this.datosAdmision.id
				this.$axios.post('epicrisis/crear', this.formulario).then(res => {
					this.printCertificado(res.data)
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

			async printHistoria(pdf) {
				this.setPreload(true)
				await this.$axios.post('pdf', {
					consulta: pdf.consulta.id,
					tipo: 'historia',
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

			limpiarEvolucion() {
				for (const key in this.formulario) {
					this.formulario[key] = "";
				}
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

		}
	}

</script>
