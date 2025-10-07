<template>
	<div>
		<!-- preload -->
		<template>
			<div class="text-center">
				<v-dialog v-model="cargando" persistent width="300">
					<v-card color="primary" dark>
						<v-card-text>
							Tranquilo procesamos tu solicitud !
							<v-progress-linear
								indeterminate
								color="white"
								class="mb-0"
							></v-progress-linear>
						</v-card-text>
					</v-card>
				</v-dialog>
			</div>
		</template>
		<v-card>
			<v-card-title>
				<v-toolbar flat>
					<v-toolbar-title>
						<div class="d-flex align-center">
							<img
								src="/images/ojo.svg"
								alt=""
								height="50px"
								width="50px"
							/>
							<span>Clientes</span>
						</div>
					</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>
					<v-spacer></v-spacer>
					<v-btn
						color="success"
						small
						dark
						class="mb-2"
						@click="dialog = true"
					>
						Nuevo Cliente
					</v-btn>

					<v-form>
						<v-dialog v-model="dialog" max-width="400">
							<v-card>
								<v-alert
									text
									dense
									border="left"
									type="info"
									icon="mdi-plus"
								>
									<b>Crear Cliente </b>
								</v-alert>
								<v-card-text>
									<v-container>
										<v-form ref="crearClienteForm">
											<v-row>
												<v-col
													cols="12"
													sm="12"
													md="12"
												>
													<v-text-field
														dense
														outlined
														v-model="name"
														:rules="nameRules"
														label="Nombre"
														required
													></v-text-field>
												</v-col>
												<v-col
													cols="12"
													sm="12"
													md="12"
												>
													<v-text-field
														dense
														outlined
														v-model="
															formCliente.correo
														"
														:rules="emailRules"
														label="Correo"
														required
													>
													</v-text-field>
												</v-col>
											</v-row>
										</v-form>
									</v-container>
								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn small color="error" @click="close">
										Cancel
									</v-btn>
									<v-btn
										small
										color="success"
										@click="crearCliente()"
									>
										Guardar
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-form>
				</v-toolbar>
			</v-card-title>
			<v-card-text>
				<v-row dense>
					<v-col cols="12" sm="12" md="12">
						<v-text-field
							append-icon="mdi-magnify"
							v-model="search"
							dense
							outlined
							label="Buscar"
						></v-text-field>
					</v-col>
					<v-col cols="12" md="12" sm="12">
						<v-data-table
							:headers="headersClientes"
							:items="clientes"
							:search="search"
							:loading="loading.clientes"
							loading-text="Cargando Información..."
						>
							<template v-slot:item.actions="{ item }">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											small
											color="warning"
											class="mr-2"
											v-bind="attrs"
											v-on="on"
											@click="abrirModalActualizar(item)"
										>
											mdi-pencil
										</v-icon>
									</template>
									<span>Editar</span>
								</v-tooltip>
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											color="info"
											small
											dense
											v-bind="attrs"
											v-on="on"
											@click="cambiarEstado(item)"
										>
											mdi-account-lock-open
										</v-icon>
									</template>
									<span>Cambiar Estado</span>
								</v-tooltip>
							</template>
							<template v-slot:no-data> </template>
							<template v-slot:[`item.revoked`]="{ item }">
								<v-chip
									small
									class="ma-2"
									:color="
										item.revoked === false ? 'green' : 'red'
									"
									text-color="white"
								>
									{{
										item.revoked === false
											? "Activo"
											: "Inactivo"
									}}
								</v-chip>
							</template>
							<template v-slot:[`item.fecha_creacion`]="{ item }">
								{{
									$moment(item.created_at).format(
										"DD-MM-YYYY"
									)
								}}
							</template>
						</v-data-table>
					</v-col>
				</v-row>
			</v-card-text>
			<v-dialog v-model="editarModel" max-width="400">
				<v-card>
					<v-alert
						text
						dense
						border="left"
						type="info"
						:icon="false"
						class="text-center"
						icon="mdi-reload"
					>
						<b>Actualizar Cliente</b>
					</v-alert>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" sm="12" md="12">
									<v-text-field
										outlined
										dense
										v-model="datosCliente.name"
										label="Nombre"
										required
										:rules="nameRules"
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="12" md="12">
									<v-text-field
										outlined
										dense
										v-model="datosCliente.correo"
										label="Correo"
										required
										:rules="emailRules"
									>
									</v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn small color="error" @click="close">
							Cancel
						</v-btn>
						<v-btn
							small
							color="success"
							@click="actualizarCliente()"
						>
							Guardar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-card>
	</div>
