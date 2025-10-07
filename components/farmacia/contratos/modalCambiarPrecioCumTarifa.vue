<template>
	<v-dialog v-model="mostrarModalCambiarPrecio" persistent max-width="500px" scrollable>
		<v-card>
			<v-alert dense text border="left" color="primary" icon="mdi-currency-usd" class="text-center">
				<b>Cambiar precio</b>
			</v-alert>
			<v-card-text>
				<v-form ref="formCambiarPrecio">
					<v-col cols="12" sm="12" md="12">
						<v-text-field dense outlined prefix="$" label="Precio *" type="number"
									  v-model="cumTarifaActual.precio" :rules="[rules.obligatorio, rules.noNegativo]"/>
					</v-col>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn small color="error" dark @click="cerrarModal">Cerrar</v-btn>
				<v-btn small color="success" dark @click="enviarFormulario">Guardar</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
	props: {
		mostrarModalCambiarPrecio: {
			type: Boolean,
			default: false
		},
		cumTarifaSeleccionado: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			cumTarifaActual: {},
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
				noNegativo: v => v >= 0 || 'Este campo no puede ser negativo.'
			}
		};
	},
	watch: {
		cumTarifaSeleccionado: {
			handler(newVal) {
				this.cumTarifaActual = {...newVal};
			},
			immediate: true
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.cumTarifaActual = {};
			this.$refs.formCambiarPrecio.resetValidation();
			this.$emit('update:mostrarModalCambiarPrecio', false);
		},

		async enviarFormulario() {
			if (!this.$refs.formCambiarPrecio.validate()) return;
			try {

				this.setPreload(true);

				await this.$axios.patch(`/tarifas-cums/cambiar-precio-cum-tarifa/${this.cumTarifaActual.id}`, {
					precio: this.cumTarifaActual.precio
				});

				this.$toast.success('Precio cambiado correctamente');

				this.$emit('recargarDatos');

				this.cerrarModal();

			} catch (error) {
				this.$toast.error('Ocurrió un error al cambiar el precio');
			} finally {
				this.setPreload(false);
			}
		}
	}
};
</script>
