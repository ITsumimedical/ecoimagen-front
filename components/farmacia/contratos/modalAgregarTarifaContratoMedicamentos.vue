<template>
	<v-dialog v-model="mostrarModalAgregarTarifaContrato" persistent max-width="900px" scrollable>
		<v-card>
			<v-alert dense text border="left" color="primary" icon="mdi-text-box-plus-outline" class="text-center">
				<b>Agregar Tarifa{{ ` - Contrato N° ${contratoSeleccionado?.id}` }}</b>
			</v-alert>
			<v-card-text>
				<v-form ref="formAgregarTarifa" class="mt-2">
					<v-row dense>
						<v-col cols="12" sm="12" md="12">
							<v-autocomplete dense outlined label="Sede *" v-model="formTarifa.rep_id"
											:items="opcionesReps" item-text="nombre" item-value="id"
											:loading="loading.opcionesReps" :rules="[rules.obligatorio]"/>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-autocomplete dense outlined label="Manual Tarifario *"
											v-model="formTarifa.manual_tarifario_id"
											:items="opcionesManualesTarifarios" item-text="nombre" item-value="id"
											:loading="loading.opcionesManualesTarifarios" :rules="[rules.obligatorio]"/>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
				<v-btn small dark color="success" @click="enviarFormulario">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import {mapActions} from "vuex";

export default {
	props: {
		mostrarModalAgregarTarifaContrato: {
			type: Boolean,
			default: false
		},
		contratoSeleccionado: {
			type: Object,
			default: () => {
			}
		}
	},
	data() {
		return {
			loading: {
				opcionesReps: false,
				opcionesManualesTarifarios: false
			},
			formTarifa: {
				rep_id: null,
				manual_tarifario_id: null,
			},
			opcionesReps: [],
			opcionesManualesTarifarios: [],
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
			}
		}
	},
	watch: {
		mostrarModalAgregarTarifaContrato(newValue) {
			if (newValue) {
				Promise.all([
					this.listarRepsPorPrestador(),
					this.listarManualesTarifarios(),
				]).catch(error => {
					console.log('Error al cargar los datos iniciales', {error});
				})
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.limpiarFormulario();
			this.$emit('update:mostrarModalAgregarTarifaContrato', false)
		},

		limpiarFormulario() {
			this.formTarifa = {
				rep_id: null,
				manual_tarifario_id: null
			};
			this.$refs.formAgregarTarifa.resetValidation();
		},

		async enviarFormulario() {
			if (!this.$refs.formAgregarTarifa.validate()) return;
			try {
				const data = {
					...this.formTarifa,
					contrato_medicamentos_id: this.contratoSeleccionado.id
				};
				this.setPreload(true);
				await this.$axios.post('/tarifas-contratos-medicamentos/crear-tarifa', data);

				this.$toast.success('Tarifa agregada correctamente');

				this.$emit('recargarDatos');

				this.cerrarModal();

			} catch (error) {
				this.$toast.error('Ocurrió un error al agregar la tarifa');
			} finally {
				this.setPreload(false);
			}
		},

		async listarRepsPorPrestador() {
			try {
				this.loading.opcionesReps = true;
				const response = await this.$axios.get(`/reps/listar-por-prestador/${this.contratoSeleccionado.prestador_id}`);
				this.opcionesReps = response.data;
			} catch (error) {
				this.$toast.error('Ocurrió un erro al listar las sedes');
			} finally {
				this.loading.opcionesReps = false;
			}
		},

		async listarManualesTarifarios() {
			try {
				this.loading.opcionesManualesTarifarios = true;
				const response = await this.$axios.get('/manual-tarifario');
				this.opcionesManualesTarifarios = response.data;
			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los manuales de tarifarios');
			} finally {
				this.loading.opcionesManualesTarifarios = false;
			}
		}
	}
}
</script>

