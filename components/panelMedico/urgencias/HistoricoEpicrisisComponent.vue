<template>
	<div>
		<v-card>
			<v-dialog v-model="preload" persistent width="300">
				<v-card color="primary" dark>
					<v-card-text>
						Tranquilo procesamos tu solicitud !
						<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-divider></v-divider>
            <v-card-text>
                <v-row>
                   <v-col cols="12" sm="12" md="4">
                            <v-text-field v-model.trim="cedula_paciente" label="Número de Documento" >
                            </v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" small dark @click="cedula_paciente='',admisionesUrgencias=[]">limpiar</v-btn>
				<v-btn color="info" small dark @click="listarAdmisionesUrgencias()">Buscar</v-btn>
            </v-card-actions>
			<v-data-table :headers="headers" :items="admisionesUrgencias" :items-per-page="10"
				no-data-text="Aún no hay registros de citas no programadas">

				 <template v-slot:[`item.triage`]="{ item }">
					<v-chip small :color="colorTriage(item.consulta)" dark>
						{{ item.consulta?.historia_clinica?.triage ?? 'Sin evaluar' }}
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

					<v-tooltip bottom >
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="info" v-on="on" v-bind="attrs" @click="printCertificado(item)">
								<v-icon>mdi-clipboard-text</v-icon>
							</v-btn>
						</template>
						<span>Certificado</span>
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
						<b>Epicrisis</b></v-alert>
					<v-card-text>

						<v-form ref="evolucion">
							<v-row>
								<v-col cols="12" md="12" sm="12">
									<v-text-field label="Diagnostico principal" v-model="formulario.principal" outlined
										readonly>
									</v-text-field>
								</v-col>
								<v-col cols="12" sm="12" md="12">
									<v-text-field label="Diagnostico Egreso" v-model="formulario.cie10" outlined
										readonly>
									</v-text-field>
								</v-col>
								 <v-col cols="12" md="6" sm="12">
									<v-text-field label="Motivo de la salida" v-model="formulario.motivo_salida"
										 outlined >
									</v-text-field>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-text-field label="Estado de la salida" v-model="formulario.estado_salida"
										outlined >
									</v-text-field>
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
										label="Fecha y hora de egreso"></v-text-field>
								</v-col>
								<v-col cols="12" md="6" sm="12">
									<v-text-field label="Orden de alta"  v-model="formulario.orden_alta"
										outlined>
									</v-text-field>
								</v-col>
								<v-col cols="12" md="12" sm="12">
									<v-textarea label="Observación" v-model="formulario.observacion" outlined>
									</v-textarea>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" small dark @click="dialogoCrear=false">Cerrar</v-btn>
					</v-card-actions>
				</v-card>


			</v-dialog>
		</v-card>

	</div>
</template>
<script>
	import {
		mapActions
	} from "vuex";

	export default {
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
						text:'Documento',
						value:'numero_documento'
					},
					{
						text: 'Contrato',
						value: 'nombrecontrato'
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
					cie10: ''
				},
				dialogoCrear:false,
				datosAdmision:{},
				admisionesUrgencias:[],
                cedula_paciente:''
			}
		},
		mounted() {

		},

		watch: {
             ejecutar: {
                handler(valor) {
                    if (valor) {
                        this.cedula_paciente = ''
                        this.admisionesUrgencias = []
                    }
                },
                immediate: true

            }
		},

		methods: {
			...mapActions('app', ['setPreload']),

			listarAdmisionesUrgencias() {
				this.preload = true
				this.$axios.post('epicrisis/listar',{documento:this.cedula_paciente}).then(res => {
					this.preload = false
					this.admisionesUrgencias = res.data;
					// this.tableKey++;
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
					epicrisis: pdf.idEpicrisis,
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

				this.formulario = item
				this.formulario.principal = item.consulta.cie10_afiliado.filter((item => item.esprimario == true)).map((
					cie1o) => {
					return `${cie1o.cie10.codigo_cie10}- ${cie1o.cie10.descripcion}`
				})
				this.dialogoCrear = true
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



		}
	}

</script>
