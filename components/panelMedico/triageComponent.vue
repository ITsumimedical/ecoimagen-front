<template>
	<div>
		<component :is="comp" :datos="datosGenerales" @cerrar="cerrarHistoria" :ref="comp" />
		<v-dialog v-model="preload" persistent width="300">
			<v-card color="primary" dark>
				<v-card-text>
					Tranquilo procesamos tu solicitud !
					<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-divider></v-divider>
		<v-data-table :loading="loading.admisionesUrgencias" :headers="headers" :items="admisionesUrgencias"
			:items-per-page="10" :key="tableKey" no-data-text="Aún no hay registros de citas no programadas">

			<template v-slot:[`item.triage`]="{ item }">
				<v-chip dark label small :color="colorTriage(item.consulta)">
					<b>
						{{ item.consulta?.historia_clinica?.triage ?? 'SIN EVALUAR' }}
					</b>
				</v-chip>
			</template>
			<template v-slot:[`item.estado_nombre`]="{ item }">
				<v-chip small label dark :color="colorEstadoTriage(item.estado_id)">
					<b>
						<td v-if="item.estado_id == 9">{{ 'PENDIENTE DE CONSULTA' }}</td>
					</b>
					<b>
						<td v-if="item.estado_id == 1">{{ 'SIN TRIAGE' }}</td>
					</b>
					<b>
						<td v-if="item.estado_id == 7">{{ 'EN CONSULTA' }}</td>
					</b>
				</v-chip>
			</template>
			<template v-slot:[`item.causa_externa`]="{ item }">
				{{ item.causa_externa ?? ' - ' }}
			</template>
			<template v-slot:[`item.nombre_acompanante`]="{ item }">
				{{ item.nombre_acompanante ?? ' - ' }}
			</template>
			<template v-slot:[`item.telefono_acompanante`]="{ item }">
				{{ item.telefono_acompanante ?? ' - ' }}
			</template>
			<template v-slot:[`item.direccion_acompanante`]="{ item }">
				{{ item.direccion_acompanante ?? ' - ' }}
			</template>
			<template v-slot:[`item.acciones`]="{ item }">
				<div style="display: flex; justify-content: center; gap: 0.3rem;">
					<v-tooltip right v-if="!item.consulta && item.estado_id == 1">
						<template v-slot:activator="{ on, attrs }">
							<v-icon small color="success" v-bind="attrs" v-on="on" @click="atender(item)">
								mdi-account-check
							</v-icon>
						</template>
						<span>Atender</span>
					</v-tooltip>
					<v-tooltip right v-if="item.consulta && item.estado_id == 1">
						<template v-slot:activator="{ on, attrs }">
							<v-icon small color="success" v-bind="attrs" v-on="on" @click="atenderConsulta(item)">
								mdi-account-check
							</v-icon>
						</template>
						<span>Atender</span>
					</v-tooltip>
					<v-tooltip right v-if="item?.consulta?.estado_triage">
						<template v-slot:activator="{ on, attrs }">
							<v-icon small color="success" v-bind="attrs" v-on="on" @click="atenderConsulta(item)">
								mdi-account-check
							</v-icon>
						</template>
						<span>Atender</span>
					</v-tooltip>
					<v-tooltip bottom v-if="item.estado_id == 1">
						<template v-slot:activator="{ on, attrs }">
							<v-icon small color="error" v-bind="attrs" v-on="on" @click="inasistir(item.id)">
								mdi-account-remove
							</v-icon>
						</template>
						<span>Inasistir</span>
					</v-tooltip>
					<v-tooltip bottom v-if="item.estado_id == 9 || item.estado_id == 7">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="warning" v-on="on" v-bind="attrs" @click="print(item)">
								<v-icon>mdi-printer</v-icon>
							</v-btn>
						</template>
						<span>Imprimir</span>
					</v-tooltip>

					<!-- <v-tooltip bottom v-if="item.estado_id == 9">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon color="success" v-on="on" v-bind="attrs" @click="printAnexo(item)">
                            <v-icon>mdi-printer</v-icon>
                        </v-btn>
                    </template>
                    <span>Imprimir</span>
                </v-tooltip> -->
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="primary" v-on="on" v-bind="attrs" @click="printCertificado(item)">
								<v-icon>mdi-file-certificate</v-icon>
							</v-btn>
						</template>
						<span>Imprimir certificado admisión</span>
					</v-tooltip>
					<v-tooltip bottom v-if="item.estado_id == 9 || item.estado_id == 7">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon small color="success" v-on="on" v-bind="attrs"
								@click="printCertificadoAtencion(item)">
								<v-icon>mdi-file-certificate</v-icon>
							</v-btn>
						</template>
						<span>Imprimir certificado atención</span>
					</v-tooltip>
				</div>
			</template>
		</v-data-table>

		<v-dialog v-model="dialogoInasistencia" persistent width="500">
			<v-card>
				<v-card-title>
					<v-toolbar flat>
						<v-toolbar-title>
							<div class="d-flex align-center">
								<img src="/images/ojo.svg" alt="" height="50px" width="50px">
								<span>Inasistir Consulta</span>
							</div>
						</v-toolbar-title>
						<v-divider class="mx-4" inset vertical></v-divider>
					</v-toolbar>
				</v-card-title>
				<v-card-text>
					<v-form ref="formInasistencia">
						<v-row dense>
							<v-col cols="12" md="12" sm="12">
								<v-textarea dense auto-grow label="Observación" placeholder="Placeholder" outlined
									:rules="[rules.obligatorio, rules.minCaracteres]"
									v-model="observacion_inasistencia">
								</v-textarea>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" small dark @click="dialogoInasistencia = false">Cerrar</v-btn>
					<v-btn color="success" small dark @click="guardarInasistencia()">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>
