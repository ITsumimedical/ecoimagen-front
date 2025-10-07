<template>
	<div>

		<v-dialog v-model="mostrarModalCargueMasivoCums" persistent max-width="900px">
			<v-card>
				<v-alert dense text border="left" color="primary" icon="mdi-folder-multiple-plus-outline"
						 class="text-center">
					<b>
						Cargue Masivo de CUM's para la Tarifa N° {{ tarifaSeleccionada?.id }}
					</b>
				</v-alert>
				<v-card-text>
					<v-form ref="formCargueMasivoCums" class="mt-2">
						<v-row dense>
							<v-col cols="12" sm="12" md="12">
								<v-alert
									text
									dense
									border="left"
									color="blue-grey"
									icon="mdi-information-box-outline"
								>
									<b>IMPORTANTE:</b> Es indispensable utilizar el formato
									proporcionado para garantizar la correcta carga de datos. Puede
									descargar el formato
									<b style="
											cursor: pointer;
											text-decoration: underline;
											color: blue;
										  "
									   @click="descargarFormato()"
									>aquí</b>.
								</v-alert>
							</v-col>
							<v-col cols="12" sm="12" md="12">
								<v-file-input dense outlined label="Adjunte el Formato *" v-model="adjunto"
											  accept=".xls, .xlsx"
											  :rules="[rules.obligatorio, rules.maxSize]"/>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn small dark color="error" @click="cerrarModal">Salir</v-btn>
					<v-btn small dark color="success" @click="enviarFormulario">Enviar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<modal-errores-cargue-masivo :mostrar-modal-errores-cargue-masivo.sync="mostrarModalErroresCargueMasivo"
									 :errores="errores"/>
	</div>
</template>
<script>
import {mapActions} from "vuex";
import ModalErroresCargueMasivo from "~/components/farmacia/contratos/modalErroresCargueMasivo.vue";

export default {
	components: {ModalErroresCargueMasivo},
	props: {
		mostrarModalCargueMasivoCums: {
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
			adjunto: null,
			rules: {
				obligatorio: v => !!v || 'Este campo es obligatorio.',
				maxSize: v => !v || (v.size <= 50 * 1024 * 1024) || 'El tamaño del archivo no debe superar los 50MB.'
			},
			mostrarModalErroresCargueMasivo: false,
			errores: [],
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		cerrarModal() {
			this.adjunto = null;
			this.$refs.formCargueMasivoCums.resetValidation();
			this.$emit('update:mostrarModalCargueMasivoCums', false);
		},

		async descargarFormato() {
			try {
				const data = {
					nombre_archivo: 'formato_cargue_masivo_cums.xlsx',
					nombre_carpeta: 'estaticos',
					disco: 'server37',
					tiempo: 5
				};

				this.setPreload(true);

				const urlDescarga = await this.$axios.post('/adjuntos/generar-url-descarga-s3', data);


				window.open(urlDescarga.data, "_blank");

			} catch (error) {
				this.$toast.error('Ocurrió un error al descargar el formato');
			} finally {
				this.setPreload(false);
			}
		},

		async enviarFormulario() {
			if (!this.$refs.formCargueMasivoCums.validate()) return;
			try {
				const formData = new FormData();

				formData.append('adjunto', this.adjunto);
				formData.append('tarifa_id', this.tarifaSeleccionada.id);

				this.setPreload(true);

				const response = await this.$axios.post('/tarifas-cums/cargue-masivo-cums-tarifa', formData);

				this.$toast.success(response.data.mensaje);

				this.cerrarModal();

			} catch (error) {
				if (error.response && error.response.data.error) {
					try {
						const errores = JSON.parse(error.response.data.error);

						if (errores.length > 0) {
							this.abrirModalErrores(errores);
						}

					} catch (parseError) {
						console.error("Error al parsear los errores del servidor:", parseError);
						this.$toast.error('Ocurrió un error inesperado al procesar los errores.');
					}
				} else {
					this.$toast.error('Ocurrió un error al cargar los datos');
				}
			} finally {
				this.setPreload(false);
			}
		},

		abrirModalErrores(errores) {
			this.mostrarModalErroresCargueMasivo = true;
			this.errores = errores;
		}

	}
}
</script>
