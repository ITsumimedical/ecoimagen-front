<template>
	<v-dialog v-model="mostrarModalEditarTarifa" persistent max-width="900px" scrollable>
		<v-card>
			<v-alert dense text border="left" color="primary" icon="mdi-pencil">
				<b>Editar Tarifa {{ ` - Tarifa N° ${tarifaSeleccionada?.id}` }} </b>
			</v-alert>
			<v-card-text>
				<v-form ref="formEditarTarifa" v-if="tarifaActual" class="mt-2">
					<v-row dense>
						<v-col cols="12" sm="12" md="12">
							<v-text-field dense outlined readonly label="Sede"
										  :value="tarifaActual?.rep?.nombre"/>
						</v-col>
						<v-col cols="12" sm="12" md="12">
							<v-autocomplete dense outlined label="Manual Tarifario *"
											v-model="tarifaActual.manual_tarifario_id"
											:items="opcionesManualesTarifarios" item-text="nombre" item-value="id"
											:loading="loading.opcionesManualesTarifarios"
											:rules="[rules.obligatorio]"/>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
				<v-btn color="success" small @click="enviarFormulario">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import {mapActions} from "vuex";

export default {
	props: {
		mostrarModalEditarTarifa: {
			type: Boolean,
			default: false
		},
		tarifaSeleccionada: {
			type: Object,
			default: () => {
			}
		}
	},
	data() {
		return {
			loading: {
				opcionesManualesTarifarios: false
			},
			opcionesManualesTarifarios: [],
			tarifaActual: null,
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
			}
		}
	},
	watch: {
		mostrarModalEditarTarifa(newValue) {
			if (newValue) {
				Promise.all([
					this.listarManualesTarifarios(),
					this.listarDetallesTarifa()
				]).catch(error => {
					console.log('Error al cargar los datos iniciales', {error});
				});
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.tarifaActual = null;
			this.$emit('update:mostrarModalEditarTarifa', false);
		},

		async listarDetallesTarifa() {
			try {
				this.setPreload(true);
				const response = await this.$axios.get(`/tarifas-contratos-medicamentos/listar-detalles-tarifa/${this.tarifaSeleccionada.id}`);
				this.tarifaActual = response.data;
			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los detalles de la tarifa');
			} finally {
				this.setPreload(false);
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
		},

		async enviarFormulario() {
			if (!this.$refs.formEditarTarifa.validate()) return;
			try {
				const data = {
					manual_tarifario_id: this.tarifaActual.manual_tarifario_id,
				};

				this.setPreload(true);

				await this.$axios.patch(`/tarifas-contratos-medicamentos/editar-tarifa/${this.tarifaActual.id}`, data);

				this.$toast.success('Tarifa actualizada correctamente');

				this.$emit('recargarDatos', {item: {id: this.tarifaActual.contrato_medicamentos_id}, value: true});

				this.cerrarModal();

			} catch (error) {
				this.$toast.error('Ocurrio un error al actualizar la tarifa');
			} finally {
				this.setPreload(false);
			}
		}

	}
}
</script>
