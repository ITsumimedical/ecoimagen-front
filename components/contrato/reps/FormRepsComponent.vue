<template>
	<v-card>
		<v-alert dense text border="left" type="info">
			{{ editar ? "Actualizar" : "Creación" }} sede
		</v-alert>
		<form @submit.prevent="submit">
			<v-card-text>
				<v-row dense>
					<v-col cols="12" sm="6" md="4">
						<v-text-field dense v-model="form.nombre" label="Nombre *"
							:error-messages="errors.nombre"></v-text-field>
					</v-col>
					<v-col cols="12" sm="6" md="4">
						<v-autocomplete dense v-model="form.municipio_id" :items="municipios" item-text="nombre"
							item-value="id" label="Municipio *" :error-messages="errors.municipio_id"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="6" md="4">
						<v-autocomplete dense v-model="form.tipo_zona" :items="['Rural', 'Urbana']" item-text="nombre"
							label="Zona" :error-messages="errors.tipo_zona"></v-autocomplete>
					</v-col>
					<v-col cols="12" sm="6" md="2">
						<v-autocomplete dense v-model="form.sede_principal"
							:items="[{ value: 1, nombre: 'Si' }, { value: 0, nombre: 'No' }]" item-text="nombre"
							item-value="value" label="Sede principal" :error-messages="errors.sede_principal">
						</v-autocomplete>
					</v-col>
					<v-col cols="12" sm="12" md="6">
						<v-text-field dense v-model="form.direccion" label="Dirección *"
							:error-messages="errors.direccion">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="form.correo1" type="email" label="Correo 1 *"
							:error-messages="errors.correo1">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="form.correo2" type="email" label="Correo 2"
							:error-messages="errors.correo2">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="form.telefono1" label="Telefono 1 *" type="number"
							:error-messages="errors.telefono1"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="4">
						<v-text-field dense v-model="form.telefono2" label="Telefono 2" type="number"
							:error-messages="errors.telefono2">
						</v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="2">
						<v-text-field dense v-model.number="form.nivel_atencion" type="number" label="Nivel atencion *"
							:error-messages="errors.nivel_atencion"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="7">
						<v-text-field dense v-model="form.codigo_habilitacion" label="Codigo habilitación *"
							:error-messages="errors.codigo_habilitacion"></v-text-field>
					</v-col>
					<v-col cols="12" sm="12" md="3">
						<v-text-field dense v-model="form.numero_sede" label="Numero de sede *"
							:error-messages="errors.numero_sede">
						</v-text-field>
					</v-col>

					<v-col cols="12" sm="12" md="12" v-if="this.imagenes" class="d-flex align-center">
						<v-alert border="left" colored-border type="error" dense v-if="this.imagenes">
							<small>La Imagen debe ser <b>Sin Fondo</b></small>
						</v-alert>
					</v-col>

					<v-col cols="12" sm="6" md="2">
						<v-checkbox dense v-model="form.propia" label="Propia"></v-checkbox>
					</v-col>
					<v-col cols="12" sm="6" md="2">
						<v-checkbox dense v-model="form.ips_primaria" label="IPS primaria"></v-checkbox>
					</v-col>

					<v-col cols="12" sm="6" md="6">
						<v-file-input type="file" label="Selecciona una imagen" v-model="imagenes"
							prepend-icon="mdi-camera" @change="onFileChange"></v-file-input>
						<v-img v-if="imagenPreview" :src="imagenPreview" max-height="125" max-width="125"></v-img>
					</v-col>

				</v-row>
			</v-card-text>
			<v-card-actions class="justify-end">
				<v-btn small color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
				<v-btn small color="boton" dark type="submit">{{
					editar ? "Editar" : "Crear"
				}}
				</v-btn>
			</v-card-actions>
		</form>
	</v-card>