</template>


<script>
export default {
	name: "SUMICliente",
	data() {
		return {
			cargando: false,
			valid: true,
			name: "",
			nameRules: [
				(v) => !!v || "El nombre es requerido*",
				(v) =>
					(v && v.length >= 4) ||
					"El nombre debe tener mas de 4 caracteres",
			],
			email: "",
			emailRules: [
				(v) => !!v || "El Correo es requerido*",
				(v) => /.+@.+\..+/.test(v) || "Correo Invalido*",
			],

			datosCliente: {},
			editarModel: false,
			search: null,
			formCliente: {
				name: null,
				correo: null,
			},
			clienteId: 1,
			nuevoEstado: "activo",
			nombreCliente: null,
			dialog: false,
			dialogDelete: false,
			loading: {
				clientes: false,
			},
			headersClientes: [
				{
					text: "ID",
					value: "id",
					align: "center",
				},
				{
					text: "Nombre",
					value: "name",
					align: "center",
				},
				{
					text: "Correo Electronico",
					value: "correo",
					align: "center",
				},
				{
					text: "Activo/Inactivo",
					value: "revoked",
					align: "center",
				},
				{
					text: "Fecha Creación",
					value: "fecha_creacion",
					align: "center",
				},
				{
					text: "Acciones",
					value: "actions",
					align: "center",
				},
			],
			clientes: [],
			defaultItem: {
				name: "",
				correo: "",
			},
		};
	},

	mounted() {
		this.listarClientes();
	},

	methods: {
		async sendEmail() {
			try {
				const response = await this.$axios.post("/enviar-email", {
					email: this.formCliente.correo,
				});
				console.log(response.data);
			} catch (error) {
				console.error("Error al enviar el correo:", error);
			}
		},
		validate() {
			this.$refs.form.validate();
		},

		abrirModalActualizar(item) {
			this.datosCliente = { ...item };
			this.editarModel = true;
		},

		async actualizarCliente() {
			try {
				const datos = {
					name: this.datosCliente.name,
					correo: this.datosCliente.correo,
				};
				this.cargando = true;
				await this.$axios.put(
					`/clientes/actualizar/${this.datosCliente.id}`,
					datos
				);
				this.$toast.success("Cliente actualizado exitosamente");
				this.listarClientes();
			} catch (error) {
				this.$toast.error("Ha ocurrido un Error al Actualizar");
			} finally {
				this.editarModel = false;
				this.cargando = false;
			}
		},

		resetValidations() {
			this.$refs.crearClienteForm.reset();
		},

		resetForm() {
			this.name = null;
			this.formCliente.correo = null;
			this.resetValidations();
		},

		async crearCliente() {
			if (!this.$refs.crearClienteForm.validate()) {
				this.$toast.error("Por favor complete los campos");
				return;
			}
			try {
				const data = {
					name: this.name,
					correo: this.formCliente.correo,
				};
				this.cargando = true;
				await this.$axios.post("/clientes/crearClientes", data);
				this.$toast.success("Cliente creado satisfactoriamente");
				this.dialog = false;
				this.resetForm();
			} catch (error) {
				console.log(error);
				this.$toast.error("Ocurrio un error");
			} finally {
				this.cargando = false;
				this.listarClientes();
			}
		},

		async listarClientes() {
			try {
				this.loading.clientes = true;
				const response = await this.$axios.get(
					"/clientes/listar-clientes"
				);
				this.clientes = response.data;
			} catch (error) {
				this.$toast.error("Ocurrio un error");
			} finally {
				this.loading.clientes = false;
			}
		},
		async cambiarEstado(item) {
			try {
				const response = await this.$swal({
					title: "Esta seguro?",
					text: "Esta accion cambia el estado del cliente",
					type: "warning",
					showConfirmButton: true,
					showCancelButton: true,
					cancelButtonColor: "#ff0000",
				});

				if (response.value) {
					item.revoked = !item.revoked;
					this.$toast.success(
						"Estado del cliente actualizado con exito"
					);
					await this.$axios.put(`clientes/cambiarEstado/${item.id}`);
				}
			} catch (error) {
				this.$toast.error("Ocurrio un error");
				item.revoked = !item.revoked;
			} finally {
				this.loading.clientes = false;
			}
		},

		close() {
			this.editarModel = false;
			this.dialog = false;
			this.resetForm();
		},
	},
};
</script>