<script>
import HistoriaIntegral from "~/components/panelMedico/historiaIntegral.vue";
import {
	mapActions
} from "vuex";
export default {
	name: 'triage',
	components: {
		HistoriaIntegral
	},
	data() {
		return {
			tableKey: 0,
			comp: null,
			preload: false,
			headers: [
				{
					text: 'Paciente',
					value: 'nombrepaciente',
					align: 'center'
				},
				{
					text: 'Contrato',
					value: 'nombrecontrato',
					align: 'center'
				},
				{
					text: 'Estado',
					value: 'estado_nombre',
					align: 'center'
				},
				// { text: 'Causa Muerte', value: 'causa_muerte' },,

				{
					text: 'Causa Externa',
					value: 'causa_externa',
					align: 'center'
				},
				// { text: 'Destino', value: 'destino_usuario' },,

				{
					text: 'Acompañante',
					value: 'nombre_acompanante',
					align: 'center'
				},
				{
					text: 'Teléfono Acompañante',
					value: 'telefono_acompanante',
					align: 'center'
				},
				{
					text: 'Direccion Acompañante',
					value: 'direccion_acompanante',
					align: 'center'
				},
				{
					text: 'Triage',
					value: 'triage',
					align: 'center'
				},
				{
					text: 'Acciones',
					value: 'acciones',
					align: 'center'
				},
			],
			admisionesUrgencias: [],
			dialogoInasistencia: false,
			observacion_inasistencia: '',
			admision: '',
			datosGenerales: {},
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
				minCaracteres: v => v.length >= 5 || 'Este campo debe tener al menos 5 caractéres.',
			},
			loading: {
				admisionesUrgencias: false
			}
		}
	},
	mounted() {
		this.listarAdmisionesUrgencias();
	},

	methods: {
		...mapActions('app', ['setPreload']),

		async listarAdmisionesUrgencias() {
			try {
				this.loading.admisionesUrgencias = true;
				const res = await this.$axios.post('admisiones/listarAdmisionesUrgencias');

				this.admisionesUrgencias = [...res.data];
				this.tableKey++;
			} catch (error) {
				this.$toast.error('Error cargando admisiones');
			} finally {
				this.loading.admisionesUrgencias = false;
			}
		},

		inasistir(id) {
			this.admision = id
			this.dialogoInasistencia = true
		},

		async guardarInasistencia() {
			if (!this.$refs.formInasistencia.validate()) return;
			this.setPreload(true);
			try {

				await this.$axios.post('admisiones/inasistir', {
					id: this.admision,
					observacion_inasistencia: this.observacion_inasistencia
				});

				this.admision = ''
				this.observacion_inasistencia = ''
				this.dialogoInasistencia = false
				await this.listarAdmisionesUrgencias();

			} catch (error) {
				this.$toast.error('Error cargando admisiones');
			} finally {
				this.setPreload(false);
			}
		},

		async atender(item) {

			try {
				const { value } = await this.$swal.fire({
					title: "Atendeter al paciente",
					text: "Esta seguro de atender al paciente?",
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Confirmar',
					cancelButtonText: 'Cancelar',
					cancelButtonColor: 'red'
				});

				if (value) {
					const { data } = await this.$axios.post('consultas/generarConsultaTriage', {
						admision_urgencia_id: item.id,
						afiliado_id: item.afiliado_id
					});

					await this.generarHistoria(data);
				}
			} catch (error) {
				this.$toast.error('Error al obtener la consulta');
			}
		},
		async atenderConsulta(item) {


			if (parseInt(item.estado_id) === 9) {
				await this.actualizarEstadoAdmision(item.id)
			}

			try {
				const { data } = await this.$axios.post('/consultas/obtenerConsultaTriage', {
					consulta_id: item.consulta.id
				});

				await this.generarHistoria(data);
			} catch (error) {
				this.$toast.error('Error al obtener la consulta');
			}
		},

		async generarHistoria(item) {
			this.datosGenerales = item;
			this.comp = 'HistoriaIntegral';
			this.$nextTick(() => {
				this.$refs.HistoriaIntegral.abrirDialog()
			});
			await this.listarAdmisionesUrgencias();
		},

		cerrarHistoria() {
			this.comp = null;
			this.listarAdmisionesUrgencias()
			this.$emit("actualizarContadores");
		},

		colorTriage(item) {
			if (item) {
				const color = {
					'TRIAGE I': 'error white--text',
					'TRIAGE II': 'warning white--text',
					'TRIAGE III': 'yellow black--text',
					'TRIAGE IV': 'success white--text',
					'TRIAGE V': 'primary white--text'
				};
				return item.historia_clinica ? color[item.historia_clinica.triage] || 'gray white--text' : 'gray white--text';
			}
		},

		colorEstadoTriage(estadoId) {
			switch (estadoId) {
				case 1:
					return 'success white--text';
				case 7:
					return 'warning white--text';
				case 9:
					return 'error white--text';
			}
		},

		async print(pdf) {
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

		async printAnexo(pdf) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				consulta: pdf.consulta.id,
				tipo: 'anexo2',
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
				// this.setPreload(false)
			}).catch(err => {
				this.setPreload(false);
			})
		},

		async printCertificado(pdf) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				id: pdf.id,
				tipo: 'CertificadoTriage',
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

		async printCertificadoAtencion(pdf) {
			this.setPreload(true)
			await this.$axios.post('pdf', {
				consulta: pdf.consulta.id,
				tipo: 'CertificadoMedimas',
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

		async actualizarEstadoAdmision(item) {
			this.setPreload(true);
			try {
				await this.$axios.post('admisiones/actualizarEstadoAdmision', {
					id: item
				});
			} catch (error) {
				this.$toast.error('Error al actualizar');
			} finally {
				this.setPreload(false);
			}
		}

	}
}

</script>