</template>
<script>
export default {
	middleware({
		$can,
		redirect
	}) {
		if (!$can('contrato.reps.vista')) {
			return redirect('/');
		}
	},
	name: "FormRep",

	props: {
		editar: {
			type: Boolean,
			default: false,
		},
		rep_id: {
			type: Number,
			default: null,
		},
		prestador_id: {
			type: Number,
			default: null,
		}
	},

	watch: {
		rep_id() {
			if (this.editar) {
				this.getReps();
			}
		},

		imagenes(newValue) {
			if (newValue && newValue.length > 0) {
				const file = newValue[0];
				const reader = new FileReader();
				reader.onload = (e) => {
					this.imagenPreview = e.target.result;
				};
				reader.readAsDataURL(file);
			} else {
				this.imagenPreview = '';
			}
		},

	},


	data() {
		return {
			imagenes: [],
			imagenPreview: null,
			form: {
				nombre: null,
				direccion: null,
				correo1: null,
				correo2: null,
				telefono1: null,
				telefono2: null,
				propia: false,
				codigo_habilitacion: null,
				nivel_atencion: null,
				prestador_id: null,
				municipio_id: null,
				tipo_zona: null,
				sede_principal: null,
				numero_sede: null,
				codigo: null,
				ips_primaria: false,
			},
			errors: {
				nombre: null,
				direccion: null,
				correo1: null,
				correo2: null,
				telefono1: null,
				telefono2: null,
				propia: '',
				codigo_habilitacion: null,
				nivel_atencion: null,
				prestador_id: null,
				municipio_id: null,
				tipo_zona: null,
				sede_principal: null,
				numero_sede: null,
				codigo: null,
				ips_primaria: '',
			},
			prestador: [],
			municipios: [],
		};
	},

	mounted() {
		this.getMunicipios();
		if (this.editar) {
			this.getReps();
		}
	},

	methods: {
		async submit() {
			this.limpiarError();
			try {
				if (this.editar) {
					const formData = new FormData();
					formData.append('nombre', this.form.nombre);
					formData.append('direccion', this.form.direccion);
					formData.append('correo1', this.form.correo1);
					formData.append('correo2', this.form.correo2);
					formData.append('telefono1', this.form.telefono1);
					formData.append('telefono2', this.form.telefono2);
					formData.append('propia', this.form.propia);
					formData.append('codigo_habilitacion', this.form.codigo_habilitacion);
					formData.append('nivel_atencion', this.form.nivel_atencion);
					formData.append('prestador_id', this.prestador_id);
					formData.append('municipio_id', this.form.municipio_id);
					formData.append('tipo_zona', this.form.tipo_zona);
					formData.append('sede_principal', this.form.sede_principal);
					formData.append('numero_sede', this.form.numero_sede);
					formData.append('codigo', this.form.codigo = this.form.codigo_habilitacion + this.form.numero_sede);
					formData.append('ips_primaria', this.form.ips_primaria);
					formData.append('imagenes[]', this.imagenes);

					await this.$axios.post(`/reps/actualizarRep/${this.rep_id}`, formData);
					this.$toast.success("Se ha actualizado el rep exitosamente!.");
				} else {
					const formData = new FormData();
					formData.append('nombre', this.form.nombre);
					formData.append('direccion', this.form.direccion);
					formData.append('correo1', this.form.correo1);
					formData.append('correo2', this.form.correo2);
					formData.append('telefono1', this.form.telefono1);
					formData.append('telefono2', this.form.telefono2);
					formData.append('propia', this.form.propia);
					formData.append('codigo_habilitacion', this.form.codigo_habilitacion);
					formData.append('nivel_atencion', this.form.nivel_atencion);
					formData.append('prestador_id', this.prestador_id);
					formData.append('municipio_id', this.form.municipio_id);
					formData.append('tipo_zona', this.form.tipo_zona);
					formData.append('sede_principal', this.form.sede_principal);
					formData.append('numero_sede', this.form.numero_sede);
					formData.append('codigo', this.form.codigo = this.form.codigo_habilitacion + this.form.numero_sede);
					formData.append('ips_primaria', this.form.ips_primaria);
					formData.append('imagenes[]', this.imagenes);

					await this.$axios.post("/reps", formData);
					this.$toast.success("Se ha creado el rep exitosamente.");
				}
				this.limpiar();
				this.$emit("cerrar");
				this.$emit("submit");
			} catch (error) {
				if (error.response.status === 422) {
					this.ErrorEntrada(error.response.data);
				}
				this.$toast.error("Problemas al guardar/actualizar el rep.");
			}
		},

		onFileChange() {
			if (this.imagenes) {
				const file = this.imagenes;
				const reader = new FileReader();
				reader.onload = (e) => {
					this.imagenPreview = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		},

		async getReps() {
			try {
				const response = await this.$axios.post("/reps/consultarRep/" + this.rep_id);

				const data = response.data.consulta[0];

				const imagen = response.data.imagen[0];
				this.form.nombre = data.nombre;
				this.form.nit = data.nit;
				this.form.direccion = data.direccion;
				this.form.correo1 = data.correo1;
				this.form.correo2 = data.correo2;
				this.form.telefono1 = data.telefono1;
				this.form.telefono2 = data.telefono2;
				this.form.propia = data.propia === true;
				this.form.ips_primaria = data.ips_primaria === true;
				this.form.codigo_habilitacion = data.codigo_habilitacion;
				this.form.nivel_atencion = data.nivel_atencion;
				this.form.prestador_id = data.prestador_id;
				this.form.municipio_id = parseInt(data.municipio_id);
				this.form.tipo_zona = data.tipo_zona;
				this.form.sede_principal = data.sede_principal;
				this.form.numero_sede = data.numero_sede;
				if (response.data.imagen[0]) {
					this.consultarImagen(imagen);
				}
			} catch (error) {
				this.$toast.error('Ha ocurrido un Error al consultar')
				// console.log(error.response);
			}
		},


		limpiar() {
			for (const prop of Object.getOwnPropertyNames(this.form)) {
				this.form[prop] = null;
			}
			this.imagenes = '',
				this.imagenPreview = '',
				this.limpiarError();
		},

		async getPrestador() {
			try {
				if (this.form.nombre_prestador.count() < 3) {
					return;
				}
				const request = {
					nombre_prestador: this.from.nombre_prestador
				}
				const response = await this.$axios.post("/prestador/listar", request);
				this.prestador = response.data.data;
			} catch (error) {
				this.$toast.error("Problemas al consultar los prestadores.");
			}
		},

		async getMunicipios() {
			try {
				const {
					data
				} = await this.$axios.get("/municipios/listar");
				this.municipios = data;
			} catch (error) {
				this.$toast.error("Problemas al consultar los municipios.");
			}
		},

		ErrorEntrada(errors) {
			for (const key in this.errors) {
				if (key in errors) {
					this.errors[key] = errors[key].join(",");
				}
			}
		},

		limpiarError() {
			for (const key in this.errors) {
				this.errors[key] = "";
			}
		},

		async consultarImagen(data) {
			try {
				if (data) {
					const ruta = data.url_imagen;
					console.log(ruta);

					let adj = await this.$adjuntos(ruta);

					let blob = new Blob([adj[1]], {
						type: adj[0]
					});
					const url = URL.createObjectURL(blob);
					const file = new File([blob], data.nombre, { type: adj[0] });
					this.imagenes = file;
					this.onFileChange();
				} else {
					console.error("El item no contiene adjuntos válidos.");
				}
			} catch (error) {
				this.$toast.error('Ha ocurrido un error al Ver los Adjuntos');
			}
		}


	},
};

</script>
