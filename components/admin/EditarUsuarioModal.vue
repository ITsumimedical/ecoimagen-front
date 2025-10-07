<template>
	<div>
		<v-dialog v-model="mostrarEditarModal" persistent max-width="1200px">
			<v-card>
				<v-alert text dense border="left" type="info" icon="mdi-account-edit">
					<b>Gestionar usuario</b>
				</v-alert>
				<v-card-text>
					<v-form ref="form" v-model="formValid">
						<v-container fluid>
							<v-row dense>
								<v-col cols="12" sm="4" md="4">
									<v-text-field v-model="usuario.nombre" :rules="rules.nombre" label="Nombre(s) *"
										required></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field v-model="usuario.apellido" :rules="rules.apellido"></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-select v-model="usuario.tipo_doc" :items="tiposDocumento"
										label="Tipo de documento *" :rules="rules.tipo_doc" required></v-select>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field v-model="usuario.documento" label="No. Documento *"
										:rules="rules.documento" required></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field v-model="usuario.email_recuperacion"
										label="Correo Electrónico Recuperación"></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field v-model="usuario.telefono_recuperacion"
										label="Teléfono Recuperación"></v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-alert text dense border="left" color="gray">
										<b>Cargo Actual:</b>
										<p>{{ usuario?.cargo?.nombre }}</p>
									</v-alert>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-autocomplete :items="listaCargos" v-model="nuevoCargo" :loading="loading.cargos"
										label="Cargo *" :search-input.sync="campoBusquedaCargo"
										no-data-text="Digite el nombre del cargo para buscar." item-text="nombre"
										item-value="id" :rules="rules.cargo" required></v-autocomplete>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-alert text dense border="left" color="gray">
										<b>Prestador Actual:</b>
										<p>{{ usuario?.rep?.nombre }}</p>
									</v-alert>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-autocomplete :items="listaReps" v-model="nuevoRep"
										label="Nit o Nombre de la sede del Prestador (Institución a la que pertenece el usuario)  *"
										:search-input.sync="campoBusquedaRep" :loading="loading.reps"
										no-data-text="Digite el nombre de la sede para buscar." item-text="nombre"
										item-value="id" :rules="rules.reps" required></v-autocomplete>
								</v-col>
							</v-row>

							<v-row dense>
								<v-col cols="12" sm="12" md="12">
									<v-alert text dense border="left" type="success" icon="mdi-account-cog">
										<b>Datos de ingreso a la plataforma</b>
									</v-alert>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-text-field v-model="usuario.email" label="Correo Electrônico *"
										:rules="rules.email" required></v-text-field>
								</v-col>
								<v-col cols="12" sm="6" md="6">
									<v-text-field :append-icon="shwoPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="rules.password"
										:type="shwoPassword ? 'text' : 'password'" v-model="password" label="Contraseña"
										@click:append="shwoPassword = !shwoPassword"></v-text-field>
								</v-col>
								<v-row dense>
									<v-col cols="12" sm="12" md="12" v-if="esPersonalMedico"
										class="d-flex align-center">
										<v-alert border="left" colored-border type="error" dense>
											<small>La Firma debe ser <b>Sin Fondo</b></small>
										</v-alert>
									</v-col>

									<v-col cols="12" sm="12" md="3">
										<v-checkbox v-model="esPersonalMedico" @click="consultarFirmaDoctor"
											label="¿El usuario es personal médico?"></v-checkbox>
									</v-col>
									<v-col cols="12" sm="12" md="2" v-if="esPersonalMedico">
										<v-text-field v-model="usuario.registro_medico"
											label="Registro Medico"></v-text-field>
									</v-col>
									<v-col cols="12" sm="12" md="3" v-if="esPersonalMedico">
										<v-file-input v-model="usuario.firma"
											placeholder="Adjunte la firma del usuario." label="Firma"
											accept=".jpg, .jpeg, .png" @change="onFileChange" :loading="loading.firma">
											<template v-slot:selection="{ text }">
												<v-chip small label color="primary">
													{{ text }}
												</v-chip>
											</template>
										</v-file-input>
									</v-col>

									<v-col cols="12" sm="12" md="2" class="d-flex justify-end" v-if="esPersonalMedico">
										<v-img :loading="loading.firma" v-if="previsualFirma" :src="previsualFirma"
											max-height="125" max-width="125"></v-img>
									</v-col>
								</v-row>
							</v-row>


						</v-container>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
					<v-btn color="success" small @click="submitForm">Guardar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	props: {
		mostrarEditarModal: Boolean,
		usuario: Object,
	},
	data() {
		return {
			previsualFirma: null,
			formValid: false,
			loading: {
				cargos: false,
				reps: false,
				firma: false,
			},
			shwoPassword: false,
			tiposDocumento: ["CC", "CE", "NIT", "PA"],
			campoBusquedaCargo: null,
			campoBusquedaRep: null,
			listaCargos: [],
			listaReps: [],
			rules: {
				nombre: [(v) => !!v || "El nombre es requerido"],
				apellido: [(v) => !!v || "El apellido es requerido"],
				tipo_doc: [(v) => !!v || "El tipo de documento es requerido"],
				documento: [(v) => !!v || "El número de documento es requerido"],
				email: [
					(v) => !!v || "El correo electrónico es requerido",
					(v) => /.+@.+\..+/.test(v) || "El correo electrónico debe ser válido",
				],
				password: [
				v => !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}$/.test(v) 
					|| "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un caracter especial",
				],
			},
			esPersonalMedico: false,
			password: null,
			nuevoCargo: null,
			nuevoRep: null,
		};
	},
	watch: {
		campoBusquedaCargo(newVal) {
			if (newVal && newVal.length === 4) {
				this.listarCargos();
			}
		},

		campoBusquedaRep(newVal) {
			if (newVal && newVal.length === 4) {
				this.listarReps();
			}
		},

		"usuario.firma"(newValue) {
			if (newValue) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.previsualFirma = e.target.result;
				};
				reader.readAsDataURL(newValue);
			} else {
				this.previsualFirma = null
			}
		}
	},

	methods: {
		cerrarModal() {
			this.$emit("update:mostrarEditarModal", false);
			this.$refs.form.reset();
			this.previsualFirma = null;
		},

		submitForm() {
			if (this.$refs.form.validate()) {
				this.actualizarUsuario();
			}
		},

		actualizarUsuario() {
			const usuarioActualizado = {
				...this.usuario,
				cargo_id: this.nuevoCargo || this.usuario.cargo.id,
				reps_id: this.nuevoRep || this.usuario.rep.id,
			};

			if (this.password) {
				usuarioActualizado.password = this.password;
			}

			this.$emit("actualizarUsuario", usuarioActualizado);
			this.cerrarModal();
		},

		listarCargos() {
			this.loading.cargos = true;
			this.$axios
				.get(`/cargo/listar`, {
					params: {
						campoBusqueda: this.campoBusquedaCargo,
					},
				})
				.then((res) => {
					this.listaCargos = res.data.data;
				})
				.catch((error) => {
					this.$toast.error("Ocurrió un error al cargar los cargos");
					console.log(error);
				})
				.finally(() => {
					this.loading.cargos = false;
				});
		},

		listarReps() {
			this.loading.reps = true;
			this.$axios
				.get(`/reps/buscarRep/${this.campoBusquedaRep}`)
				.then((res) => {
					this.listaReps = res.data.map((rep) => {
						return {
							id: rep.id,
							nombre: `${rep.nombre} - ${rep.codigo_habilitacion_completo}`,
						};
					});
				})
				.catch((error) => {
					this.$toast.error("Ocurrió un error al cargar los reps");
					console.log(error);
				})
				.finally(() => {
					this.loading.reps = false;
				});
		},

		onFileChange() {
			if (this.usuario.firma) {
				const file = this.usuario.firma;
				const reader = new FileReader();
				reader.onload = (e) => {
					const base64Image = e.target.result;
					this.previsualFirma = base64Image;
				};
				reader.readAsDataURL(file);
			} else {
				console.error("No se ha seleccionado un archivo válido.");
			}
		},

		async consultarFirmaDoctor() {
			if(!this.usuario.registro_medico){
				return;
			}
			try {

				this.loading.firma = true;
				const usuario = this.usuario;
				const response = await this.$axios.post('usuarios/consultarImagen/' + usuario.id);
				this.previsualFirma = `data:image/png;base64,${response.data}`;
			} catch (error) {
				this.$toast.error('Ha ocurrido un error al Ver la Firma del Usuario');
			} finally {
				this.loading.firma = false;
			}
		}
	},
};
</script>
