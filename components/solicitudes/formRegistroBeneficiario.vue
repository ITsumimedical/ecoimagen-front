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

		<!-- Formulario de Registro de Beneficiario -->
		<v-form ref="formRegistroBeneficiario" @submit.prevent="enviarFormulario">
			<v-row dense>
				<v-col cols="12" sm="12" md="12">
					<v-select dense outlined :items="opcionesTipoBeneficiario" item-text="nombre" item-value="id"
						v-model="tipoBeneficiario" label="Tipo de Beneficiario a Registrar"
						@change="actualizarAdjuntosRequeridos">
					</v-select>
				</v-col>

				<v-col cols="12" sm="12" md="12" v-if="tipoBeneficiario">
					<v-alert border="left" dense text color="warning" icon="mdi-message-alert-outline">
						Señor usuario, puede descargar el Formato de Afiliación y Novedades
						haciendo click
						<b style="cursor: pointer; text-decoration: underline" @click="descargarFormato()">aquí</b>
					</v-alert>
				</v-col>

				<!-- Mostrar los campos del formulario solo si tipoBeneficiario está seleccionado -->
				<template v-if="tipoBeneficiario">
					<v-col cols="12" sm="12" md="6">
						<v-text-field dense type="email" v-model="formCotizante.correo_cotizante"
							label="Correo Electrónico *" :rules="[
                  () =>
                    !!formCotizante.correo_cotizante || 'Este campo es requerido',
                  () =>
                    emailRegex.test(formCotizante.correo_cotizante) ||
                    'Debe ser un correo electrónico válido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-text-field dense v-model="formCotizante.telefono_cotizante" label="Celular *" :rules="[
                  () =>
                    !!formCotizante.telefono_cotizante ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>

					<v-col cols="12" sm="12" md="4" v-for="(adjunto, index) in adjuntosRequeridos" :key="index">
						<v-file-input :label="`${adjunto.label} *`" v-model="adjunto.archivo"
							:rules="[() => !!adjunto.archivo || 'Este archivo es requerido']" accept=".pdf" dense>
						</v-file-input>
					</v-col>

					<v-col cols="12" sm="12" md="4">
						<v-autocomplete dense :loading="loading.tipoDocumento" :items="opcionesTipoDocumento"
							item-text="nombre" item-value="id" v-model="formBeneficiario.tipo_documento"
							label="Tipo de Documento *" :rules="[
                  () =>
                    !!formBeneficiario.tipo_documento ||
                    'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.numero_documento" label="N° de Documento *"
							:rules="[
                  () =>
                    !!formBeneficiario.numero_documento ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.primer_nombre" label="Primer Nombre *" :rules="[
                  () =>
                    !!formBeneficiario.primer_nombre || 'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.segundo_nombre" label="Segundo Nombre">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.primer_apellido" label="Primer Apellido *" :rules="[
                  () =>
                    !!formBeneficiario.primer_apellido ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.segundo_apellido" label="Segundo Apellido *"
							:rules="[
                  () =>
                    !!formBeneficiario.segundo_apellido ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-select dense v-model="formBeneficiario.sexo" :items="opcionesSexo" label="Sexo *" :rules="[
                  () => !!formBeneficiario.sexo || 'Este campo es requerido',
                ]"></v-select>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-menu dense v-model="menu" :close-on-content-click="false" :nudge-right="40"
							transition="scale-transition" offset-y min-width="auto">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field v-model="formBeneficiario.fecha_nacimiento" label="Fecha de Nacimiento *"
									prepend-icon="mdi-calendar" readonly dense v-bind="attrs" v-on="on" :rules="[
                      () =>
                        !!formBeneficiario.fecha_nacimiento ||
                        'Este campo es requerido',
                    ]"></v-text-field>
							</template>
							<v-date-picker v-model="formBeneficiario.fecha_nacimiento" @input="menu = false">
							</v-date-picker>
						</v-menu>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-autocomplete v-model="formBeneficiario.parentesco" dense :items="opcionesParentesco"
							label="Parentesco *" :rules="[
                  () =>
                    !!formBeneficiario.parentesco || 'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-autocomplete v-model="formBeneficiario.discapacidad" dense :items="opcionesDiscapacidad"
							label="Discapacidad *" :rules="[
                  () =>
                    !!formBeneficiario.discapacidad || 'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4" v-if="
                formBeneficiario.discapacidad !== 'SIN DISCAPACIDAD' &&
                formBeneficiario.discapacidad !== ''
              ">
						<v-autocomplete label="Grado de Discapacidad *" :items="opcionesGradoDiscapacidad" dense
							v-model="formBeneficiario.grado_discapacidad" :rules="[
                  () =>
                    !!formBeneficiario.grado_discapacidad ||
                    'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-autocomplete v-model="formBeneficiario.pais_id" :items="opcionesPaises"
							:loading="loading.paises" dense item-text="nombre" item-value="id" label="Nacionalidad *"
							:rules="[
                  () => !!formBeneficiario.pais_id || 'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4" v-if="formBeneficiario.pais_id === 42">
						<v-autocomplete v-model="formBeneficiario.departamento_id" :items="opcionesDepartamentos" dense
							item-text="nombre" :loading="loading.departamentos" item-value="id" label="Departamento *"
							@change="cargarMunicipios()" :rules="[
                  () =>
                    !!formBeneficiario.departamento_id ||
                    'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4" v-if="formBeneficiario.pais_id === 42">
						<v-autocomplete v-model="formBeneficiario.municipio_id" :items="opcionesMunicipiosFiltrados"
							dense item-text="nombre" item-value="id" label="Municipio *" :rules="[
                  () =>
                    !!formBeneficiario.municipio_id || 'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-autocomplete v-model="formBeneficiario.direccion_residencia_cargue"
							:items="opcionesDireccion" dense label="(Calle, Avenida, Carrera, etc) *" :rules="[
                  () =>
                    !!formBeneficiario.direccion_residencia_cargue ||
                    'Este campo es requerido',
                ]"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.direccion_residencia_numero_exterior"
							label="N° Exterior *" :rules="[
                  () =>
                    !!formBeneficiario.direccion_residencia_numero_exterior ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.direccion_residencia_primer_interior"
							label="Primer Número Interior *" :rules="[
                  () =>
                    !!formBeneficiario.direccion_residencia_primer_interior ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.direccion_residencia_segundo_interior"
							label="Segundo Número Interior *" :rules="[
                  () =>
                    !!formBeneficiario.direccion_residencia_segundo_interior ||
                    'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.direccion_residencia_interior" label="Interior">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.direccion_residencia_barrio" label="Barrio">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.telefono" label="Teléfono"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.celular1" label="Celular Principal *" :rules="[
                  () => !!formBeneficiario.celular1 || 'Este campo es requerido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.celular2" label="Celular Secundario">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.correo1" label="Correo Electrónico Principal *"
							:rules="[
                  () => !!formBeneficiario.correo1 || 'Este campo es requerido',
                  () =>
                    emailRegex.test(formBeneficiario.correo1) ||
                    'Debe ser un correo electrónico válido',
                ]"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="formBeneficiario.correo2" label="Correo Electrónico Secundario">
						</v-text-field>
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
				</template>
			</v-row>
			<v-col cols="12" sm="12" md="12" align="right" v-if="tipoBeneficiario">
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
				opcionesTipoBeneficiario: [{
						id: 1,
						nombre: "CÓNYUGUE DEL DOCENTE",
					},
					{
						id: 2,
						nombre: "COMPAÑERO(A) PERMANENTE DEL DOCENTE",
					},
					{
						id: 3,
						nombre: "HIJO MENOR DE 19 AÑOS",
					},
					{
						id: 4,
						nombre: "HIJO DE 19 A 25 AÑOS",
					},
					{
						id: 5,
						nombre: "HIJO CON INCAPACIDAD PERMANENTE MAYOR DE 18 AÑOS",
					},
					{
						id: 6,
						nombre: "NIETO 60 DÍAS",
					},
					{
						id: 7,
						nombre: "MENOR EN CUSTODIA",
					},
					{
						id: 8,
						nombre: "PADRES DEL DOCENTE",
					},
				],
				tipoBeneficiario: null,
				adjuntosRequeridos: [],
				adjuntos: [{
						id: 1,
						label: "Formato Integrado de Afiliación y Novedades.",
						archivo: null,
					},
					{
						id: 2,
						label: "Fotocopia legible del documento de identidad del Beneficiario.",
						archivo: null,
					},
					{
						id: 3,
						label: "Fotocopia legible del documento de identidad del Cotizante.",
						archivo: null,
					},
					{
						id: 4,
						label: "Original o Copia - Registro Civil de Matrimonio.",
						archivo: null,
					},
					{
						id: 5,
						label: "Declaración del beneficiario sobre condición de trabajo o dependencia económica y afiliación a seguridad social.",
						archivo: null,
					},
					{
						id: 6,
						label: "Declaración juramentada de convivencia con compañero permanente",
						archivo: null,
					},
					{
						id: 7,
						label: "Registro civil de nacimiento del beneficiario en donde conste el parentesco",
						archivo: null,
					},
					{
						id: 8,
						label: "Certificado de discapacidad por entidad competente.",
						archivo: null,
					},
					{
						id: 9,
						label: "Registro civil de nacimiento del Docente en donde conste el parentesco.",
						archivo: null,
					},
					{
						id: 10,
						label: "Acta de entrega de custodia al Cotizante docente emitida por autoridad competente (COMISARIA DE FAMILIA, ICBF O JUZGADO).",
						archivo: null,
					},
				],
				adjuntosPorTipoBeneficiario: {
					1: [1, 2, 3, 4, 5],
					2: [1, 2, 3, 5, 6],
					3: [1, 2, 7],
					4: [1, 2, 3, 5, 7],
					5: [1, 2, 3, 7, 8],
					6: [1, 2, 3, 5, 7],
					7: [1, 2, 5, 7, 10],
					8: [1, 2, 3, 5, 9],
				},
				formBeneficiario: {
					tipo_documento: "",
					numero_documento: "",
					primer_nombre: "",
					segundo_nombre: "",
					primer_apellido: "",
					segundo_apellido: "",
					sexo: "",
					fecha_nacimiento: "",
					parentesco: "",
					discapacidad: "",
					grado_discapacidad: "",
					pais_id: "",
					departamento_id: "",
					municipio_id: "",
					direccion_residencia_cargue: "",
					direccion_residencia_numero_exterior: "",
					direccion_residencia_primer_interior: "",
					direccion_residencia_segundo_interior: "",
					direccion_residencia_interior: "",
					direccion_residencia_barrio: "",
					telefono: "",
					celular1: "",
					celular2: "",
					correo1: "",
					correo2: "",
					tipo_beneficiario: null,
				},
				formCotizante: {
					correo_cotizante: "",
					telefono_cotizante: "",
				},
				loading: {
					tipoDocumento: false,
					paises: false,
					departamentos: false,
				},
				opcionesTipoDocumento: [],
				opcionesSexo: ["Masculino", "Femenino", "No especifica"],
				menu: false,
				opcionesParentesco: [
					"PADRE O MADRE",
					"CONYUGUE O COMPAÑERO",
					"HIJO DOCENTE",
					"HIJO DISCAPACITADO",
					"HIJO CONYUGE",
					"HIJO ADOPTIVO",
					"NIETO MENOR O IGUAL A 30 DÍAS",
					"PRIMO(A)",
					"TÍO(A)",
					"ABUELO(A)",
					"NO APLICA",
				],
				opcionesDiscapacidad: [
					"SIN DISCAPACIDAD",
					"FÍSICA",
					"AUDITIVA",
					"MENTAL/PSÍQUICA",
					"SORDO/CEGUERA",
					"VISUAL",
				],
				opcionesGradoDiscapacidad: ["LEVE", "MODERADO", "SEVERO"],
				opcionesPaises: [],
				opcionesDepartamentos: [],
				opcionesMunicipios: [],
				opcionesMunicipiosFiltrados: [],
				opcionesDireccion: [
					"CALLE",
					"AVENIDA",
					"CARRERA",
					"TRANSVERSAL",
					"AUTOPISTA",
					"VEREDA",
					"OTRA",
				],
				ley1581: false,
				preload: false,
				emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			};
		},

		created() {
			this.listarTiposDocumento();
			this.cargarPaises();
			this.cargarDepartamentos();
			this.cargarMunicipios();
		},

		methods: {
			listarTiposDocumento() {
				this.loading.tipoDocumento = true;
				this.$axios
					.get("/tipo-documento/listar")
					.then((res) => {
						this.opcionesTipoDocumento = res.data;
					})
					.catch((error) => {
						this.$toast.error(
							"Ocurrió un error al cargar los tipos de documentos."
						);
						console.log(error);
					})
					.finally(() => {
						this.loading.tipoDocumento = false;
					});
			},
			cargarDepartamentos() {
				this.loading.departamentos = true;
				this.$axios
					.get("departamento/")
					.then((res) => {
						this.opcionesDepartamentos = res.data;
					})
					.catch((e) => {
						this.$toast.error("Error al cargar departamentos");
						console.log(e);
					})
					.finally(() => {
						this.loading.departamentos = false;
					});
			},
			cargarMunicipios() {
				const departamento = this.opcionesDepartamentos.find(
					(dep) => dep.id === this.formBeneficiario.departamento_id
				);
				if (departamento) {
					this.opcionesMunicipiosFiltrados = departamento.municipios;
				} else {
					this.opcionesMunicipiosFiltrados = [];
				}
			},

			cargarPaises() {
				this.loading.paises = true;
				this.$axios
					.post("/pais/listar")
					.then((res) => {
						this.opcionesPaises = res.data;
					})
					.catch((error) => {
						this.$toast.error("Error al cargar paises");
						console.log(error);
					})
					.finally(() => {
						this.loading.paises = false;
					});
			},

			actualizarAdjuntosRequeridos() {
				const idsAdjuntos =
					this.adjuntosPorTipoBeneficiario[this.tipoBeneficiario] || [];
				this.adjuntosRequeridos = idsAdjuntos.map((id) => {
					const adjunto = this.adjuntos.find((adj) => adj.id === id);
					return {
						...adjunto,
						archivo: null,
					};
				});
				this.limpiarAdjuntos();
			},
			enviarFormulario() {
				if (!this.ley1581) {
					return this.$swal({
						type: "error",
						title: "¡Debe aceptar el uso de sus datos personales según Ley 1581 de 2012!",
					});
				}
				if (this.$refs.formRegistroBeneficiario.validate()) {
					this.formBeneficiario.tipo_beneficiario = this.tipoBeneficiario;

					const formData = new FormData();

					// Datos necesarios para la radicación
					formData.append("afiliado_id", this.afiliado.id);
					formData.append("documento", this.afiliado.numero_documento);
					formData.append("descripcion", "Solicitud de Registro de Beneficiario");
					formData.append("solicitud_id", this.tipoSolicitud);
					formData.append("correo", this.formCotizante.correo_cotizante);
					formData.append("telefono", this.formCotizante.telefono_cotizante);
					formData.append("fecha_inicio", null);
					formData.append("fecha_final", null);

					// Añadir campos del formulario
					for (const key in this.formBeneficiario) {
						formData.append(key, this.formBeneficiario[key]);
					}

					// Crear un array de archivos adjuntos
					const archivosAdjuntos = [];
					this.adjuntosRequeridos.forEach((adjunto) => {
						if (adjunto.archivo) {
							archivosAdjuntos.push(adjunto.archivo);
						}
					});

					archivosAdjuntos.forEach((element) => {
						formData.append("adjuntos[]", element);
					});

					this.preload = true;
					this.$axios
						.post("/radicacion-online/crearRadicacion", formData)
						.then((res) => {
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
					this.$toast.error("Por favor, llene todos los campos obligatorios");
				}
			},
			limpiarAdjuntos() {
				this.adjuntosRequeridos.forEach((adjunto) => {
					adjunto.archivo = null;
				});
			},

			volver() {
				this.$emit("volver");
			},

			descargarFormato() {
				const link = document.createElement("a");
				link.href = "/FormatoIntegradoAfiliacionesNovedades.pdf";
				link.download = "FormatoIntegradoAfiliacionesNovedades.pdf";
				link.click();
			},
		},
	};

</script>
