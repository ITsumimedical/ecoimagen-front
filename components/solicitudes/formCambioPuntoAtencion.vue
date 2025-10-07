<template>
	<div>
		<!-- Preload -->
		<div class="text-center">
			<v-dialog v-model="preload" persistent width="300">
				<v-card color="primary" dark>
					<v-card-text>
						Tranquilo procesamos tu solicitud !
						<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>
		</div>

		<!-- Formulario de Cambio de Punto de Atención -->
		<v-form ref="formCambioPuntoAtencion" @submit.prevent="enviarFormulario">
			<v-row dense>
				<v-col cols="12" sm="12" md="6">
					<v-text-field dense type="email" v-model="formCotizante.correo_cotizante"
						label="Correo Electrónico *" :rules="[
        () => !!formCotizante.correo_cotizante || 'Este campo es requerido',
        () => emailRegex.test(formCotizante.correo_cotizante) || 'Debe ser un correo electrónico válido'
      ]"></v-text-field>
				</v-col>
				<v-col cols="12" sm="12" md="6">
					<v-text-field dense v-model="formCotizante.telefono_cotizante" label="Celular *" :rules="[
                () =>
                  !!formCotizante.telefono_cotizante || 'Este campo es requerido',
              ]"></v-text-field>
				</v-col>
				<v-col v-if="[2, 4, 5].includes(afiliado.tipo_afiliado_id)" cols="12" sm="12" md="12">
					<v-file-input dense label="Copia su documento de identidad legible. *"
						v-model="formCambioAtencion.adjuntoDocumentoIdentidad" :rules="[
                () =>
                  !!formCambioAtencion.adjuntoDocumentoIdentidad ||
                  'Este campo es requerido',
              ]" accept=".jpg, .jpeg, .pdf, .png, .doc, .docx"></v-file-input>
				</v-col>
				<v-col v-if="[1, 3, 6].includes(afiliado.tipo_afiliado_id)" cols="12" sm="12" md="12">
					<v-file-input dense label="Copia del documento de identidad del beneficiario legible. *"
						v-model="formCambioAtencion.adjuntoDocumentoBeneficiario" :rules="[
                () =>
                  !!formCambioAtencion.adjuntoDocumentoBeneficiario ||
                  'Este campo es requerido',
              ]" accept=".jpg, .jpeg, .pdf, .png, .doc, .docx"></v-file-input>
				</v-col>
				<v-col v-if="[1, 3, 6].includes(afiliado.tipo_afiliado_id)" cols="12" sm="12" md="12">
					<v-file-input dense label="Copia del documento de identidad del cotizante legible. *"
						v-model="formCambioAtencion.adjuntoDocumentoCotizante" :rules="[
                () =>
                  !!formCambioAtencion.adjuntoDocumentoCotizante ||
                  'Este campo es requerido',
              ]" accept=".jpg, .jpeg, .pdf, .png, .doc, .docx"></v-file-input>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-file-input dense
						label="Formulario Único de Afiliación marcado en la opción Traslado, debidamente diligenciado y firmado por el cotizante. *"
						v-model="formCambioAtencion.adjuntoFormularioAfiliacion" :rules="[
                () =>
                  !!formCambioAtencion.adjuntoFormularioAfiliacion ||
                  'Este campo es requerido',
              ]" accept=".jpg, .jpeg, .pdf, .png, .doc, .docx"></v-file-input>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea dense auto-grow v-model="formCambioAtencion.observaciones" label="Observaciones *"
						:rules="[
                () =>
                  !!formCambioAtencion.observaciones || 'Este campo es requerido',
                () =>
                  formCambioAtencion.observaciones.length >= 10 ||
                  'Este campo debe tener al menos 10 caracteres',
              ]"></v-textarea>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-checkbox v-model="ley1581" color="info" dense
						label="Con el diligenciamiento de este formato autorizo expresamente el uso de mis datos personales según Ley 1581 de 2012.">
					</v-checkbox>
				</v-col>
				<v-col>
					<v-alert border="left" dense text color="blue-grey" icon="mdi-alert">
						Todos los campos marcados con * son obligatorios
					</v-alert>
				</v-col>
			</v-row>
			<v-col cols="12" sm="12" md="12" align="right">
				<v-spacer></v-spacer>
				<v-btn small @click="volver()" color="error">Volver</v-btn>
				<v-btn small color="success" type="submit">Enviar</v-btn>
			</v-col>
		</v-form>
	</div>
</template>

<script>
	export default {
		props: {
			afiliado: {
				type: Object,
				required: true,
			},
			tipoSolicitud: {
				type: Number,
				required: true,
			},
		},
		data() {
			return {
				preload: false,
				formCotizante: {
					correo_cotizante: "",
					telefono_cotizante: "",
				},
				formCambioAtencion: {
					observaciones: "",
					adjuntoDocumentoIdentidad: null,
					adjuntoDocumentoBeneficiario: null,
					adjuntoDocumentoCotizante: null,
					adjuntoFormularioAfiliacion: null,
				},
				ley1581: false,
				emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
			};
		},

		methods: {
			volver() {
				this.$emit("volver");
			},

			enviarFormulario() {
				if (!this.ley1581) {
					return this.$swal({
						type: "error",
						title: "¡Debe aceptar el uso de sus datos personales según Ley 1581 de 2012!",
					});
				}
				if (this.$refs.formCambioPuntoAtencion.validate()) {
					const formData = new FormData();

					// Datos necesarios para la radicación
					formData.append("afiliado_id", this.afiliado.id);
					formData.append("documento", this.afiliado.numero_documento);
					formData.append("descripcion", this.formCambioAtencion.observaciones);
					formData.append("solicitud_id", this.tipoSolicitud);
					formData.append("correo", this.formCotizante.correo_cotizante);
					formData.append("telefono", this.formCotizante.telefono_cotizante);
					formData.append("fecha_inicio", null);
					formData.append("fecha_final", null);

					// Adjuntos como array, agregando solo los que correspondan según el tipo_afiliado_id
					const adjuntos = [];

					if ([2, 4, 5].includes(this.afiliado.tipo_afiliado_id)) {
						adjuntos.push(this.formCambioAtencion.adjuntoDocumentoIdentidad);
					}

					if ([1, 3, 6].includes(this.afiliado.tipo_afiliado_id)) {
						adjuntos.push(this.formCambioAtencion.adjuntoDocumentoBeneficiario);
						adjuntos.push(this.formCambioAtencion.adjuntoDocumentoCotizante);
					}

					adjuntos.push(this.formCambioAtencion.adjuntoFormularioAfiliacion);

					adjuntos.forEach((adjunto) => {
						formData.append(`adjuntos[]`, adjunto);
					});

					this.preload = true;

					this.$axios
						.post("/radicacion-online/crearRadicacion", formData)
						.then(() => {
							this.$toast.success("Solicitud registrada con éxito");
							this.volver();
						})
						.catch((error) => {
							this.$toast.error("Ocurrió un error al registrar la solicitud");
							console.log(error);
						})
						.finally(() => {
							this.preload = false;
						});
				} else {
					this.$toast.error("Por favor, complete todos los campos");
				}
			},
		},
	};

</script>
