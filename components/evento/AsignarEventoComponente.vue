<template>
	<div>
		<v-card-title>
			<v-toolbar flat>
				<v-toolbar-title>
					<div class="d-flex align-center">
						<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
						<span>Proceso asignación evento adverso</span>
					</div>
				</v-toolbar-title>
				<v-divider class="mx-4" inset vertical></v-divider>
			</v-toolbar>
		</v-card-title>
		<v-container fluid>
			<v-row dense>
				<v-col cols="12" sm="6" md="4">
					<v-select dense v-model="eventoAdverso.priorizacion" outlined
						:items="['Prioritario', 'No prioritario', 'Muy prioritario', 'Urgente']" label="Priorización"
						:error-messages="errors.priorizacion">
					</v-select>
				</v-col>
				<v-col cols="12" sm="6" md="4">
					<v-select dense v-model="eventoAdverso.identificacion_riesgo" outlined
						:items="['Riesgo individual', 'Riesgo poblacional']" label="Identificación del riesgo"
						:error-messages="errors.identificacion_riesgo">
					</v-select>
				</v-col>
				<v-col cols="12" sm="6" md="4">
					<v-autocomplete dense outlined v-model="voluntariedad" label="Voluntariedad"
						:items="[{ text: 'Si', value: true }, { text: 'No', value: false }]">
					</v-autocomplete>
				</v-col>
				<v-col cols="12" sm="6" md="12">
					<v-autocomplete multiple :error-messages="errors.empleado_asignado" :items="listaEmpleados" chips
						small-chips item-text="nombre" item-value="id" deletable-chips outlined
						v-model="eventoAdverso.empleado_asignado" label="Empleado a asignar" dense>
					</v-autocomplete>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea rows="3" label="Motivo de asignación" outlined auto-grow
						v-model="eventoAdverso.motivo_asignacion"></v-textarea>
				</v-col>
			</v-row>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small color="boton" dark @click="actualizarAnalisis()">
					Asignar
					<v-icon dark right>
						mdi-send-variant
					</v-icon>
				</v-btn>
				<v-btn color="red" small dark @click="cerrar()">Cerrar<v-icon>mdi-close</v-icon></v-btn>
			</v-card-actions>
		</v-container>
	</div>
</template>

<script>
import {
	mapActions
} from "vuex"
export default {
	name: 'WorkspaceJsonAsignarEventoComponente',

	data() {
		return {
			errors: {
				priorizacion: '',
				identificacion_riesgo: '',
				empleado_asignado: '',
			},
			gestionEvento: {
				evento_adverso_id: '',
				user_id: '',
				accion: '',
				motivo: '',
			},
			listaEmpleados: [],
			nombre: '',
			priorizacion: '',
			voluntariedad: true
		};
	},

	mounted() {
		this.listarEmpleados()
	},

	props: {
		eventoAdverso: Object,
	},

	methods: {

		...mapActions("app", ["setPreload"]),

		actualizarAnalisis() {
			this.setPreload(true);
			this.$axios.post('/eventos-adversos/asignar-evento-adverso', {
				evento_adverso_id: this.eventoAdverso.id,
				user_id: this.eventoAdverso.empleado_asignado,
				motivo: this.eventoAdverso.motivo_asignacion,
				priorizacion: this.eventoAdverso.priorizacion,
				identificacion_riesgo: this.eventoAdverso.identificacion_riesgo,
				voluntariedad: this.voluntariedad
			}).then(res => {
				this.$emit('asignado')
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
				this.setPreload(false);
			});
			this.limpiarError()
		},


		listarEmpleados() {
			this.$axios.get('/operador/listarActivos').then(res => {
				this.listaEmpleados = res.data.map((empleado) => {
					return {
						id: empleado.user_id,
						nombre: `${empleado.documento} - ${empleado.nombre_completo}`
					}
				})
			}).catch(error => {
				this.$toast.error(error.response.data.mensaje)
			})
		},

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

		cerrar() {
			this.eventoAdverso = {
				priorizacion: '',
				identificacion_riesgo: '',
				voluntariedad: '',
				empleado_asignado: ''
			}
			this.$emit('cerrarDialog')
		}

	},
};

</script>
