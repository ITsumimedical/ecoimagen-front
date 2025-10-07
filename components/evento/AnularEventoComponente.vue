<template>
	<div>
		<v-alert icon="mdi-close-octagon" color="red" text border="left" dense>
			Proceso de <b>cierre</b>
		</v-alert>
		<v-container fluid>
			<v-row dense>
				<v-col cols="12" sm="6" md="8">
					<v-select dense :error-messages="errors.motivo_anulacion_id"
						v-model="eventoAdverso.motivo_anulacion_id" :items="eventos" label="Motivo"
						item-text="nombre" item-value="id">
					</v-select>
				</v-col>
				<v-col cols="12" sm="6" md="4"
					v-if="eventoAdverso.motivo_anulacion_id === 4 || eventoAdverso.motivo_anulacion_id === 5 || eventoAdverso.motivo_anulacion_id === 6 || eventoAdverso.motivo_anulacion_id === 7">
					<v-select dense v-model="eventoAdverso.clasificacion_anulacion" :items="['Evento adverso prevenible', 'Evento adverso no prevenible', 'Incidente',
          'Complicación', 'Indicio atención insegura']" label="Clasificación"
						:error-messages="errors.clasificacion_anulacion">
					</v-select>
				</v-col>
				<v-col cols="12" sm="12" md="12" v-if="eventoAdverso.motivo_anulacion_id == 7 || eventoAdverso.motivo_anulacion_id == 6 || eventoAdverso.motivo_anulacion_id == 5">
					<v-textarea auto-grow dense v-model="eventoAdverso.otros_motivo_anulacion"
						:error-messages="errors.otros_motivo_anulacion" label="Describa el motivo del cierre">
					</v-textarea>
				</v-col>
				<v-col cols="12" sm="6" md="4">
					<v-switch dense v-model="eventoAdverso.voluntariedad" label="Voluntariedad">
					</v-switch>
				</v-col>
			</v-row>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small color="warning" dark @click="actualizarAnalisis()">
					Cerrar
					<v-icon dark right>
						mdi-check-circle-outline
					</v-icon>
				</v-btn>
				<v-btn color="red" @click="cerrar()" small dark>Salir<v-icon right>mdi-close</v-icon></v-btn>
			</v-card-actions>
		</v-container>
	</div>
</template>

<script>
	import {
		mapActions
	} from "vuex"
	export default {
		name: 'WorkspaceJsonAnularEventoComponente',

		data() {
			return {
				eventos: [],
				errors: {
					motivo_anulacion_id: '',
					clasificacion_anulacion: '',
					otros_motivo_anulacion: '',
				},
				gestionEvento: {
					evento_adverso_id: '',
					user_id: '',
					accion: '',
					motivo: '',
				},
			};
		},

		mounted() {
			this.listarMotivosAnulacion();
		},

		props: {
			eventoAdverso: Object,
		},

		methods: {
			...mapActions("app", ["setPreload"]),

			actualizarAnalisis() {
				this.setPreload(true);
				this.eventoAdverso.estado_id = 5
				this.$axios.put('/eventos-adversos/' + this.eventoAdverso.id, this.eventoAdverso).then(res => {
					this.guardarGestionEvento();
					this.$emit('anulado')
					this.dialog = false
				}).catch(
					error => {
						if (error.response.data.mensaje) {
							this.$toast.error(error.response.data.mensaje)
						} else if (error.response.data) {
							this.ErrorEntrada(error.response.data)
						}
					},
				).finally(() => {
					this.setPreload(false)
				})

				// this.listarEventos()
				this.limpiarError()
			},

			guardarGestionEvento() {
				this.gestionEvento.evento_adverso_id = this.eventoAdverso.id
				this.gestionEvento.user_id = this.$store.state.auth.usuario.id
				this.gestionEvento.accion = "Anulación"
				this.gestionEvento.motivo = "Anuló evento"
				this.gestionEvento.motivo_anulacion_id = this.eventoAdverso.motivo_anulacion_id
				this.$axios.post('/gestion-eventos/crear', this.gestionEvento).then(res => {
					this.$toast.success('Registro de gestión almacenado')
				})
			},

			// listarEventos() {
			// 	this.setPreload(true);
			// 	this.$axios.post('/eventos-adversos/listar').then(res => {
			// 		this.eventosAdversos = res.data.data
			// 	}).catch(e => {
			// 		console.log(e.response.data);
			// 	}).finally(() => {
			// 		this.setPreload(false)
			// 	})
			// },

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

			listarMotivosAnulacion() {
				this.$axios.get('/motivos-anulacion-eventos/listar').then(res => {
					this.eventos = res.data.data;
				})
			},

			cerrar() {
				this.eventoAdverso.motivo_anulacion_id = '',
				this.eventoAdverso.clasificacion_anulacion = '',
				this.eventoAdverso.otros_motivo_anulacion = '',
				this.eventoAdverso.voluntariedad = ''
				this.$emit('cerrarDialog')
			}

		},
	};

</script>
